var mysql = require('mysql');
var config = require('../config/default.js')

var pool  = mysql.createPool({
  host     : config.database.HOST,
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE
});

let query = ( sql, values ) => {

  return new Promise(( resolve, reject ) => {
    pool.getConnection( (err, connection) => {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {
          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })

}


// let query = function( sql, values ) {
// pool.getConnection(function(err, connection) {
//   // 使用连接
//   connection.query( sql,values, function(err, rows) {
//     // 使用连接执行查询
//     console.log(rows)
//     connection.release();
//     //连接不再使用，返回到连接池
//   });
// });
// }

let users =
    `create table if not exists users(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     pass VARCHAR(100) NOT NULL,
     PRIMARY KEY ( id )
    );`

let posts =
    `create table if not exists posts(
     id INT NOT NULL AUTO_INCREMENT,
     title TEXT(0) NOT NULL,
     content TEXT(0) NOT NULL,
     md TEXT(0) NOT NULL,
     moment VARCHAR(100) NOT NULL,
     pv VARCHAR(40) NOT NULL DEFAULT '0',
     PRIMARY KEY ( id )
    );`

    let pages =
    `create table if not exists pages(
     id INT NOT NULL AUTO_INCREMENT,
     linkname VARCHAR(100) NOT NULL,
     title TEXT(0) NOT NULL,
     content TEXT(0) NOT NULL,
     md TEXT(0) NOT NULL,
     hascom VARCHAR(40) NOT NULL,
     PRIMARY KEY ( id )
    );`

    let comments =
    `create table if not exists comments(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(100) NOT NULL,
     website VARCHAR(100) NOT NULL,
     content VARCHAR(140) NOT NULL,
     link VARCHAR(100) NOT NULL,
     reply INT NOT NULL,
     replyuser VARCHAR(100) NOT NULL,
     moment VARCHAR(100) NOT NULL,
     PRIMARY KEY ( id )
    );`

    let photos =
    `create table if not exists photos(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     title VARCHAR(100) NOT NULL,
     moment VARCHAR(100) NOT NULL,
     PRIMARY KEY ( id )
    );`

    let imgs =
    `create table if not exists imgs(
     id INT NOT NULL AUTO_INCREMENT,
     name VARCHAR(100) NOT NULL,
     moment VARCHAR(100) NOT NULL,
     PRIMARY KEY ( id )
    );`

let createTable = ( sql ) => {
  return query( sql, [] )
}

// 建表
createTable(users)
createTable(posts)
createTable(pages)
createTable(comments)
createTable(photos)
createTable(imgs)

// 创建用户
let insertData =  ( value ) => {
  let _sql = "insert into users set name=?,pass=?;"
  return query( _sql, value )
}

// 删除用户
let deleteData =  ( value ) => {
  let _sql = `delete from users where name = "${value}"`
  return query(_sql)
}

// 查找用户
let findDataByName = ( name ) => {
  let _sql = `select * from users where name="${name}";`
  return query( _sql )
}
// 发表文章
let insertPost = ( value ) => {
  let _sql = "insert into posts set title=?,content=?,md=?,moment=?;"
  return query( _sql, value )
}

// 更新浏览数
let updatePostPv = ( value ) => {
  let _sql = "update posts set pv=? where id=?"
  return query( _sql, value )
}

// 通过文章id查找
let findDataById =  ( id ) => {
  let _sql = `select * from posts where id="${id}";`
  return query( _sql)
}
// 查询所有文章
let findAllPost =  () => {
  let _sql = ` select * FROM posts;`
  return query( _sql)
}
// 查询分页文章
let findPostByPage =  ( page ) => {
  let _sql = ` select * FROM posts order by id desc  limit ${(page-1)*5},5;`
  return query( _sql)
}
// 更新修改文章
let updatePost = (values) => {
  let _sql = `update posts set title=?,content=?,md=? where id=?`
  return query(_sql,values)
}
// 删除文章
let deletePost = (id) => {
  let _sql = `delete from posts where id = ${id}`
  return query(_sql)
}

// 创建新页面
let insertPage = ( value ) => {
  let _sql = "insert into pages set linkname=?,title=?,md=?,content=?,hascom=?;"
  return query( _sql, value )
}

// 更新单页面
let updatePage = (values) => {
  let _sql = `update pages set linkname=?, title=?,content=?,md=?,hascom=? where id=?`
  return query(_sql,values)
}

// 删除单页面
let deletePage = (linkname) => {
  let _sql = `delete from pages where linkname ="${linkname}"`
  return query(_sql)
}

// 通过页面链接查找
let findPageDataByLink =  ( linkname ) => {
  let _sql = `select * from pages where linkname="${linkname}";`
  return query( _sql)
}

// 查找全部单页面标题和链接
let findPageInfoById =  () => {
  let _sql = `select title,linkname from pages;`
  return query( _sql)
}

// 新增评论
let createComment = ( value ) => {
  let _sql = "insert into comments set name=?,email=?,website=?,content=?,link=?,reply=?,replyuser=?,moment=?;"
  return query( _sql, value )
}

// 获取评论人
let findCommentInfo =  (id,link) => {
  let _sql = `select name,email from comments where id="${id}" and  link="${link}";`
  return query( _sql)
}

// 获取页面评论
let findComments =  (link) => {
  let _sql = `select * from comments where link="${link}" order by id desc;`
  return query( _sql)
}

// 删除评论
let deleteComments = (id) => {
  let _sql = `delete from comments where id = ${id}`
  return query(_sql)
}

// 删除某页评论
let deleteCommentsByLink = (link) => {
  let _sql = `delete from comments where link = "${link}"`
  return query(_sql)
}

// 新增图片
let uploadImg = ( value ) => {
  let _sql = "insert into imgs set name=?,moment=?;"
  return query( _sql, value )
}

// 查询全部图片
let findAllImgs =  () => {
  let _sql = `select * from imgs;`
  return query( _sql)
}

// 查询分页图片
let findImgByPage =  ( page ) => {
  let _sql = ` select * FROM imgs order by id desc  limit ${(page-1)*10},10;`
  return query( _sql)
}

// 删除图片
let deleteImg = (id) => {
  let _sql = `delete from imgs where id = ${id}`
  return query(_sql)
}

// 新增相册图片
let uploadPhoto = ( value ) => {
  let _sql = "insert into photos set name=?,title=?,moment=?;"
  return query( _sql, value )
}

// 查询全部相册图片
let findAllPhotos =  () => {
  let _sql = `select * from photos;`
  return query( _sql)
}

// 查询分页相册图片
let findPhotoByPage =  ( page ) => {
  let _sql = ` select * FROM photos order by id desc  limit ${(page-1)*5},5;`
  return query( _sql)
}

// 删除相册图片
let deletePhoto = (id) => {
  let _sql = `delete from photos where id = ${id}`
  return query(_sql)
}

module.exports = {
  insertData,
  deleteData,
	query,
	createTable,
  findDataByName,
  insertPost,
  findAllPost,
  findPostByPage,
  findDataById,
  updatePost,
  deletePost,
  updatePostPv,
  insertPage,
  updatePage,
  deletePage,
  findPageDataByLink,
  findPageInfoById,
  createComment,
  findComments,
  deleteComments,
  deleteCommentsByLink,
  findCommentInfo,
  uploadImg,
  findAllImgs,
  findImgByPage,
  deleteImg,
  uploadPhoto,
  findAllPhotos,
  findPhotoByPage,
  deletePhoto
}

