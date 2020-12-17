var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan'); 
var mongoose = require('mongoose');
var Schema = mongoose.Schema ;




var usersRouter = require('./routes/users');
var indexRouter = require('./routes/index');


var app = express();


mongoose.connect("mongodb://localhost:27017/Account")
const userSchema = new Schema({
  name  : String ,
  age : Number ,
  phone : String,
  avatar : String,
  rate5 : Number ,
  rate1 : Number 
});
var createpost = mongoose.model("user",userSchema);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', indexRouter);
app.use('/users', usersRouter);

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

var server = require("http").createServer(app);
server.listen(process.env.PORT || 1649);
var io = require("socket.io")(server);


io.on("connection" , (socket) =>{
  console.log("co nguoi ket noi");
  socket.on("rate5" , (data) =>{
    createpost.findOne({id : data.id} , (err,datadb) =>{
      var updaterate5 = datadb.rate5 + 1
      createpost.update({id:data.id} ,{rate5  : updaterate5} ,(err,data3) =>{
        createpost.findOne({id : data.id} , (err,dataud) =>{
          io.sockets.emit("server-rate" , dataud);
        })
       
      })
    })
  })
})
