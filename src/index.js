import fs from "fs";
import { resolve } from "path";
import { program } from "commander";
import ora from "ora";
import chalk from "chalk";
import symbols from "log-symbols";

const sourceDir = resolve("./test");
const destDir = resolve("./dist");

console.log(destDir,sourceDir)

handDeliver(destDir, sourceDir);

function handDeliver(destPath, filePath) {
  const spinner = ora(`正在复制文件至 ${destPath}`);
  spinner.start()
  copyFile().then(() => {
    
  });

  function copyFile() {
    // deleteFolder(destPath);
    const hashSet = fs.readdirSync(filePath);
    hashSet.forEach((item) => {
      const file = `${filePath}/${item}`;
      console.log(file,fs.existsSync(file))
      // if (!fs.existsSync(file)) return;
      // fs.copyFileSync(file, `${destPath}/${item}`);
    });
    spinner.succeed();
    // console.log(symbols.success, chalk.green(`复制完成 ${new Date()}`));
    return Promise.resolve();
  }

  function deleteFolder(targetPath) {
    if (fs.existsSync(targetPath)) {
      const files = fs.readdirSync(targetPath);
      if (!files || files.length === 0) return;
      files.forEach((file) => {
        const curPath = `${targetPath}/${file}`;
        if (fs.lstatSync(curPath).isDirectory()) {
          deleteFolder(curPath);
        } else {
          fs.unlinkSync(curPath);
        }
      });
      if (targetPath !== destPath) {
        fs.rmdirSync(targetPath);
      }
    } else {
      fs.mkdirSync(targetPath);
    }
  }
}

program.parse(process.argv);
