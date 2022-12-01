import fs from "fs";
import { resolve } from "path";
import ora from "ora";
import chalk from "chalk";
import symbols from "log-symbols";
import { Pack2Zip } from "./main.js";

const sourceDir = "/Users/xxx/Desktop/verdaccio/storage";
const destDir = "/Users/xxx/Desktop/verdaccio/temp";
const zipPath = "/Users/xxx/Desktop/verdaccio/npm.zip";

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
