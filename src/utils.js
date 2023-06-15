import fs from "fs/promises";
import { readFileSync, mkdirSync, existsSync } from "fs";
import dayjs from "dayjs";
import chalk from "chalk";
import symbols from "log-symbols";
import { extname, join } from "path";
import replace from "lodash/replace";

export const conso = {
  warn(context) {
    console.log(symbols.warning, chalk.yellow(context));
  },
  error(context) {
    console.log(symbols.error, chalk.red(context));
  },
  success(context) {
    console.log(symbols.success, chalk.green(context));
  },
  info(context) {
    console.log(symbols.info, chalk.black(context));
  },
};

export function getJson(path) {
  const json = readFileSync(path, {
    encoding: "utf-8",
  });
  return JSON.parse(json);
}

export function anyAwait(pms) {
  if (!pms || !pms.then) throw new Error("anyAwait:参数必须是promise");
  return pms.then((res) => [null, res]).catch((err) => [err, null]);
}

export function checkRoot(p = "") {
  return !!p && p !== "/";
}

export function getDay(days = 7) {
  return new Array(days).fill("").map((item, idx) => {
    return dayjs(new Date()).subtract(idx, "day").format("YYYY-MM-DD");
  });
}

export function clearDir(target) {
  function clear(sourceDir) {
    return new Promise((resolve) => {
      fs.stat(sourceDir).then((stat) => {
        if (stat.isDirectory()) {
          fs.readdir(sourceDir).then((result) => {
            const mapPms = result.map((file) => clear(`${sourceDir}/${file}`));
            Promise.all(mapPms).then(() => {
              // 不删除目标文件夹
              if (sourceDir === target) return resolve();
              fs.rmdir(sourceDir).then(() => resolve());
            });
          });
        } else {
          fs.unlink(sourceDir).then(() => resolve());
        }
      });
    });
  }
  return clear(target).then(() => true);
}

export const prompts = [
  {
    type: "list",
    name: "选择查找方式",
    choices: [
      {
        name: "根据verdaccio/storage目录内下载的最新的npm包查找",
        value: "walk",
      },
      {
        name: "根据verdaccio/package项目内的package-lock.json查找",
        value: "map",
      },
    ],
  },
  {
    type: "list",
    name: "选择时间",
    choices: getDay(12),
    when: (answer) => {
      return answer["选择查找方式"] === "walk";
    },
  },
];

export function isNotTgz(sourcePath) {
  return extname(sourcePath) !== ".tgz";
}

export function isOldFile(mtms, ot) {
  return mtms < ot;
}

export async function sourceInfo(sourcePath) {
  const stat = await fs.stat(sourcePath);
  const info = {
    mtime: stat.mtime,
    mtms: new Date(stat.mtime).getTime(),
    isDirectory: stat.isDirectory(),
  };
  return info;
}

export function createDestChildsDir(sourceDir, destDir) {
  let split = process.platform === 'win32' ? '\\' : '/';
  let dir = destDir;
  const childsHash = replace(sourceDir, destDir, "")
    .split(split)
    .filter((hash) => !!hash);
  childsHash.forEach((hash, idx) => {
    dir = join(dir, `/${hash}${
      idx === childsHash.length - 1 ? "/" : ""
    }`)
    // console.log(childsHash, dir);
    if (!existsSync(dir)) {
      mkdirSync(dir);
    }
  });
}
