const apiModel = require('./lib/mysql.js')
const md5 = require('md5')

//第一次使用请先创建数据库
// 进入登录mysql输入命令：create database `najeh` default character set utf8 collate utf8_general_ci;

//创建完数据库以后进入此目录 node setup.js 后即可根据下面信息创建管理员用户

//创建管理员
apiModel.insertData(['admin', md5('123456')]).then(() => {
    console.log('创建成功');
    process.exit();
})

//删除管理员
// apiModel.deleteData('admin').then(() => {
//     console.log('删除成功');
//     process.exit();
// })