import fs from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
// import debounce from "lodash/debounce";
import replace from "lodash/replace";
import ora from "ora";
import Zip from "adm-zip";
import {
  anyAwait,
  clearDir,
  conso,
  isNotTgz,
  isOldFile,
  sourceInfo,
  createDestChildsDir,
} from "./utils.js";
import download from "download";

export class Pack2Zip {
  constructor({ sourceDir, destDir, zipPath, packages, selectedDate }) {
    this.sourceDir = sourceDir;
    this.destDir = destDir;
    this.zipPath = zipPath;
    this.packages = packages;
    this.selectedDate = new Date(selectedDate).getTime();
    // this.finish = debounce(this.startCompress, 1000);
    this.spinner = ora(`正在复制文件至 ${destDir} \n`);
  }

  async start(type = "walk") {
    const { sourceDir, destDir, spinner } = this;
    spinner.clear();
    const [err] = await anyAwait(clearDir(destDir));
    if (err) {
      spinner.stop();
      conso.error(`复制错误:${err}`);
      return;
    }
    this.spinner.start();
    if (type === "walk") {
      await this.walk(sourceDir);
    } else {
      await this.map();
    }
    this.spinner.stop();
    conso.success(`复制文件完成`);
    this.startCompress();
  }

  async map() {
    const { sourceDir, packages } = this;
    for (const item of packages) {
      const packageDir = join(sourceDir, item.packPath);
      const itemName = `${item.packName}-${item.version}.tgz`;
      const packagePath = join(packageDir, itemName);
      const packageJsonPath = join(sourceDir, 'data', item.packPath);
      await this.shouildDownloadFile(item.remoteUrl, packagePath, packageDir);
      await this.copy(packagePath, packageJsonPath, itemName);
    }
  }

  async walk(sourceDir) {
    const [err, result] = await anyAwait(fs.readdir(sourceDir));
    if (err) throw new Error(err);
    for (const itemName of result) {
      const itemPath = `${sourceDir}/data/${itemName}`;
      const { isDirectory, mtms } = await sourceInfo(itemPath);
      if (isDirectory) {
        await this.walk(itemPath);
        continue;
      }
      if (isNotTgz(itemPath)) continue;
      if (isOldFile(mtms, this.selectedDate)) continue;
      await this.copy(itemPath, sourceDir, itemName);
    }
  }

  async copy(sourcePath, sourceDir, sourceName) {
    const destPath = replace(sourcePath, this.sourceDir, this.destDir);
    const destDir = replace(destPath, sourceName, "");
    createDestChildsDir(destDir, this.destDir);
    const packJsonFrom = (dp) => `${dp}/package.json`;
    conso.warn(`当前复制 ${sourcePath} => ${destPath}`);
    await fs.copyFile(sourcePath, destPath).catch(() => {
      conso.error(`复制失败`);
    });
    conso.success(`复制成功`);
    conso.warn(`当前复制 ${packJsonFrom(sourceDir)} => ${packJsonFrom(destDir)}`);
    await fs.copyFile(packJsonFrom(sourceDir), packJsonFrom(destDir)).catch(() => {
      conso.error(`复制失败`);
    });
    conso.success(`复制成功`);
    // this.finish && this.finish();
  }

  shouildDownloadFile(remoteUrl, packagePath, packageDir) {
    return new Promise((resolve) => {
      if (!existsSync(packagePath)) {
        // this.finish = null;
        conso.warn(`正在下载 ${packagePath}`);
        download(remoteUrl, packageDir).then(() => {
          conso.success(`下载完成 ${remoteUrl}`);
          // this.finish = debounce(this.startCompress, 1000);
          resolve();
        });
        return;
      }
      resolve();
    });
  }

  startCompress() {
    this.spinner = ora("正在压缩文件\n");
    this.spinner.start();
    this.compress();
  }

  compress() {
    const admzip = new Zip();
    admzip.addLocalFolder(this.destDir);
    admzip.writeZip(this.zipPath);
    this.spinner.stop();
    conso.success(`压缩文件完成`);
  }
}
