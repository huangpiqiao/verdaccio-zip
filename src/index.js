import fs from "fs";
import { resolve, join } from "path";
import ora from "ora";
import chalk from "chalk";
import symbols from "log-symbols";
import { Command } from "commander";
import inquirer from "inquirer";
import { Pack2Zip } from "./main.js";
import { anyAwait, checkRoot, getDay } from "./utils.js";

async function getProgram() {
  const program = new Command();
  program
    .name("verdaccio-zip")
    .description("Compress relevant npm files into zip")
    .option("-s, --source <url>", "verdaccio source", "")
    .parse(process.argv);
  const opts = program.opts();
  if (checkRoot(opts.source)) {
    const sourceDir = opts.source;
    const destDir = join(sourceDir, "../temp");
    const zipPath = join(sourceDir, "../npm.zip");
    return { sourceDir, destDir, zipPath };
  }
  return null;
}

async function handDeliver() {
  const [, opts] = await anyAwait(getProgram());
  const prompts = [
    {
      type: "list",
      name: "选择时间",
      choices: getDay(7),
    },
  ];
  if (!opts) {
    return;
  }
  const [, result] = await anyAwait(inquirer.prompt(prompts));
  console.log(symbols.warning, chalk.yellow(`选择时间${result["选择时间"]}`));
  // new Pack2Zip({
  //   ...opts,
  //   selectedDate: result["选择时间"],
  // }).start();
}

handDeliver();
