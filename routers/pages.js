const router = require('koa-router')();
const userModel = require('../lib/mysql.js')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin;
const md = require('markdown-it')();

// 单页面
router.get('/s/:linkname', async (ctx, next) => {
    let res, pagesArr, comres;
    await userModel.findPageDataByLink(ctx.params.linkname)
        .then(result => {
            //console.log(result )
            res = result
            console.log(res[0])
        })
    await userModel.findPageInfoById()
        .then(result => {
            pagesArr = result;
        })
    await userModel.findComments(ctx.params.linkname)
        .then(result => {
            comres = result;
        })
    await ctx.render('sPage', {
        session: ctx.session,
        comments: comres,
        comments_length: comres.length,
        pagesArr: pagesArr,
        pages: res[0]
    })

})


// 创建页面
router.get('/createpage', async (ctx, next) => {
    await checkLogin(ctx)
    await ctx.render('createpage', {
        session: ctx.session,
    })
})

// post 创建新页面
router.post('/createpage', async (ctx, next) => {
    let linkname = ctx.request.body.linkname,
        title = ctx.request.body.title,
        content = ctx.request.body.content,
        hascom = ctx.request.body.hascom,
        allowEdit = true,
        newTitle = title.replace(/[<">']/g, (target) => {
            return {
                '<': '&lt;',
                '"': '&quot;',
                '>': '&gt;',
                "'": '&#39;'
            }[target]
        });
    // let  reg = /[a-zA-Z0-9_]{1,10}/;
    let reg = /^\d*([a-zA-Z])+\d*$/;
    // [\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}
    // console.log([linkname,name, newTitle, md.render(content), content,typeof hascom])

    if (!ctx.session.user) {
        allowEdit = false
    } else {
        // allowEdit = true
        await userModel.findPageDataByLink(linkname)
            .then(result => {
                let cln = result;
                if (result.length === 0) {
                    allowEdit = true
                } else {
                    allowEdit = false
                }
            })
    }
    if (linkname.match(reg) === null || hascom.match(reg) === null) {
        ctx.body = 'unallow'
    } else {
        if (allowEdit) {
            await userModel.insertPage([linkname.match(reg)[0], newTitle, md.render(content), content, hascom.match(reg)[0]])
                .then(() => {
                    ctx.body = true
                }).catch(() => {
                    ctx.body = false
                })
        } else {
            ctx.body = 'error'
        }
    }

})

// 编辑单页面
router.get('/s/:linkname/edit', async (ctx, next) => {
    let name = ctx.session.user,
        linkname = ctx.params.linkname,
        res;
    await checkLogin(ctx)
    await userModel.findPageDataByLink(linkname)
        .then(result => {
            res = result[0];
            console.log(result)
        })
    await ctx.render('editpage', {
        session: ctx.session,
        pagesContent: res.content,
        pagesLinkname: res.linkname,
        pagesTitle: res.title,
        pagesHascom: res.hascom
    })

})

// post 编辑单页面
router.post('/s/:linkname/edit', async (ctx, next) => {
    let title = ctx.request.body.title,
        content = ctx.request.body.content,
        description = ctx.request.body.description,
        hascom = ctx.request.body.hascom,
        linkname = ctx.params.linkname,
        ln = ctx.request.body.linkname,
        pageid,
        allowEdit = true,
        // 现在使用markdown不需要单独转义
        newTitle = title.replace(/[<">']/g, (target) => {
            return {
                '<': '&lt;',
                '"': '&quot;',
                '>': '&gt;',
                "'": '&#39;'
            }[target]
        });
    // let  reg = /[a-zA-Z0-9_]{1,10}/;
    let reg = /^\d*([a-zA-Z])+\d*$/;
    // console.log(ln.match(reg))
    await userModel.findPageDataByLink(linkname)
        .then(res => {
            // console.log(res[0].name,ctx.session.user)
            if (!ctx.session.user) {
                allowEdit = false
            } else {
                console.log(res[0].id)
                pageid = res[0].id
                allowEdit = true
            }
        })
    if (ln.match(reg) === null || hascom.match(reg) === null) {
        ctx.body = 'unallow'
    } else {
        if (allowEdit) {
            await userModel.updatePage([ln.match(reg)[0], newTitle, content, md.render(content), hascom.match(reg)[0], pageid])
                .then(() => {
                    ctx.body = true
                }).catch(() => {
                    ctx.body = false
                })
        } else {
            ctx.body = 'error'
        }
    }
})

// 删除单页面
router.post('/s/:linkname/remove', async (ctx, next) => {
    let linkname = ctx.params.linkname;
    if (ctx.session.user) {
        await userModel.deleteCommentsByLink(linkname);
        await userModel.deletePage(linkname)
            .then(() => {
                ctx.body = {
                    data: 1
                }
            }).catch(() => {
                ctx.body = {
                    data: 2
                }
            })
    } else {
        ctx.body = {
            data: 3
        }
    }
})

module.exports = router