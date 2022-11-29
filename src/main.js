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

const overtime = new Date("2022-11-28").getTime();

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
    this.cb();
  }

  finally(cb) {
    cb();
  }
}

export function clearFolder(foldPath) {
  // console.log(foldPath)
  if (existsSync(foldPath)) {
    const files = readdirSync(foldPath);
    if (!files || files.length === 0) return;
    files.forEach((file) => {
      const curPath = `${foldPath}/${file}`;
      if (lstatSync(curPath).isDirectory()) {
        clearFolder(curPath);
      } else {
        unlinkSync(curPath);
      }
    });
    rmdirSync(foldPath)
  } else {
    mkdirSync(foldPath);
  }
}
