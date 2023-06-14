import fs from "fs";
import { join } from "path";
import { Command } from "commander";
// import replace from "lodash/replace";
import last from "lodash/last";
// import inquirer from "inquirer";
import { Pack2Zip } from "./main.js";
import { anyAwait, checkRoot, getJson, conso } from "./utils.js";

function getVersion() {
  const pack = getJson(join(__dirname, "../package.json"));
  return pack.version;
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
    const packPath = join(sourceDir, "../package/package-lock.json");
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir);
      conso.warn(`已创建缓存目录 ${destDir}`);
    }
    return { sourceDir, destDir, zipPath, packPath };
  } else {
    conso.error(`请添加npm包下载目录！`);
  }
  return null;
}

function mapPackages(packages) {
  return Object.entries(packages)
    .filter(([key]) => !!key)
    .map(([key, item]) => {
      const packPath = last(key.split("node_modules/"));
      const packName = last(key.split("/"));
      return {
        packPath,
        packName,
        version: item.version,
        remoteUrl: item.resolved,
      };
    });
}

// 16一下版本使用
function mapDependencies(dependencies, result = []) {
  Object.entries(dependencies).forEach(([key, item]) => {
    const packName = last(key.split("/"));
    const packPath = key;
    result.push({
      packPath,
      packName,
      version: item.version,
      remoteUrl: item.resolved,
    })
    if(item.dependencies) {
      mapDependencies(item.dependencies, result);
    }
  });
  return result;
}

async function run() {
  const [, opts] = await anyAwait(getProgram());
  if (!opts) return;
  const { packPath } = opts;
  if (!fs.existsSync(packPath)) {
    conso.error(`文件不存在！${packPath}`);
    return;
  }
  // console.log(getJson(packPath).dependencies);
  const lockJson = getJson(packPath);
  let packages = [];
  // 16以上版本
  if(lockJson.packages) {
    packages = mapPackages(lockJson.packages);
  } else {
    packages = mapDependencies(lockJson.dependencies)
  }
  console.log('packages', packages);
  if (!opts) {
    conso.error(`需要 -s/--source 添加verdaccio/storage目录`);
    return;
  }
  // const [, result] = await anyAwait(inquirer.prompt(prompts));
  // const selectedDate = result["选择时间"];
  // selectedDate && conso.warn(`选择${result["选择时间"]}或之后更新的npm包`);
  await new Pack2Zip({
    ...opts,
    packages,
    // selectedDate: selectedDate || "",
  }).start("map");
}

run();
