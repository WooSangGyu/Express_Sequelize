var express = require('express');
var router = express.Router();
const models = require('../models');
var passport = require('passport');
var session = require('express-session');
// var bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let secretObj = require('../config/jwt');

// var app = express();

// app.use(bodyParser.urlencoded({ extended: false }));

let encrypt128 = require('../config/crypto');
let decrypt128 = require('../config/crypto');

/* GET home page. */
router.get('/board', function(req, res, next) {
  models.post.findAll()
  .then( result => {
    console.log("데이터 탐색 완료", result);
    res.json({ posts: result });
  });
});

//추가
router.post('/create', function(req, res, next) {
  let body = req.body;

  models.post.create({
    title: body.inputTitle,
    writer: body.inputWriter
  })
  .then( result => {
    console.log("데이터 추가 완료",result);
    res.json({ success: result })
  })
  .catch( err => {
    console.log("데이터 추가 실패");
  })
});

//조회
router.get('/find', function(req, res, next) {
  let body = req.body;

  models.post.findOne({
    where: {id: body.id}
  })
  .then( result => {
    res.json({
      post:result
    });
  })
  .catch( err => {
    console.log("데이터 조회 실패");
  });
});

//수정
router.put('/update', function(req, res, next) {
  let body = req.body;
  
  console.log(body);

  models.post.update({
    title: body.title,
    writer: body.writer
  }, {
    where: { id: body.id }
  })
  .then( result => {
    console.log("데이터 수정 완료");
    res.json({ success: result });
  })
  .catch( err => {
    console.log("데이터 수정 실패");
    res.json(err);
  });
});

//삭제
router.delete('/delete', function(req, res, next) {
  let body = req.body;

  models.post.destroy({
    where: {id : body.id }
  })
  .then( result => {
    console.log("데이터 삭제 완료");
    res.json({success: result})
  })
  .catch( err =>{
    console.log("데이터 삭제 실패");
  });
});

//리플 추가
router.post('/reply', function(req, res, next) {
  let body = req.body;

  console.log(body);

  models.reply.create({
    postId : body.id,
    writer: body.wr,
    content: body.ct
  })
  .then( result => {
    console.log("추가성공");
    res.json({ success:result });
  })
  .catch( err => {
    console.log("추가실패");
    console.log(err);
  });
});

//user 아이디추가

router.post('/userinfo', function(req, res, next) {
  let body = req.body;

  models.user.create({
    id: body.id,
    pwd: body.password,
    nickname: body.nick,
    // usermail: body.umail
  })
  .then( result => {
    console.log("데이터 추가 완료",result);
    res.json({ success: result })
  })
  .catch( err => {
    console.log("데이터 추가 실패");
  })
});



router.get('/login', function(req, res) {
  res.render('login2');
})

router.post('/login', function(req, res, next) {
  let body = req.body;

  console.log("입력받은 정보 ", body);

  models.user.findOne({where: {
    id: body.username,
    pwd: body.password
  }})
  .then((result) => {
    console.log( "검색된 아이디 정보", result.dataValues);

    let token = jwt.sign({
      userid : result.dataValues.id,
      name : result.dataValues.nickname
    },secretObj.secret ,
    {
      expiresIn: '60s'
    })
//    res.cookie("user", token);
    res.redirect('/signed');
  })
  .catch( err => {
    console.log("로그인에 실패하였습니다.");
  })
})

router.post('/signed', function(req, res, next) {
  let token = req.cookies.user;

  let decoded = jwt.verify(token, secretObj.secret);
  if(decoded){
    res.send("권한이 있습니다.")
  } else {
    res.send("권한이 없습니다.")
  }
})

router.post('/student', function(req, res, next){
  let body = req.body;

  console.log(body);

  models.student.create({
    name : body.na,
    studentcode : body.st
  })
  .then ( result => {
    console.log("학생추가완료");
    res.json(result);
  })
  .catch ( err => {
    console.log(err);
  })
});

router.post('/suclass', function(req, res, next){
  let body = req.body;

  models.suclass.create({
    classname : body.csna,
    classcode : body.cscode
  })
  .then ( result => {
    console.log("수업 추가 완료");
    res.json(result);
  })
  .catch ( err => {
    console.log(err);
  })
});

router.post('/joinsu', function(req, res, next) {
  let body = req.body;

  console.log(body);

  models.studentclass.create({
    studentStudentcode : body.stcode,
    suclassClasscode : body.clcode
  })
  .then( result => {
    console.log(result);
    console.log("추가완료");
    res.json(result);
  })
  .catch( err => {
    console.log(err);
  })
});

router.get('/findjoinclass', function(req, res, next) {
  let body = req.body;

  console.log(body);

  models.student.findOne({
    where: { name : body.person }
  })
  .then( findst => {
    console.log(findst);

    models.studentclass.findAll({
      where: {studentStudentcode : findst.studentcode}
    })
    .then (result => {
      console.log("검색 완료");
      res.json(result);
    })
    .catch ( err => {
      console.log("학생과 매칭된 수업 검색 실패");
    })
  })
  .catch( err => {
    console.log("학생 데이터 조회 실패");
  })
});

router.get('/findjoinstudent', function(req, res, next) {
  let body = req.body;

  models.suclass.findOne({
    where: { classname : body.clname }
  })
  .then( findcl => {

    models.studentclass.findAll({
      where: {suclassClasscode : findcl.classcode }
    })
    .then (result => {
      console.log("검색 완료");
      res.json(result);
    })
    .catch ( err => {
      console.log("수업과 매칭된 학생 검색 실패");
    })
  })
  .catch( err => {
    console.log("수업 데이터 조회 실패");
  })
});


//-----------------------------------------------
// router.get('/auth/facebook',
//     passport.authenticate('facebook')
//   );

// router.get('/auth/facebook/callback',
//     passport.authenticate('facebook',
//     {
//       successRedirect: '/gogo',
//       failureRedirect: '/auth/login'
//     }
//   )
// );

// router.get('/auth/login', function(req, res, next) {
//   res.render('login');
// });

// router.post('/auth/login',
//   passport.authenticate('local',
//     {
//       successRedirect: '/gogo',
//       failureRedirect: '/auth/login',
//       failureFlash: false
//     } 
//   )
// );

// router.get('/gogo', function(req, res, next) {
//   if( req.user && req.user.nickname) {
//     res.send(`
//     <h1> hello, ${req.user.nickname} </h1>
//     <a href="/auth/logout"> logout </a>
//     `);
//   }
// });

// router.get('/auth/logout', function(req, res) {
//   req.logout();
//   res.redirect('/auth/login');
// })

// }) function(req, res, next) {
//   models.user.findAll()
//   .then( result => {
//     console.log("데이터 탐색 완료");
    
//     let body = req.body;

//     var id = req.body.username;
//     var pwd = req.body.password;

//     for(var i=0; i < result.length; i++){
//       let user = result[i].dataValues;
      
//       console.log(user);
      
//       if( id == user.id && pwd == user.pwd){
//         console.log("매칭되는 아이디 발견");
//         req.session.id = user.id
//         return res.redirect('/gogo');
//       }

//       res.redirect('oh shit');
//     }
//   });
// });


module.exports = router;
