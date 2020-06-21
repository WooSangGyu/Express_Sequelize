var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');


const CronJob = require('cron').CronJob;
const models = require('./models/index.js');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const methodOverride = require('method-override');


// const task = () => console.log("오우오우싸발적이고"); // 함수
// const stopAlert = () => console.log('Cron Stopped.'); // 정지 알림 메시지

// const job = new CronJob('*/2 * * * * *', task, stopAlert, false, 'Asia/Seoul'); 
// Cron표현식/실행할 함수/종료 시 실행할 함수/ 자동시작여부 / TimeZone;

// setTimeout(() => job.start(), 3000); 앱 실행 3초 후 Cron 실행
// setTimeout(() => job.stop(), 15000); Cron 시작 15초 후 Cron 정지

var app = express();
models.sequelize.sync().then( () => {
  console.log("DB connection sucess");
}).catch(err => {
  console.log("DB connection error.");
  console.log(err);
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static("public"));
app.use(session({
  secret: 'ere141241afw4124',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

app.use(methodOverride('_method'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next)                  {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// 최초 접속 시 세션에 저장
// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// 저장된 세션과 DB에 저장되어 있는 아이디 비교 및 반환
// passport.deserializeUser(function(id, done) {
//   console.log('deserializeUser', id);

//   models.user.findAll()
//       .then( result => {
//     for(var i=0; i < result.length; i++){
//       let user = result[i].dataValues;
//       if( id === user.id){
//         return done(null, user);
//       }
//     }
//   });
// });

// 에러 메시지 출력
// process.on('warning', (warning) => {
//   console.log(warning.stack);
// });

// 로컬 형식으로 로그인
// passport.use(new LocalStrategy(
//   function(username, password, done) {
//         models.user.findAll()
//       .then( result => {
//         var id = username;
//         var pwd = password;


//         for(var i=0; i < result.length; i++){
//           let user = result[i].dataValues;
      
//           if( id === user.id && pwd === user.pwd){
//             done(null, user);
//           }
//         }
//         done(null, false);
//       });
//     }
// ));

// 페이스북으로 로그인
// passport.use(new FacebookStrategy({
//   clientID: '651799692349093',
//   clientSecret: 'edd74b82d25657477a9a8e78177dc973',
//   callbackURL: "/auth/facebook/callback",
//   profileFields:['id','displayName']
// },
//   function(accessToken, refreshToken, profile, done) {
//     let body = profile;

//     models.user.findAll()
//       .then( result => {

//       if(result.length == 0){
//         models.user.create({
//           id : body.id,
//           nickname : body.displayName
//           })
//           .then( result => {
//             return done(null, result);
//           })
//           .catch( err => {
//             return console.log(err);
//           });
//       } else {
//         var id = body.id;

//         for(var i=0; i < result.length; i++){
//           let user = result[i].dataValues;
      
//           if( id == user.id){
//             return done(null, user);
//             }
//           }

//         models.user.create({
//           id : body.id,
//           nickname : body.displayName
//           })
//           .then( result => {
//             return done(null, result);
//           })
//            .catch( err => {
//             return console.log(err);
//           });
//       }
//     });
//   })
// );


module.exports = app;
