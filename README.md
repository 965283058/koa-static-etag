koa-static-etag
===================

Installation
--------

Install the plugin with npm:

```shell
$ npm install koa-static-etag --save-dev
```


API
--------

```shell
const Koa = require('koa');
const app = new Koa();
app.use(require('koa-static-etag')(opts));
```

Options
---------------------
- `mode` 可以是'etag'、'lastModified'、true 、false四种选项 如果是lastModified，则启用Last-Modified机制.如果是false,则不进行304机制检测。默认是 true，使用Etag机制.
- `root` 静态资源的根目录, 默认是 `process.cwd()`.
- `pathMatch` 请求路径的匹配规则，可以是 字符串、正则或者函数(返回true或者false,参数是当前url请求的路径)
- `extMatch` 请求文件后缀名的可以进行Etag或lastModified的规则匹配，可以是 字符串、正则或者函数(返回true或者false,参数是当前请求文件的扩展名)
- `index` 请求的默认文件，防止当前请求没有文件响应，默认是'index.html'
 
Example
---------------------

```javasrcipt
let koa = require('koa2');    
let app = new koa();
let staticEtag = require('koa-static-etag')
    
app.use(staticEtag({
    root: __dirname,
    pathMatch: /^(\/tm-admin)|(\/static)/, //tm-admin和static目录下可以返回静态资源
    extMatch: /[^(mp4)]$/i,  //MP4格式的视频不进行304缓存
    mode:true
})) 
```