# Koa2 + MySQL Blog

实现了Markdown语法，相册，图床，验证码登陆，IP请求次数限制，邮件提醒，评论敏感词过滤等功能。

## 主要功能

* 文章发布/修改/删除
* 单页新建/修改/删除
* 相册上传/图片自动压缩优化
* 评论/回复/敏感词过滤/邮件提醒
* 后台登陆/验证码
* IP请求次数限制

## 2018.04.26 更新 - 修改界面

重新设计了页面，更加简洁大气。

## 安装说明

修改 config 文件夹下的 default.js 与 info.js 的相关配置。

第一次使用请先创建数据库

进入登录mysql输入命令：

```
create database `najeh` default character set utf8 collate utf8_general_ci;
```

修改 setup.js 里面的默认管理员用户名和密码。

创建完数据库以后进入此目录 `node setup.js` 后即可根据下面信息创建管理员用户。

## 运行

```
node index.js
```
后台地址：http://localhost:3000/signin

默认账号：admin
默认密码：123456

## 截图

![](https://github.com/imNajeh/Koa2-Blog/blob/master/public/images/home.PNG)
![](https://github.com/imNajeh/Koa2-Blog/blob/master/public/images/login.PNG)
![](https://github.com/imNajeh/Koa2-Blog/blob/master/public/images/article.PNG)
![](https://github.com/imNajeh/Koa2-Blog/blob/master/public/images/photo.PNG)

## 部分功能使用到的模块

* EJS模板引擎
* koa2-ratelimit 防止恶意多次登陆请求
* markdown-it Markdown解析器
* nodemailer 邮件提醒
* text-censor 评论敏感词过滤
* trek-captcha 验证码生成