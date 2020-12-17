var btn = document.getElementById("testajsx");
var loadajax = document.getElementById("loadajax");

btn.onclick = ()=>{
    $.ajax({
        url : "http://localhost:3216/test",
        type : "get",
        dataType:"text",
        success : function (result){
            loadajax.innerHTML =  result;
        }
    })
}