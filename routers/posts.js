const router = require('koa-router')();
const userModel = require('../lib/mysql.js')
const moment = require('moment')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin;
const md = require('markdown-it')();



// 文章页
router.get('/', async (ctx, next) => {
    let res,
        postsLength,
        pagesArr;
    await userModel.findPostByPage(1)
        .then(result => {
            //console.log(result)
            res = result
        })
    await userModel.findAllPost()
        .then(result => {
            postsLength = result.length
        })
    await userModel.findPageInfoById()
        .then(result => {
            pagesArr = result;
        })
    await ctx.render('posts', {
        session: ctx.session,
        posts: res,
        postsLength: postsLength,
        pagesArr: pagesArr,
        postsPageLength: Math.ceil(postsLength / 5),

    })

})

// 首页分页，每次输出10条
router.post('/post/page', async (ctx, next) => {
    let page = ctx.request.body.page;
    await userModel.findPostByPage(page)
        .then(result => {
            //console.log(result)
            ctx.body = result
        }).catch(() => {
            ctx.body = 'error'
        })
})

// 单篇文章页
router.get('/post/:postId', async (ctx, next) => {
    let res,
        comres,
        pageOne,
        res_pv,
        pagesArr,
        res_summary;
    await userModel.findDataById(ctx.params.postId)
        .then(result => {
            res = result[0]
            res_summary = result[0].md.substr(0, 50)
            res_pv = parseInt(result[0]['pv'])
            res_pv += 1
            // console.log(res_pv)
        })
    await userModel.findPageInfoById()
        .then(result => {
            pagesArr = result;
        })
    await userModel.findComments(ctx.params.postId)
        .then(result => {
            comres = result;
        })
    await userModel.updatePostPv([res_pv, ctx.params.postId])
    console.log(res.id)
    await ctx.render('sPost', {
        session: ctx.session,
        posts: res,
        comments: comres,
        comments_length: comres.length,
        pagesArr: pagesArr,
        pageOne: pageOne,
        Summary: res_summary
    })

})

// 发表文章页面
router.get('/create', async (ctx, next) => {
    await checkLogin(ctx)
    await ctx.render('create', {
        session: ctx.session,
    })
})

// post 发表文章
router.post('/create', async (ctx, next) => {
    let title = ctx.request.body.title,
        content = ctx.request.body.content,
        time = moment().format('MMM, Do, YYYY'),
        allow = true,
        // 现在使用markdown不需要单独转义
        newContent = content.replace(/[<">']/g, (target) => {
            return {
                '<': '&lt;',
                '"': '&quot;',
                '>': '&gt;',
                "'": '&#39;'
            }[target]
        }),
        newTitle = title.replace(/[<">']/g, (target) => {
            return {
                '<': '&lt;',
                '"': '&quot;',
                '>': '&gt;',
                "'": '&#39;'
            }[target]
        });
    if (ctx.session.user) {
        allow = true
    } else {
        allow = false
    }
    //console.log([name, newTitle, content, id, time])
    if (allow) {
        await userModel.insertPost([newTitle, md.render(content), content, time])
            .then(() => {
                ctx.body = true
            }).catch(() => {
                ctx.body = false
            })
    } else {
        ctx.body = 'error'
    }

})



// 编辑单篇文章页面
router.get('/post/:postId/edit', async (ctx, next) => {
    let name = ctx.session.user,
        postId = ctx.params.postId,
        res;
    await checkLogin(ctx)
    await userModel.findDataById(postId)
        .then(result => {
            res = result[0]
        })
    await ctx.render('edit', {
        session: ctx.session,
        postsContent: res.md,
        postsTitle: res.title
    })

})

// post 编辑单篇文章
router.post('/post/:postId/edit', async (ctx, next) => {
    let title = ctx.request.body.title,
        content = ctx.request.body.content,
        id = ctx.session.id,
        postId = ctx.params.postId,
        allowEdit = true;
    // 现在使用markdown不需要单独转义
    newTitle = title.replace(/[<">']/g, (target) => {
        return {
            '<': '&lt;',
            '"': '&quot;',
            '>': '&gt;',
            "'": '&#39;'
        }[target]
    }),
        newContent = content.replace(/[<">']/g, (target) => {
            return {
                '<': '&lt;',
                '"': '&quot;',
                '>': '&gt;',
                "'": '&#39;'
            }[target]
        });
    await userModel.findDataById(postId)
        .then(res => {
            // console.log(Boolean('ctx.session.user'))
            if (res[0].id === postId && ctx.session.user) {
                allowEdit = false
            } else {
                allowEdit = true
            }
        })
    if (allowEdit) {
        await userModel.updatePost([newTitle, md.render(content), content, postId])
            .then(() => {
                ctx.body = true
            }).catch(() => {
                ctx.body = false
            })
    } else {
        ctx.body = 'error'
    }
})

// 删除单篇文章
router.post('/post/:postId/remove', async (ctx, next) => {
    let postId = ctx.params.postId,
        allow;
    if (ctx.session.user) {
        allow = true
    } else {
        allow = false
    }
    if (allow) {
        await userModel.deletePost(postId)
            .then(() => {
                ctx.body = {
                    data: 1
                }
            }).catch(() => {
                ctx.body = {
                    data: 2
                }
            })
        await userModel.deleteCommentsByLink(postId);
    } else {
        ctx.body = {
            data: 3
        }
    }
})


module.exports = router