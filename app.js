const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash');
const { compileCss } = require('./compileCss');
const config = require('./config/development_config');

const MemberModifyMethod = require('./controllers/modify_controller');
memberModifyMethod = new MemberModifyMethod();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
if (process.env.npm_lifecycle_event === 'test') {
  // 执行 node test 命令的逻辑
  console.log("Running 'npm test'");
  // 請求CSS檔時，轉換SCSS檔
  app.use('/assets/sass', (req, res, next) => {
    const sassOptions = {
      src: path.join(__dirname, 'public/sass'),
      dest: path.join(__dirname, 'public/sass'),
      ext: '.scss'
    };
    compileCss(sassOptions);
    next();
  });
}
app.use(express.static(path.join(__dirname, './client/build')));
app.use(flash());
app.use(session({
  cookie: { maxAge: 60000 },
  secret: config.secret1,
  resave: false,
  saveUninitialized: false
}));

app.use(function (req, res, next) {
  console.log('Time: ', new Date());

  // 設定 success_msg 訊息  
  res.locals.success_msg = req.flash('success_msg');
  // 設定 warning_msg 訊息 
  res.locals.warning_msg = req.flash('warning_msg');
  res.locals.errors = [];
  next();
}, memberModifyMethod.LoginCheck, (req, res, next) => {
  if (res.locals.isLogin)
    console.log(res.locals.member_info.name);
  next();
});

app.get("*",(_,res)=>{
  res.sendFile(
    path.join(__dirname,"./client/build/index.html"),
    (err)=>{
      res.status(500).send(err);
    }
  )
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  if (err.status == 404) {
    res.locals.message = "呃...找不到這個頁面";
    res.locals.tip = "檢查看看是不是打錯網址了呢";
  }
  else {
    res.locals.message = "呃...網站出錯了";
    res.locals.tip = "請等一下再來，開發者會盡快處理";
  }
  res.locals.status = err.status || 500;

  console.log(err.message);
  console.log(err);

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: config.title.error });
});


module.exports = app;
