var express = require('express');
var router = express.Router();
const models = require('../models');

/* GET home page. */
router.get('/board', function(req, res, next) {
  models.post.findAll().then( result => {
    res.json({
    posts: result});
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

/*
// DB에 insert 하기

models.Userinfo.create({
  id: 'happywhn2',
  writer:'SangGyu',
  comment:'hello sg'
});

--------------------------------------------------
DB에서 Select 하기

models.Userinfo.findAll({
  attributes: ['id', 'comment']
});

/*
--------------------------------------------------
DB에서 Update하기

models.Userinfo.update({
  comment: '수정 내용'
}, {
  where: { id:'happywhn2'}
});
--------------------------------------------------
Db에서 delete하기

models.Userinfo.destroy({
  where: {id:'happywhn2'}
});
*/


module.exports = router;
