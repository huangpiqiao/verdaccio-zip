# verdaccio-zip
根据package-lock.json的依赖配置，将verdaccio下载的npm包(tgz)打包压缩成zip

## 下载
```js
npm install -g verdaccio-zip
```

## 用法
#### 1、将verdaccio的npm包下载目录设置为 */Users/xxx/verdaccio/storage* (未安装verdaccio则直接创建目录)
#### 2、在 */Users/xxx/verdaccio*目录下新建命名为 *package*的项目， *npm init*初始化后使用*npm install*安装npm包
#### 3、执行命令，工具会根据 *package-lock.json*下载npm包
```js
verdaccio-zip -s /Users/xxx/verdaccio/storage
```
#### 4、下载的npm包最终复制到*verdaccio/temp*目录，并生成压缩文件至*verdaccio/npm.zip*
