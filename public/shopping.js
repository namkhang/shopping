
var clickshopping = document.getElementsByClassName("shopping")[0];
clickshopping.onclick = function () {
  alert("Cảm ơn bạn đã thanh toán đơn hàng")
}


function updatecartshopping() {
    var cart_item = document.getElementsByClassName("cart-items-shopping")[0];
    var cart_rows = cart_item.getElementsByClassName("cart-row-shopping");
    var total = 0;
    for (var i = 0; i < cart_rows.length; i++) {
      var cart_row = cart_rows[i];
      var price_item = cart_row.getElementsByClassName("cart-price-shopping")[0];
      var quantity_item = cart_row.getElementsByClassName("cart-quantity-input-shopping")[0];
      var price = parseFloat(price_item.innerText);// chuyển một chuổi string sang number để tính tổng tiền.
      var quantity = quantity_item.value;// lấy giá trị trong thẻ input
      total = total + (price * quantity);
    }
    document.getElementsByClassName("cart-total-price-shopping")[0].value = total;
    document.getElementsByClassName("cart-total-price-span-shopping")[0].innerText = total  + '$';
    // Thay đổi text = total trong .cart-total-price. Chỉ có một .cart-total-price nên mình sử dụng [0].
  }
  updatecartshopping() 
 //thay đổi số lượng
var quantity_input_shopping = document.getElementsByClassName("cart-quantity-input-shopping");
for (var i = 0; i < quantity_input_shopping.length; i++) {
  var input_shopping = quantity_input_shopping[i];
  input_shopping.addEventListener("change", function (event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
      input.value = 1;
    }
    updatecartshopping()
  })
}