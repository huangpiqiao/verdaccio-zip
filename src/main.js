import fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import { extname } from "path";
import debounce from "lodash/debounce";
import replace from "lodash/replace";
import ora from "ora";
import Zip from "adm-zip";
import { anyAwait, clearDir, conso } from "./utils.js";

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
  constructor({ sourceDir, destDir, zipPath, packages, selectedDate }) {
    this.sourceDir = sourceDir;
    this.destDir = destDir;
    this.zipPath = zipPath;
    this.packages = packages;
    this.selectedDate = new Date(selectedDate).getTime();
    this.finish = debounce(this.startCompress, 200);
    this.spinner = ora(`正在复制文件至 ${destDir} \n`);
  }

  async start(type = "walk") {
    const { sourceDir, destDir, spinner, packages } = this;
    spinner.clear();
    const [err] = await anyAwait(clearDir(destDir));
    if (err) {
      spinner.stop();
      conso.error(`复制错误:${err}`);
      return;
    }
    if (type === "walk") {
      this.walk(sourceDir);
    } else {
      this.map();
    }
  }

  async map() {
    const { sourceDir, packages } = this;
    packages.forEach((item) => {
      console.log(item);
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
    conso.info(`当前复制 ${sourcePath}`)
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
    conso.success(`压缩完成 ${this.zipPath}`)
  }
}
