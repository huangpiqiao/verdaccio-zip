# verdaccio-zip
将verdaccio下载的taz包压缩成zip

## 下载
```js
npm install -g verdaccio-zip
```

## 用法
```js
// taz包位于verdaccio/storage目录

verdaccio-zip -s /User/xxx/verdaccio/storage

// 可选taz包的下载日期
```
taz最终复制到verdaccio/temp目录，并生成压缩文件至verdaccio/npm.zip