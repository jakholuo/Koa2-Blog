# Koa2 + MySQL Blog

实现了Markdown语法，相册，图床，验证码登陆，IP请求次数限制，邮件提醒，评论敏感词过滤等功能。

## 安装说明

修改 config 文件夹下的 default.js 与 info.js 的相关配置。

第一次使用请先创建数据库

进入登录mysql输入命令：

```
create database `najeh` default character set utf8 collate utf8_general_ci;
```

修改 setup.js 里面的默认管理员用户名和密码。

创建完数据库以后进入此目录 `node setup.js` 后即可根据下面信息创建管理员用户。

## 截图

![](https://github.com/imNajeh/Koa2-Blog/blob/master/public/images/home.PNG)
![](https://github.com/imNajeh/Koa2-Blog/blob/master/public/images/login.PNG)
![](https://github.com/imNajeh/Koa2-Blog/blob/master/public/images/article.PNG)

## 部分功能使用到的模块

* EJS模板引擎
* koa2-ratelimit 防止恶意多次登陆请求
* markdown-it Markdown解析器
* nodemailer 邮件提醒
* text-censor 评论敏感词过滤
* trek-captcha 验证码生成