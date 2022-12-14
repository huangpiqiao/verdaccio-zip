import fs from "fs";
import { join } from "path";
import chalk from "chalk";
import symbols from "log-symbols";
import { Command } from "commander";
import inquirer from "inquirer";
import { Pack2Zip } from "./main.js";
import { anyAwait, checkRoot, getDay } from "./utils.js";

function getVersion() {
  const pack = fs.readFileSync(join(__dirname, "../package.json"), {
    encoding: "utf-8",
  });
  return JSON.parse(pack).version;
}

async function getProgram() {
  const program = new Command();
  program
    .name("verdaccio-zip")
    .description("Compress relevant npm files into zip")
    .version(getVersion(), "-v --version")
    .option("-s, --source <url>", "verdaccio source", "")
    .parse(process.argv);
  const opts = program.opts();
  if (checkRoot(opts.source)) {
    const sourceDir = opts.source;
    const destDir = join(sourceDir, "../temp");
    const zipPath = join(sourceDir, "../npm.zip");
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir);
      console.log(symbols.warning, chalk.yellow(`已创建缓存目录 ${destDir}`));
    }
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
      choices: getDay(12),
    },
  ];
  if (!opts) {
    console.log(
      symbols.error,
      chalk.red(`需要 -s/--source 添加verdaccio/storage目录`)
    );
    return;
  }
  const [, result] = await anyAwait(inquirer.prompt(prompts));
  console.log(
    symbols.warning,
    chalk.yellow(`选择${result["选择时间"]}或之后更新的npm包`)
  );
  new Pack2Zip({
    ...opts,
    selectedDate: result["选择时间"],
  }).start();
}

handDeliver();
