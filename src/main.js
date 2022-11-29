import fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import { resolve, extname } from "path";
import fse from "fs-extra";
import { debounce, replace } from "lodash-es";
import ora from "ora";
import chalk from "chalk";
import symbols from "log-symbols";
import dayjs from "dayjs";

const overtime = new Date("2022-11-20").getTime();

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
    if(!existsSync(dir)){
      mkdirSync(dir);
    }
  });
}

export class CopyFile {
  constructor(foldPath, destPath, cb) {
    this.foldPath = foldPath;
    this.destPath = destPath;
    this.cb = debounce(cb, 200);
    this.walk(foldPath);
  }

  async walk(foldPath) {
    const [result, err] = await fs
      .readdir(foldPath)
      .then((res) => [res, null])
      .catch((err) => [null, err]);
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
      this.copy(itemPath, itemName);
    });
  }

  async copy(sourcePath, sourceName) {
    const destPath = replace(sourcePath, this.foldPath, this.destPath);
    const sourceDir = replace(destPath, sourceName, "");
    // console.log(existsSync(sourceDir), sourceDir, sourceName);
    createDestChildsDir(sourceDir, this.destPath);
    fs.copyFile(sourcePath, destPath);
    this.cb();
  }

  finally(cb) {
    cb();
  }
}

function copyFile(source, dest) {
  fs.copyFile(() => {
    spinner.succeed(chalk.green(`复制完成 ${dest}`));
  });
}

export function clearFolder(foldPath) {
  if (fs.existsSync(foldPath)) {
    const files = fs.readdirSync(foldPath);
    if (!files || files.length === 0) return;
    files.forEach((file) => {
      const curPath = `${foldPath}/${file}`;
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolder(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    // if (foldPath !== destPath) {
    //   fs.rmdirSync(foldPath);
    // }
  } else {
    fs.mkdirSync(foldPath);
  }
}
