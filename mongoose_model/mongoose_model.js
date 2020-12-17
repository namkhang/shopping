var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const userSchema = new Schema({
    email:String,
    password: String,
    fullname : String
  });
  const usershoppingSchema = new Schema({
    Username : String,
    TenSanPham:Array,
    Soluong : Array,
    Diachi : String ,
    Sodienthoai : String ,
    TongTien:Number
  });
  const productSchema = new Schema({
    id : String,
  items : Array
  });
  const userfb = new Schema({
    id : String ,
    displayName : String ,
    email : String
  })
  const usergmail  = new Schema({
   id : String ,
   displayName : String ,
   email : String
  
  })
module.exports.products = mongoose.model("products",productSchema);
module.exports.accounts= mongoose.model("accounts", userSchema); //tạo ra collection có tên là account trong mongodb 
module.exports.donhangs = mongoose.model("donhangs", usershoppingSchema); 
module.exports.accountface = mongoose.model("accountface" , userfb);
module.exports.accountgmail = mongoose.model("accountgmail" , usergmail);
