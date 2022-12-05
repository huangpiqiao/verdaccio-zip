import fs from "fs";
import { resolve, join } from "path";
import ora from "ora";
import chalk from "chalk";
import symbols from "log-symbols";
import { Command } from "commander";
import { Pack2Zip } from "./main.js";

const sourceDir = "/Users/wuzhuobin/Desktop/verdaccio/storage";
const destDir = join(sourceDir, "../temp");
const zipPath = join(sourceDir, "../npm.zip");

const program = new Command();
program
  .name("verdaccio-zip")
  .description("Compress relevant npm files into zip")
  // .version(require('../package.json').version)
  .option("-s, --source <url>", "verdaccio source", "")
  .parse(process.argv);

console.log(program.opts());

// handDeliver();

async function handDeliver() {
  let ms = 0;
  ms = new Date().getTime();
  if (sourceDir === destDir) {
    console.log(chalk.red("目录错误！"));
    return;
  }
  new Pack2Zip(sourceDir, destDir, zipPath).start();
}
