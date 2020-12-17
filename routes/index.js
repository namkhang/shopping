var express = require('express');
const bcrypt = require('bcrypt');
var router = express.Router();
var bodyParser = require("body-parser");
var urlencodeParser = bodyParser.urlencoded({extended : false});
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require("passport");
var FbStrategy = require("passport-facebook").Strategy;
var gmailStrategy = require("passport-google-oauth").OAuth2Strategy;
var nodemailer  = require("nodemailer");
const { log } = require('debug');
const { Router } = require('express');
var db = require("../mongoose_model/mongoose_model");
var request = require("request");

router.use(bodyParser());
router.use(cookieParser());
router.use(
  session({
    secret: "doraemon",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 45,
    },
  })
)
router.use(passport.initialize());
router.use(passport.session());



router.get("/test" ,(req,res)=>{
  db.item.find((err,data)=>{
    console.log(data);
  })
})
//tạo kết nối với database
router.get("/testapi" , (req,res)=>{
  request("http://localhost:3216/admin/testapi" ,(err,resp,bodys)=>{
    res.send(resp);
  })
})

router.get('/', function(req, res) {
  var page  ;
  var perpage =16;
  if(req.query.page)
  {
    page = parseInt(req.query.page);
  }
  else{
    page = 1 ;
  }
  var nowpage_up = page + 1 ; // lấy ra trang hiện tại và cộng thêm 1 
  var nowpage_down = page - 1 ; // lấy ra trang hiện tại và trừ đi 1 
  if(req.query.page == 1 )
  {
    nowpage_down = 1 ;
  }
  if(req.query.page == 7 )
  {
    nowpage_up = 7 ;
  }
  if(!req.query.page)
  {
    nowpage_down = 1 ;
    nowpage_up = 2 ;
  }
  var start = (page-1)*perpage;
  var end = start + perpage ;
  if(req.isAuthenticated()) //nếu đã xác thực bằng facebook hoặc gmail thì được trả lại trang chính
  {
    db.products.findOne({id:"1"},(err,data)=>{ // tìm trong database các sản phẩm có id là 1
      if(!req.session.giohang ){ //kiểm tra xem có session giỏ hàng hay chưa nếu chưa có thì gán session giỏ hàng là một mảng rổng
        req.session.giohang = [];
    }
      res.render("../views/home.ejs" ,{product :data.items.slice(start,end) ,giohang:req.session.giohang , username : req.user.displayName,nowpage_up : nowpage_up ,nowpage_down : nowpage_down });  
      })
  }
  else{
    db.accounts.findOne({_id : req.cookies.userid} , (err,data) =>{  // kiểm tra cookie người dùng có trong db không
      if(data){ 
       db.products.findOne({id:"1"},(err,data)=>{ // tìm trong database các sản phẩm có id là 1
        if(!req.session.giohang ){ //kiểm tra xem có session giỏ hàng hay chưa nếu chưa có thì gán session giỏ hàng là một mảng rổng
          req.session.giohang = [];
      }
        res.render("../views/home.ejs" ,{product :data.items.slice(start,end) ,giohang:req.session.giohang , username : req.session.user,nowpage_up : nowpage_up ,nowpage_down : nowpage_down });  
        })
      }
      else { 
        res.render("../views/login.ejs");
      }
      
      });

  }
  
  
});
// ============ ĐĂNG KÝ ============
router.get('/register', (req, res) =>{
  
  res.render("../views/register.ejs" , { error : []});
});

router.post('/register',async (req , res)=>{
   var error = [];
const {email , password,repassword} = req.body ;
  const hashpass = await bcrypt.hash(password ,10) ; // mã hõa password người dùng gửi lên
  if(!email)
  {
    error.push("username không được bỏ trống");
  }
  if(!password)
  {
    error.push("password không được để trống");
  }
  if(password != repassword )
  {
    error.push("xác nhận mật khẩu không khớp");
  }
  if(error.length)
  {
    res.render("../views/register.ejs" , {error:error})
   return;
  }
  db.accounts.findOne({email : email},(err,data) => {
          if(data)
          {
            error.push("email đã được sử dụng");  
            res.render("../views/register.ejs" , {error:error})       
          } 
          else{
          
            db.accounts.create({email ,password:hashpass} , (err)=>{
              if(err)
              {
                console.log(err);
   
              }
              else{
                console.log("đã thêm");
                res.redirect("/");

              }
            
            })  
       }        
  })
})

