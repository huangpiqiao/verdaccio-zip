import fs from "fs";
import { resolve, join } from "path";
import ora from "ora";
import chalk from "chalk";
import symbols from "log-symbols";
import { Pack2Zip } from "./main.js";

const sourceDir = "/Users/xxxx/Desktop/verdaccio/storage";
const destDir = join(sourceDir, "../temp");
const zipPath = join(sourceDir, "../npm.zip");

handDeliver();

async function handDeliver() {
  let ms = 0;
  ms = new Date().getTime();
  if (sourceDir === destDir) {
    console.log(chalk.red("目录错误！"));
    return;
  }
  new Pack2Zip(sourceDir, destDir, zipPath).start();
}
