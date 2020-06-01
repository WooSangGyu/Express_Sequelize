var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const models = require('./models/index.js');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const methodOverride = require('method-override');

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
app.use('/', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
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

passport.serializeUser(function(user, done) {
  console.log('serializeUser', user);
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser', id);

  models.user.findAll()
      .then( result => {
    // console.log("deser 데이터 탐색 완료");

    for(var i=0; i < result.length; i++){
      let user = result[i].dataValues;
      if( id === user.id){
        // console.log(user);
        return done(null, user);
      }
    }
  });
});

process.on('warning', (warning) => {
  console.log(warning.stack);
});

passport.use(new LocalStrategy(
  function(username, password, done) {
        models.user.findAll()
      .then( result => {
        console.log("LocalSt 데이터 탐색 완료");
        console.log('done : ', done);
        var id = username;
        var pwd = password;


        for(var i=0; i < result.length; i++){
          let user = result[i].dataValues;
      
          if( id === user.id && pwd === user.pwd){
            console.log('LocalStrategy', user);
            done(null, user);
          }
        }
        done(null, false);
      });
    }
));


passport.use(new FacebookStrategy({
  clientID: '651799692349093',
  clientSecret: 'edd74b82d25657477a9a8e78177dc973',
  callbackURL: "/auth/facebook/callback",
  profileFields:['id','displayName']
},
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    let body = profile;
    // console.log(body);

    models.user.findAll()
      .then( result => {
    console.log("데이터 탐색 완료");

      if(result.length == 0){
        models.user.create({
          id : body.id,
          nickname : body.displayName
          // usermail : body.email
          })
          .then( result => {
            // console.log("추가성공")
            return done(null, result);
            
          })
          .catch( err => {
            // console.log("추가실패");
            return console.log(err);
          });
      } else {
        var id = body.id;

        for(var i=0; i < result.length; i++){
          let user = result[i].dataValues;

          // console.log(user);
      
          if( id == user.id){
            // console.log("매칭되는 아이디 발견");
            return done(null, user);
            }
          }

        models.user.create({
          id : body.id,
          nickname : body.displayName
          // usermail : body.email
          })
          .then( result => {
            // console.log("추가성공")
            return done(null, result);
            
          })
           .catch( err => {
            // console.log("추가실패");
            return console.log(err);
          });
      }
    });
  })
);


module.exports = app;
