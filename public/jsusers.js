
var socket = io("https://khangnguyenshop.herokuapp.com");
var btnrate5 = document.getElementsByClassName("btnrate5");
var btnrate1 = document.getElementsByClassName("btnrate1");
var li = document.getElementsByClassName("rate");
for(var i = 0 ; i < btnrate5.length ; i++)
{
     var btn5 = btnrate5[i];
     btn5.addEventListener("click" , (even)=>{
         socket.emit("rate5" , {id : btnrate5.idname , rate : 5});
         console.log(i);
     })

}
for(var i = 0 ; i < btnrate1.length ; i++)
{
     var btn1 = btnrate1[i];
     btn1.addEventListener("click" , (even)=>{
         socket.emit("rate1" , {id : btnrate1.idname , rate : 1});
     })
}
socket.on("server-rate" , (data) =>{
 for( var i = 0 ; i<li.length ; i++)
 {
     if(li[i].idli == btnrate5.idname)
     {
       
         li[i].innerHTML = `Đánh giá 5 sao : ${data.rate5}  , Đánh giá 1 sao : ${data.rate1} `;
     }

 }
})