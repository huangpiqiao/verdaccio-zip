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
  .option("-d, --date <date>", "verdaccio date", "")
  .parse(process.argv);

console.log(program.opts());

// handDeliver();

async function handDeliver() {
  
  new Pack2Zip(sourceDir, destDir, zipPath).start();
}
