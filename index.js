const send = require("koa-send")
const {extname}=require('path')
module.exports = function (opts) {
    let options = Object.assign({}, {
        mode: 'etag',
        root: process.cwd(),
        pathMatch: '*',
        extMatch: "*",
        setHeaders: null,
        index: "index.html"
    }, opts)
    return async(ctx, next) => {
        let path = ctx.path
        let ext = extname(path)
        ext == ext && ext.substring(1)//去除点
        options.setHeaders = function (res, path, stats) {
            if (stats.isFile() && options.mode &&
                (options.extMatch == "*" ||
                    (typeof options.extMatch == 'string' && options.extMatch == ext) ||
                    (options.extMatch instanceof Array && options.extMatch.indexOf(ext) > -1) ||
                    (options.extMatch instanceof RegExp && options.extMatch.test(ext))
                )) {
                if (options.mode == 'etag' || options.mode === true) {
                    let etag = `${stats.mtime.getTime().toString(16)}-${stats.size.toString(16)}`
                    let match = ctx.request.header && ctx.request.header['if-none-match']
                    if (match == etag) {
                        ctx.status = 304
                        return
                    } else {
                        ctx.set('Etag', etag)
                    }
                }

                if (options.mode == "lastModified") {
                    let lastModified = stats.mtime.toUTCString()
                    let match = ctx.request.header && ctx.request.header['if-modified-since']
                    if (match == lastModified) {
                        ctx.status = 304
                        return
                    } else {
                        ctx.set('Last-Modified', lastModified)
                    }
                }
            }
        }

        if (options.pathMatch == "*" ||
            ( typeof options.pathMatch == "string" && options.pathMatch == path) ||
            (options.pathMatch instanceof RegExp && options.pathMatch.test(path)) ||
            (typeof options.pathMatch == "function" && options.pathMatch(path))) {
            await send(ctx, path, {
                root: options.root,
                setHeaders: options.setHeaders,
                index: options.index
            });
        }
        await next()
    }
}