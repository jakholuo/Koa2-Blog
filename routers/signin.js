const RateLimit = require('koa2-ratelimit').RateLimit;
const router = require('koa-router')();
const userModel = require('../lib/mysql.js')
const md5 = require('md5')
const checkNotLogin = require('../middlewares/check.js').checkNotLogin
const checkLogin = require('../middlewares/check.js').checkLogin
const fs = require('fs')
const captcha = require('trek-captcha')

const getloginimiter = RateLimit.middleware({
    interval: 15*60*1000, // 15 minutes
    max: 100,
    prefixKey: 'get/signin' // to allow the bdd to Differentiate the endpoint 
  });

const loginLimiter = RateLimit.middleware({
    interval: 10*60*1000, // 10min
    delayAfter: 1, // begin slowing down responses after the first request
    timeWait: 3*1000, // slow down subsequent responses by 3 seconds per request
    max: 5, // start blocking after 5 requests
    prefixKey: 'post/signin', // to allow the bdd to Differentiate the endpoint 
    message: "Too many accounts created from this IP, please try again after 10min"
  });

router.get('/signin', getloginimiter, async(ctx, next) => {
    await checkNotLogin(ctx)
    const { token, buffer } = await captcha()
    // fs.createWriteStream('public/code.gif').on('finish', () => console.log(token)).end(buffer);
    console.log(token)
    let codeBase64 = buffer.toString('base64');
    ctx.session.code = token
    await ctx.render('signin', {
        session: ctx.session,
        code:codeBase64
    })
    console.log(ctx.session)
})

router.post('/signin', loginLimiter, async(ctx, next) => {
    console.log(ctx.request.body)
    let name = ctx.request.body.name;
    let pass = ctx.request.body.password;
    let code = ctx.request.body.code;
    await userModel.findDataByName(name)
        .then(result => {
            let res = result;
            if(code!=ctx.session.code){
                ctx.body = 0
                console.log('验证码错误')
            }
            else if (name === res[0]['name'] && md5(pass) === res[0]['pass']  ) {
                ctx.body = true
                ctx.session.user = res[0]['name']
                ctx.session.id = res[0]['id']
                delete ctx.session.code;
                console.log('ctx.session.id', ctx.session.id)
                console.log('session', ctx.session)
                console.log('登录成功')
            }else{
                ctx.body = false
                console.log('登录失败')
            }
        }).catch(err => {
            console.log(err)
        })

})

module.exports = router