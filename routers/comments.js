const RateLimit = require('koa2-ratelimit').RateLimit;
const router = require('koa-router')();
const userModel = require('../lib/mysql.js')
const config = require('../config/info.js')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin;
const moment = require('moment')
const tc = require('text-censor')
const nodemailer = require('nodemailer')

const mailTransport = nodemailer.createTransport({
    host: config.stmpHost,
    port: config.stmpPort,
    secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
    auth: {
        user: config.stmpEmail,
        pass: config.stmpEmailPass
    },
});


const commentLimiter = RateLimit.middleware({
    interval: 10 * 60 * 1000, // 10min
    delayAfter: 1, // begin slowing down responses after the first request
    timeWait: 3 * 1000, // slow down subsequent responses by 3 seconds per request
    max: 5, // start blocking after 5 requests
    prefixKey: 'post/comment/:link/push', // to allow the bdd to Differentiate the endpoint 
    message: "Too many accounts created from this IP, please try again after 10min"
});

// post 提交评论
router.post('/comment/:link/push', commentLimiter, async (ctx, next) => {
    let name = ctx.request.body.name,
        email = ctx.request.body.email,
        content = ctx.request.body.content,
        website = ctx.request.body.website,
        reply = ctx.request.body.reply,
        replyuser = '',
        replyemail = '',
        link = ctx.params.link,
        type = 'post',
        time = moment().format('YYYY-MM-DD HH:mm:ss'),
        newName = name.replace(/[<">']/g, (target) => {
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
    let testNum = /^[1-9]+[0-9]*]*$/;
    if(!testNum.test(link)){
        type = 'page';

    }
    await userModel.findCommentInfo(reply, link)
        .then(result => {
            if (result.length != 0) {
                replyuser = result[0].name;
                replyemail = result[0].email;
                console.log(result)
            } else {
                reply = 0
            }
        })
    tc.filter(newName, function (err, censored) {
        newName = censored
    })
    tc.filter(newContent, function (err, censored) {
        newContent = censored
    })
    // console.log([newName, email, website, newContent, link, reply, replyuser, time])
    // let  reg = /[a-zA-Z0-9_]{1,10}/;
    let reg = /^\d*([a-zA-Z])+\d*$/;
    let urlreg = /^$|^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
    let ereg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    // [\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}

    
    if(type == 'post'){
        mailOptions = {
            from: '"'+config.myUsername+'" <'+config.stmpEmail+'>',
            to: config.myEmail,
            subject: config.websiteTitle+' - 你有一条评论',
            text: '您的博客有一条新评论，来自用户' + name + '：' + content + ' 文章地址为：'+config.domain+'/post/'+link,
        };
    }else{
        mailOptions = {
            from: '"'+config.myUsername+'" <'+config.stmpEmail+'>',
            to: config.myEmail,
            subject: config.websiteTitle+' - 你有一条评论',
            text: '您的博客有一条新评论，来自用户' + name + '：' + content + ' 页面地址为：'+config.domain+'/s/'+link,
        };
    }
    if (!urlreg.test(website) || !ereg.test(email) || newName == '') {
        ctx.body = false
    } else {
        await userModel.createComment([newName, email, website, newContent, link, reply, replyuser, time])
            .then(() => {
                ctx.body = true
            }).catch(() => {
                ctx.body = false
            })
        if (ctx.session.user) {
            if(type == 'post'){
                mailOptions = {
                    from: '"'+config.myUsername+'" <'+config.stmpEmail+'>', 
                    to: replyemail, 
                    subject: config.websiteTitle+' - 你有一条回复评论',
                    text: '您有一条回复评论 文章地址为：'+config.domain+'/post/'+link,
                };
            }else{
                mailOptions = {
                    from: '"'+config.myUsername+'" <'+config.stmpEmail+'>',
                    to: replyemail,
                    subject: config.websiteTitle+' - 你有一条回复评论',
                    text: '您有一条回复评论 页面地址为：'+config.domain+'/s/'+link,
                };
            }
            mailTransport.sendMail(mailOptions, function (err, msg) {
                if (err) {
                    console.log(err);
                    // res.render('index', { title: err });
                }
                else {
                    console.log(msg);
                    // res.render('index', { title: "已接收：" + msg.accepted });
                }
            });
        } else {
            mailTransport.sendMail(mailOptions, function (err, msg) {
                if (err) {
                    console.log(err);
                    // res.render('index', { title: err });
                }
                else {
                    console.log(msg);
                    // res.render('index', { title: "已接收：" + msg.accepted });
                }
            });
        }
    }
})

// 删除评论
router.post('/comment/:id/remove', async (ctx, next) => {
    let id = ctx.params.id,
        allow;
    if (ctx.session.user) {
        allow = true
    } else {
        allow = false
    }
    if (allow) {
        await userModel.deleteComments(id)
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