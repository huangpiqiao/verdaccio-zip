import fs from "fs";
import { resolve, extname } from "path";
import fse from "fs-extra";
import { debounce } from "lodash-es";
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

function sourceInfo(sourcePath) {
  const stat = fs.statSync(sourcePath);
  const info = {
    mtime: stat.mtime,
    mtms: new Date(stat.mtime).getTime(),
    isDirectory: stat.isDirectory(),
  };
  return info;
}

function reversePath(source, dest) {}

export class CopyFile {
  constructor(foldPath, destPath, cb) {
    this.foldPath = foldPath;
    this.destPath = destPath;
    this.cb = debounce(cb, 200);
    this.walk(foldPath);
  }

  walk(foldPath) {
    fs.readdir(foldPath, (err, result) => {
      if (err) throw new Error(err);
      result.forEach((item) => {
        const itemPath = `${foldPath}/${item}`;
        const { isDirectory, mtms } = sourceInfo(itemPath);
        if (isDirectory) {
          this.walk(itemPath);
          return;
        }
        if (isNotTgz(itemPath)) return;
        if (isOldFile(mtms, overtime)) return;
        console.log(itemPath);
        this.cb();
      });
    });
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
