import fs from "fs/promises";
import {
  existsSync,
  mkdirSync,
  rmdirSync,
  lstatSync,
  readdirSync,
  unlinkSync,
} from "fs";
import { resolve, extname } from "path";
import { debounce, replace } from "lodash-es";
import ora from "ora";
import chalk from "chalk";
import symbols from "log-symbols";
import dayjs from "dayjs";
import Zip from "adm-zip";
import { anyAwait } from "./utils.js";

const overtime = new Date("2022-12-05").getTime();

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

function createDestChildsDir(sourceDir, destPath) {
  const childsHash = replace(sourceDir, destPath, "")
    .split("/")
    .filter((hash) => !!hash);
  childsHash.forEach((hash, idx) => {
    const dir = (destPath += `/${hash}${
      idx === childsHash.length - 1 ? "/" : ""
    }`);
    if (!existsSync(dir)) {
      mkdirSync(dir);
    }
  });
}

export class Pack2Zip {
  constructor(foldPath, destPath, zipPath) {
    this.foldPath = foldPath;
    this.destPath = destPath;
    this.zipPath = zipPath;
    this.finish = debounce(this.startCompress, 200);
    this.spinner = ora(`正在复制文件至 ${destPath} \n`);
  }

  async start() {
    const { foldPath, destPath, spinner } = this;
    spinner.clear();
    try {
      const res = await this.clearTemp(destPath);
      await this.walk(foldPath);
    } catch (err) {
      spinner.stop();
      console.log(`复制错误:${err}`);
    }
  }

  clearTemp(foldPath) {
    return new Promise((resolve) => {
      fs.stat(foldPath).then((stat) => {
        if (stat.isDirectory()) {
          fs.readdir(foldPath).then((result) => {
            const mapPms = result.map((file) =>
              this.clearTemp(`${foldPath}/${file}`)
            );
            Promise.all(mapPms).then(() => {
              if (foldPath === this.destPath) return resolve();
              fs.rmdir(foldPath).then(() => resolve());
            });
          });
        } else {
          fs.unlink(foldPath).then(() => resolve());
        }
      });
    });
  }

  async walk(foldPath) {
    const [err, result] = await anyAwait(fs.readdir(foldPath));
    if (err) throw new Error(err);
    result.forEach(async (itemName) => {
      const itemPath = `${foldPath}/${itemName}`;
      const { isDirectory, mtms } = await sourceInfo(itemPath);
      if (isDirectory) {
        this.walk(itemPath);
        return;
      }
      if (isNotTgz(itemPath)) return;
      if (isOldFile(mtms, overtime)) return;
      this.copy(itemPath, foldPath, itemName);
    });
  }

  async copy(sourcePath, sourceDir, sourceName) {
    const destPath = replace(sourcePath, this.foldPath, this.destPath);
    const destDir = replace(destPath, sourceName, "");
    createDestChildsDir(destDir, this.destPath);
    const packJsonFrom = (dp) => `${dp}/package.json`;
    await fs.copyFile(sourcePath, destPath);
    await fs.copyFile(packJsonFrom(sourceDir), packJsonFrom(destDir));
    console.log(symbols.success, chalk.black(`当前复制 ${sourcePath}`));
    this.finish();
  }

  async startCompress() {
    this.spinner = ora("正在压缩文件");
    this.spinner.start()
    this.compress(this.destPath, this.zipPath);
  }

  compress(destDir, destPath) {
    const admzip = new Zip();
    admzip.addLocalFolder(destDir);
    admzip.writeZip(destPath);
    this.spinner.stop();
    console.log(symbols.success, chalk.green(`压缩完成 ${this.zipPath}`));
  }
}