// ================= ĐĂNG NHẬP =================
router.post("/gologin",  (req,res) => {
const user = req.body.username;
const pass = req.body.password;
 /* createpost.findOne({username : user , password : pass} , (err , data ) => {
   if(data) {
     
    req.session.user = data.username;
    res.render('../views/home.ejs' );
    
   } else {res.redirect("/") };
  })*/
  db.accounts.findOne({email : user} ,  (err,data ) => { //kiểm tra xem username người dùng nhập có trong db không
    if(data){
    bcrypt.compare(pass, data.password,(err,result)=>{ // kiểm tra password của người dùng gửi lên xem có giống với password đã mã hóa trong database hay không
      if(result==true)
      {
       req.session.user = data.fullname; // lưu tên người dùng vào session
        res.cookie("userid" , data._id) // trả về cookie cho máy người dùng để khỏi phải đăng nhập lại
        req.session.giohang = []; // để khi người dùng khác đăng nhập vào web sẽ reset lại giỏ hàng
        res.redirect("/");
      }
      else{
        res.redirect("/");
      }
      
    })
  }
  else{
       res.redirect("/");
  }

})

})
// ================= ĐĂNG NHẬP BẰNG FACEBOOK=================
router.get("/auth/face" , passport.authenticate("facebook" , {scope:['email' ]})); //Chuyển hướng đến facebook để người dùng đăng nhập
router.get("/auth/face/callback" , passport.authenticate("facebook" , {successRedirect : "/" , failureRedirect : "/" , failureFlash : "Login failed"})); //sau khi người dùng nhập xong nếu đúng thì trả về trang  
passport.use(new FbStrategy ( // xử lý xác thực khi đăng nhập
  {
    clientID : "606895663566013",
    clientSecret :"79c364df8ff133de88035c0442119a01" ,
    callbackURL: "http://localhost:1649/auth/face/callback",
    profileFields : ["displayName" , "email"]
 
},
(accessToken, refreshToken ,profile , done) =>{
  console.log(profile);
 db.accountface.findOne({id : profile._json.id} , (err,data) =>{ //kiểm tra thông tin người dùng đã có trong db chưa ,nếu chưa thì sẽ thêm bào db
   if(data)
   {
     done(null , data);
   }
   else{
     db.accountface.create({id : profile._json.id , displayName : profile._json.name , email : profile._json.email} ,(err,newuser) =>{
       if(err)
       {
         done(err);
       }
       else{
        done(null , newuser);
       }
     })
   }
 }) 

}
))

// ================= ĐĂNG NHẬP BẰNG GMAIL=================
 router.get("/auth/gmail" ,passport.authenticate("google" , {scope :["profile" , "email"]}))
 router.get("/auth/gmail/callback" , passport.authenticate("google" , {successRedirect : "/" , failureRedirect : "/" , failureFlash : "Login failed"}))
