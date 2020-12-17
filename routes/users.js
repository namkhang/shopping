var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const { log } = require('debug');
var Schema = mongoose.Schema;
var multer  = require('multer')  // khai báo module hỗ trợ upload
var upload = multer({ dest: './public/uploads/' }); //thư mục chứa ảnh dạng bit


router.use(bodyParser());
router.use(cookieParser());
const userSchema = new Schema({
  name  : String ,
  age : Number ,
  phone : String,
  avatar : String,
  rate5 : Number ,
  rate1 : Number 
});
const commentSchema  = new Schema ({
  ten : String ,
  content : String
})

var createpost = mongoose.model("users",userSchema);
var comment = mongoose.model("nhanxets" , commentSchema);


/* GET users listing. */
/*var users = [
  { name : "Khang"  , age : 21},
  { name : "Phong"  , age : 21},
  { name : "Ni", age :21 } ,
  { name : "Dũng", age :21 } ,
];*/
router.get('/', function(req, res) {
  
  
 createpost.find((err,data)=>{
      if(err)
      {
        console.log(err);
        
      }
      comment.find({} , (err,data2) =>{
        res.render("../views/users.ejs", {  users:data , comment : data2} );   
      })
    
 })

});
router.get("/testajax" , (req,res)=>{
  res.render("../views/testajax.ejs");
})

router.post('/search' , (req,res) => {
  /*var search  = req.query.username ;
  var searchuser = users.filter(function(user){
    return user.name.toLowerCase().indexOf(search.toLocaleLowerCase()) !== -1;
  });*/


  createpost.find({ name:req.body.username}, (err,data) =>{
    if(err) {
      console.log(err); 
    }
    res.render("../views/users.ejs" , {users : data});
  })
  
  

})
router.get("/create" ,(req,res) =>{
  res.render("../views/createuser.ejs");
})
router.post("/create",upload.single("avatar"), (req,res)=> {

   console.log(req.body.datetime);
  var name = req.body.name ;
  var age = req.body.age ; 
  var phone = req.body.phone;
  req.body.avatar = req.file.path.substr(7); // gán biến avatar gửi lên bằng đường dẫn file
 
 
  
  createpost.create({name , age , phone ,avatar : req.body.avatar , rate5:0 , rate1 : 0} , (err) => {
    if(err) console.log(err);
    console.log("da them");
    res.redirect("/users");
    
    
  })
})
router.get("/remove" ,(req,res) =>{
  res.render("../views/remove.ejs");
})

router.post("/remove" ,(req,res)=>{
  createpost.remove({name : req.body.name} , (err) =>{
    if(err)
    {
      console.log(err);
      
    }
    console.log("da xoa");
    
  })
  res.redirect("/users");
})
router.get("/chatbox" , (req,res) => {
  res.render("../views/chatbox.ejs");
})

router.post("/rate" ,(req,res) =>{
  var rate = req.body.rate;
  var id = req.body.id;
  if(rate == 5)
  {
    createpost.findOne({_id : id} , (err,data) =>{
      var rate5  = data.rate5 ;
      createpost.update({_id : id} ,{rate5 : (rate5 + 1)},(err,data) =>{
        if(err) 
        {
          console.log(err);
        }
        else{
          console.log("đã cập nhật");
        }

      })
    
    })
  }
  else{
    createpost.findOne({_id : id} , (err,data) =>{
      var rate1 = data.rate1 ;
      createpost.update({_id:id} , {rate1 : (rate1 + 1)} , (err,data) =>{
        if(err) 
        {
          console.log(err);
        }
        else{
          console.log("đã thêm");
        }
      })
    })

  }
  res.redirect("/users");
})
router.post("/nhanxet" , (req,res) =>{
  var nhanxet = req.body.nhanxet;
  comment.create({ten : "khang" , content : nhanxet} ,(err,data) =>{
    console.log("da them");
  });
  res.redirect("/users");
})

module.exports = router;
