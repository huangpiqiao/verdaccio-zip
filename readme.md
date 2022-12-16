# verdaccio-zip
根据package-lock.json的依赖配置，将verdaccio下载的npm包(tgz)打包压缩成zip

## 下载
```js
npm install -g verdaccio-zip
```

## 用法
#### 1、将verdaccio的npm包下载目录设置为 */User/xxx/verdaccio/storage*
#### 2、运行 *verdaccio-zip -s /User/xxx/verdaccio/storage*
#### 3、在/User/xxx/verdaccio目录下新建命名为package的*npm*项目，使用*npm install*安装需要压缩的npm包
#### 4、npm包最终复制到*verdaccio/temp*目录，并生成压缩文件至*verdaccio/npm.zip*