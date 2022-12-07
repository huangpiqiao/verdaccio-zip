import fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import { resolve, extname } from "path";
import { debounce, replace } from "lodash-es";
import ora from "ora";
import chalk from "chalk";
import symbols from "log-symbols";
import Zip from "adm-zip";
import { anyAwait } from "./utils.js";

function isNotTgz(sourcePath) {
  return extname(sourcePath) !== ".tgz";
}

function isOldFile(mtms, ot) {
  return mtms < ot;
}

async function sourceInfo(sourcePath) {
  const stat = await fs.stat(sourcePath);
  const info = {
    mtime: stat.mtime,
    mtms: new Date(stat.mtime).getTime(),
    isDirectory: stat.isDirectory(),
  };
  return info;
}

function createDestChildsDir(sourceDir, destDir) {
  const childsHash = replace(sourceDir, destDir, "")
    .split("/")
    .filter((hash) => !!hash);
  childsHash.forEach((hash, idx) => {
    const dir = (destDir += `/${hash}${
      idx === childsHash.length - 1 ? "/" : ""
    }`);
    if (!existsSync(dir)) {
      mkdirSync(dir);
    }
  });
}

export class Pack2Zip {
  constructor({ sourceDir, destDir, zipPath, selectedDate }) {
    this.sourceDir = sourceDir;
    this.destDir = destDir;
    this.zipPath = zipPath;
    this.selectedDate = new Date(selectedDate).getTime();
    this.finish = debounce(this.startCompress, 200);
    this.spinner = ora(`正在复制文件至 ${destDir} \n`);
  }

  async start() {
    const { sourceDir, destDir, spinner } = this;
    spinner.clear();
    try {
      const res = await this.clearTemp(destDir);
      await this.walk(sourceDir);
    } catch (err) {
      spinner.stop();
      console.log(`复制错误:${err}`);
    }
  }

  clearTemp(sourceDir) {
    return new Promise((resolve) => {
      fs.stat(sourceDir).then((stat) => {
        if (stat.isDirectory()) {
          fs.readdir(sourceDir).then((result) => {
            const mapPms = result.map((file) =>
              this.clearTemp(`${sourceDir}/${file}`)
            );
            Promise.all(mapPms).then(() => {
              if (sourceDir === this.destDir) return resolve();
              fs.rmdir(sourceDir).then(() => resolve());
            });
          });
        } else {
          fs.unlink(sourceDir).then(() => resolve());
        }
      });
    });
  }

  async walk(sourceDir) {
    const [err, result] = await anyAwait(fs.readdir(sourceDir));
    if (err) throw new Error(err);
    result.forEach(async (itemName) => {
      const itemPath = `${sourceDir}/${itemName}`;
      const { isDirectory, mtms } = await sourceInfo(itemPath);
      if (isDirectory) {
        this.walk(itemPath);
        return;
      }
      if (isNotTgz(itemPath)) return;
      if (isOldFile(mtms, this.selectedDate)) return;
      this.copy(itemPath, sourceDir, itemName);
    });
  }

  async copy(sourcePath, sourceDir, sourceName) {
    const destPath = replace(sourcePath, this.sourceDir, this.destDir);
    const destDir = replace(destPath, sourceName, "");
    createDestChildsDir(destDir, this.destDir);
    const packJsonFrom = (dp) => `${dp}/package.json`;
    await fs.copyFile(sourcePath, destPath);
    await fs.copyFile(packJsonFrom(sourceDir), packJsonFrom(destDir));
    console.log(symbols.success, chalk.black(`当前复制 ${sourcePath}`));
    this.finish();
  }

  async startCompress() {
    this.spinner = ora("正在压缩文件");
    this.spinner.start();
    this.compress();
  }

  compress() {
    const admzip = new Zip();
    admzip.addLocalFolder(this.destDir);
    admzip.writeZip(this.zipPath);
    this.spinner.stop();
    console.log(symbols.success, chalk.green(`压缩完成 ${this.zipPath}`));
  }
}
