import fs from "fs";
import { resolve } from "path";
import { program } from "commander";
import ora from "ora";
import chalk from "chalk";
import symbols from "log-symbols";
import { CopyFile } from "./main.js";

const sourceDir = resolve("./test");
const destDir = resolve("./dist");

handDeliver(destDir, sourceDir);

function handDeliver(destPath, foldPath) {
  let ms = 0;
  const spinner = ora(`正在复制文件至 ${destPath} \n`);
  ms = new Date().getTime();
  spinner.start();
  new CopyFile(foldPath, destPath, () => {
    spinner.succeed(chalk.green(`复制完成 耗时${new Date().getTime() - ms}ms`));
  });
}

program.parse(process.argv);