passport.use(new gmailStrategy(      //xử lý đăng nhập gmail
  {
      clientID : "31833324930-mjf9np9iq4m4l57fmbplbcr0im18hl2v.apps.googleusercontent.com",
      clientSecret : "ZSKuqY8F4qPDjcj0zPYEZU2W",
      callbackURL : "http://localhost:1649/auth/gmail/callback"  
  },
  (accessToken , refreshToken , profile , done)=>{ 
       console.log(profile);
       db.accountgmail.findOne({id : profile.id} , (err,data) =>{
         if(data)
         {
           done(null ,data);
         }
         else{
           db.accountgmail.create({id : profile.id , displayName : profile.displayName , email : profile._json.email} ,(err,data) =>{
             if(err)
             {
               done(err);
             }
             else{
               done(null ,data);
             }
           })
            // ====================GỬI VỀ MAIL NGƯỜI DÙNG NẾU LÀ NGƯỜI MỚI ĐĂNG NHẬP LẦN ĐẦU ======================
       var transport =  nodemailer.createTransport({ // tạo cấu hình gửi
        host  : "smtp.gmail.com",
        port: 465,
        secure: true,
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false 
      },
        auth: {
            user: 'namkhangnguyendang@gmail.com',
            pass: 'Babyboy_99'
        }
    });
      var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
        from: 'namkhangnguyendang@gmail.com',
        to: profile._json.email,
        subject: 'Đăng nhập thành công',
        text: 'You recieved message from ' + "namkhangnguyendang@gmail.com",
        html: '<p>Cảm ơn bạn đã đăng nhập vào trang web của chúng tôi, chúc  một ngày tốt lành</p>'
    }
      transport.sendMail(mainOptions,(err,data) =>{ //phần gửi mail
        if(err)
        {
          console.log(err);
        }
        else{
          console.log("đã gửi thư");
        }
      })
         }
     }) 
  }
))



passport.serializeUser((user , done) =>{ //thêm thông tin người dùng (profile) vào session được đính kèm vs cookie
  done(null , user);
})
passport.deserializeUser((user , done) =>{ // lấy ra session và được lưu vào req.user
  done(null , user);
})

router.get("/goshopping" , (req,res) =>{ //trả về trang thanh toán
 if(req.cookies.userid || req.isAuthenticated() )
 {
  if(!req.session.giohang)
  {
    req.session.giohang = [];
  }
  var user = req.session.user;
  if(req.isAuthenticated())
  {
    user = req.user.displayName;
  }
  res.render("../views/shopping.ejs" , {giohang:req.session.giohang , username : user})
}
else{
  res.redirect("/");
}
})
router.post("/goshopping" , (req,res) =>{
 var Username = req.session.user ;
 if(req.isAuthenticated())
 {
  Username  = req.user.displayName;
 }
 const Diachi = req.body.address;
 const Sodienthoai = req.body.phone;
  const TenSanPham = req.body.TenSanPham;
  const Soluong = req.body.count;
  const TongTien = req.body.totalprice;
  db.donhangs.create({Username,TenSanPham,Soluong,Diachi,Sodienthoai,TongTien},(err)=>{  // thêm đơn hàng vào database
    if(err){
      console.log(err);   
    }
    else{
      console.log("đã thêm");
      res.redirect("/");
      
    }
  })
})
router.post("/giohang" ,(req,res)=>{
req.session.giohang.push(req.body); // đẩy sản phầm khách hàng gửi lên vào session giỏ hàng

res.redirect("/");
})

// ================= ĐĂNG XUẤT =================
router.post("/logout" , (req,res) =>{
  res.clearCookie("userid"); // xóa cookie từ máy người dùng
  req.logout();
  res.redirect("/");
})


router.post("/removegiohang" , (req,res) =>{
    req.session.giohang = [];
    res.redirect("/");
})
router.get("/search", (req,res) =>{
  var tensanpham = req.query.search ;
  var products = [] ; // tạo mảng chứa sản phẩm người dùng search
  db.products.findOne({id: "1"},(err,data)=>{
   
   data.items.forEach((i) => { // chạy qua tất cả các sản phẩm trong database để kiểm tra
     if(i.name == tensanpham)
     {
       products.push(i); //nếu có sản phẩm trùng khớp thì thêm vào mảng 
     }
   }) 
   res.render("../views/home.ejs" ,{product :products ,giohang:req.session.giohang , username : req.session.user,nowpage_up : 0 ,nowpage_down : 0});  // trả lại trang có sản phẩm phù hợp
  }) 
})
router.post("/xoagiohang" , (req,res) =>{ // xóa từng phần trong mảng
var index = req.body.index;
req.session.giohang.splice(index,1); // xóa đi sản phẩm được chọn
res.redirect("/"); // trả lại trang đầu để cập nhật lại giỏ hàng
  
})
module.exports = router;


