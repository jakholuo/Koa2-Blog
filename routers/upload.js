const router = require('koa-router')();
const userModel = require('../lib/mysql.js')
const moment = require('moment')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin;
const fs = require('fs')

//上传图片页面
router.get('/uploadimg', async (ctx, next) => {
    await checkLogin(ctx)
    await ctx.render('uploadimg', {
        session: ctx.session,
    })
})

// post 上传图片
router.post('/uploadimg/upload', async (ctx, next) => {
    let img = ctx.request.body.img,
        imgname = moment().unix(),
        time = moment().format('YYYY-MM-DD HH:mm:ss'),
        allowEdit = true;
    if (!ctx.session.user) {
        allowEdit = false
    } else {
        allowEdit = true
    }
    if (allowEdit) {
        let imgBuffer = new Buffer(img, 'base64');
        // console.log(imgBuffer)
        fs.createWriteStream('public/images/' + imgname + '.gif').on('finish', () => {
        }).end(imgBuffer);
        await userModel.uploadImg([imgname, time])
            .then(() => {
                ctx.body = {
                    status: true,
                    imgurl: '![](/images/' + imgname + '.gif)'
                }
            }).catch(() => {
                console.log('upload_img_error')
            })

    } else {
        ctx.body = {
            status: false
        }
    }
})

//图片管理页面
router.get('/img', async (ctx, next) => {
    let res,
        imgsLength;
    await checkLogin(ctx)
    await userModel.findImgByPage(1)
        .then(result => {
            //console.log(result)
            res = result
        })
    await userModel.findAllImgs()
        .then(result => {
            imgsLength = result.length
        })
    await ctx.render('img', {
        session: ctx.session,
        imgs: res,
        imgsLength: imgsLength,
        imgsPageLength: Math.ceil(imgsLength / 10),
    })
})


// 分页，每次输出10条
router.post('/img/page', async (ctx, next) => {
    let page = ctx.request.body.page;
    await userModel.findImgByPage(page)
        .then(result => {
            //console.log(result)
            ctx.body = result
        }).catch(() => {
            ctx.body = 'error'
        })
})

// post 删除图片
router.post('/img/delete', async (ctx, next) => {
    let id = ctx.request.body.id,
    name = ctx.request.body.name
        allowEdit = true;
    if (!ctx.session.user) {
        allowEdit = false
    } else {
        allowEdit = true
    }
    if (allowEdit) {
        await userModel.deleteImg(id)
            .then(() => {
                fs.unlink('public/images/'+name+'.gif',function (err) {
                    if(err) throw err;
                    console.log('删除成功')
                })
                ctx.body = true
            }).catch(() => {
                ctx.body = false
            })

    } else {
        ctx.body = false
    }
})

//相册页面
router.get('/photo', async (ctx, next) => {
    let res,
        photosLength,pagesArr;
    // await checkLogin(ctx)
    await userModel.findPageInfoById()
        .then(result => {
            pagesArr = result;
        })
    await userModel.findPhotoByPage(1)
        .then(result => {
            //console.log(result)
            res = result
        })
    await userModel.findAllPhotos()
        .then(result => {
            photosLength = result.length
        })
    await ctx.render('photo', {
        session: ctx.session,
        imgs: res,
        pagesArr:pagesArr,
        photosLength: photosLength,
        photosPageLength: Math.ceil(photosLength / 5),
    })
})

//上传相册图片页面
router.get('/uploadphoto', async (ctx, next) => {
    await checkLogin(ctx)
    await ctx.render('uploadphoto', {
        session: ctx.session,
    })
})

// post 上传相册图片
router.post('/uploadphoto/upload', async (ctx, next) => {
    let img = ctx.request.body.img,
        imgname = moment().unix(),
        title = ctx.request.body.title,
        time = moment().format('YYYY-MM-DD HH:mm:ss'),
        allowEdit = true;
    if (!ctx.session.user) {
        allowEdit = false
    } else {
        allowEdit = true
    }
    if (allowEdit) {
        let imgBuffer = new Buffer(img, 'base64');
        // console.log(imgBuffer)
        fs.createWriteStream('public/photos/' + imgname + '.gif').on('finish', () => {
        }).end(imgBuffer);
        await userModel.uploadPhoto([imgname, title,time])
            .then(() => {
                ctx.body = {
                    status: true
                }
            }).catch(() => {
                console.log('upload_img_error')
            })

    } else {
        ctx.body = {
            status: false
        }
    }
})

// 相册分页，每次输出10条
router.post('/photo/page', async (ctx, next) => {
    let page = ctx.request.body.page;
    await userModel.findPhotoByPage(page)
        .then(result => {
            //console.log(result)
            ctx.body = result
        }).catch(() => {
            ctx.body = 'error'
        })
})

// post 删除相册图片
router.post('/photo/delete', async (ctx, next) => {
    let id = ctx.request.body.id,
    name = ctx.request.body.name
        allowEdit = true;
    if (!ctx.session.user) {
        allowEdit = false
    } else {
        allowEdit = true
    }
    if (allowEdit) {
        await userModel.deletePhoto(id)
            .then(() => {
                fs.unlink('public/photos/'+name+'.gif',function (err) {
                    if(err) throw err;
                    console.log('删除成功')
                })
                ctx.body = true
            }).catch(() => {
                ctx.body = false
            })

    } else {
        ctx.body = false
    }
})

module.exports = router