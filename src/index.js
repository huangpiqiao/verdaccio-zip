import fs from "fs";
import { resolve } from "path";
import { program } from "commander";
import ora from "ora";
import chalk from "chalk";
import symbols from "log-symbols";
import { CopyFile, clearFolder, compress } from "./main.js";

const sourceDir = "/Users/xxxx/Desktop/verdaccio/storage";
const destDir = resolve("./dist");
const compressName = "npm.zip";

handDeliver();

function handDeliver() {
  let ms = 0;
  const spinner = ora(`正在复制文件至 ${destDir} \n`);
  ms = new Date().getTime();
  spinner.start();
  if (sourceDir === destDir) {
    spinner.clear();
    console.log(chalk.red("目录错误！"));
    return;
  }
  clearFolder(destDir);
  new CopyFile(sourceDir, destDir, async () => {
    spinner.succeed(chalk.green(`复制完成 耗时${new Date().getTime() - ms}ms`));
    await compress(destDir, `./${compressName}`);
  });
}

program.parse(process.argv);
