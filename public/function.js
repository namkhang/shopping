var modal = document.getElementById("myModal");
var btn = document.getElementsByClassName("cart")[0];
var close = document.getElementsByClassName("close")[0];
var close_footer = document.getElementsByClassName("close-footer")[0];
btn.onclick = function () {
  modal.style.display = "block";
}
close.onclick = function () {
  modal.style.display = "none";
}
close_footer.onclick = function () {
  modal.style.display = "none";
}
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
function updatecart() {
  var cart_item = document.getElementsByClassName("cart-items")[0];
  var cart_rows = cart_item.getElementsByClassName("cart-row");
  var total = 0;
  for (var i = 0; i < cart_rows.length; i++) {
    var cart_row = cart_rows[i];
    var price_item = cart_row.getElementsByClassName("cart-price ")[0];
    var quantity_item = cart_row.getElementsByClassName("cart-quantity-input")[0];
    var price = parseFloat(price_item.innerText);// chuyển một chuổi string sang number để tính tổng tiền.
    var quantity = quantity_item.value;// lấy giá trị trong thẻ input
    total = total + (price * quantity);
  }
  document.getElementsByClassName("cart-total-price-span")[0].innerText = total + '$';
  // Thay đổi text = total trong .cart-total-price. Chỉ có một .cart-total-price nên mình sử dụng [0].
}
//xóa
/*var remove_cart = document.getElementsByClassName("btn-danger");
for (var i = 0; i < remove_cart.length; i++) {
  var button = remove_cart[i]
  button.addEventListener("click", function () {
    var button_remove = event.target;
    button_remove.parentElement.parentElement.remove();
    updatecart();
  })
}*/
//thay đổi số lượng
var quantity_input = document.getElementsByClassName("cart-quantity-input");
for (var i = 0; i < quantity_input.length; i++) {
  var input = quantity_input[i];
  input.addEventListener("change", function (event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
      input.value = 1;
    }
    updatecart()
  })
}

var quantity_input_product = document.getElementsByClassName("cart-quantity-input-product");
for (var i = 0; i < quantity_input_product.length; i++) {
  var input_product = quantity_input_product[i];
  input_product.addEventListener("change", function (event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
      input.value = 1;
    }
  })
}
//thêm
var add_cart = document.getElementsByClassName("btn-cart");
for (var i = 0; i < add_cart.length; i++) {
  var add = add_cart[i];
  add.addEventListener("click", function (event) {
    alert("Sản phẩm vừa được thêm vào giỏ hàng của bạn");
    
  })
  updatecart();
}
var xoagiohang = document.getElementsByClassName("btn-remove");
for (var i = 0; i < xoagiohang.length; i++) {
  var remove = xoagiohang[i];
     remove.addEventListener("click", function (event) {
    alert("Sản phẩm vừa được xóa khỏi giỏ hàng của bạn");
  })
  updatecart()
}
var clearall = document.getElementsByClassName("btn-clearall");
for (var i = 0; i < clearall.length; i++) {
  var xoatoanbogiohang = clearall[i];
     xoatoanbogiohang.addEventListener("click", function (event) {
    alert("Toàn bộ giỏ hàng đã được xóa");
  })
}
/*
function addItemToCart(title, price, img) {
  var cartRow = document.createElement('div')
  cartRow.classList.add('cart-row')
  var cartItems = document.getElementsByClassName('cart-items')[0]
  var cart_title = cartItems.getElementsByClassName('cart-item-title')
  for (var i = 0; i < cart_title.length; i++) {
    if (cart_title[i].innerText == title) {
      alert('Sản Phẩm Đã Có Trong Giỏ Hàng')
      return
    }
  }

  var cartRowContents = `
  <div class="cart-item cart-column">
      <img class="cart-item-image" src="${img}" width="100" height="100">
      <span class="cart-item-title">${title}<input  class="tensanpham" type="text" name="TenSanPham" value="${title}" style="display: none;"></span>
  </div>
  <span class="cart-price cart-column">${price}</span>
  <div class="cart-quantity cart-column">
      <input class="cart-quantity-input" name="count" type="number" value="1">
      <button class="btn btn-danger" type="button">Xóa</button>
  </div>`
  cartRow.innerHTML = cartRowContents
  cartItems.append(cartRow)
  cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', function () {
    var button_remove = event.target
    button_remove.parentElement.parentElement.remove()
    updatecart()
  })
  cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', function (event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
      input.value = 1;
    }
    updatecart()
  })
}*/