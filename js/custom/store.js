window.addEventListener("load", pageFullyLoaded, false);

var storedBilling = []
var stored_loggedin = []

function pageFullyLoaded(e) {
    stored_loggedin = JSON.parse(localStorage.getItem('loggedin')) || [] /* Retrieve */
    $('.btn-add').on('click', addItem)
    $('.btn-buy').on('click', buyItems)
}

function removeItem(event) {
    // Get current hierarchy/place of where the button is clicked
    let buttonClicked = event.target
    buttonClicked.parentElement.parentElement.parentElement.parentElement.remove()
    updateCartTotal()
}

function addItem(event) {
    let buttonClicked = event.target
    // Get store item name by knowing what button was clicked and where it is 
    let itemName = buttonClicked.previousElementSibling.previousElementSibling.innerHTML
    // Get all of item names in our cart
    let allCartItemNames = $(".cart-item-name").map(function() {
        return this.innerHTML
    }).get()

    // Loop to know if item is already in cart
    for(let i in allCartItemNames) { 
        if(allCartItemNames[i] == itemName) {
            alert(`${itemName} is already in your cart.`)
            return
        }
    }

    // Make a <div> element first
    let cartRow = document.createElement('div') 
    cartRow.classList.add('cart-row')
    // Get price of current item to add in our cart
    let itemPrice = buttonClicked.previousElementSibling.innerHTML.replace('₱', '')
    // Store our <div> content
    let itemRowContent = `<div class="card" style="margin-top:6px">
                            <div class="card-body">
                                <div class="cart-item-row row">
                                    <div class="col">
                                        <p class="cart-item-name" style="font-weight:bold">${itemName}</p> 
                                        <p class="cart-item-price">₱${itemPrice}</p>
                                        <input type="hidden" value="${itemPrice}"/>
                                        Amount:<input class="cart-item-quantity" type="number" value="1"/> <br/>
                                    </div>
                                    <div class="col">
                                        <button class="btn-remove btn-danger ml-4 p-2">Remove</button>
                                    </div>
                                </div> 
                            </div>
                          </div>`
    
    cartRow.innerHTML = itemRowContent
    // Add event listeners to buttons once created
    $('.cart-item-rows').append(cartRow)
    $('.btn-remove').on('click', removeItem)
    $('.cart-item-quantity').on('change', quantityChanged)
    updateCartTotal()
}

function quantityChanged(event) {
    let input = event.target 

    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }

    changedPrice = parseFloat(input.previousElementSibling.value) * input.value

    $(input.previousElementSibling.previousElementSibling).html(`₱${changedPrice}`)
    updateCartTotal()
}

function updateCartTotal() {
    let allCartItemPrices = $(".cart-item-price").map(function() {
        return parseFloat(this.innerHTML.replace('₱', ''))
    }).get()

    // Increment total variable for each item's price in our cart
    let total=0;
    for(let i in allCartItemPrices) { 
        total += allCartItemPrices[i];
    }

    let stringTotal = thousandsSeparators(total)

    // Update total text by using class
    $('.cart-total-price.card-title').html(`Total: ₱${stringTotal}`)
    
}

function buyItems() {
    // Get all of the item's card class
    let allCartItemNames = $(".cart-item-name").map(function() {
        return this.closest(".card")
    }).get()

    if(allCartItemNames.length == 0) {
        alert(`Please select items to buy first. \u{1F3EA}`) 
        return
    }

    updateCartTotal()

    if (stored_loggedin.username != null){
        saveToBilling()
    }

    // Delete all of cart items by knowing their card classes
    for(let i in allCartItemNames) { 
        allCartItemNames[i].remove()   
    }

    alert(`Thank you for buying from our store! \u{1F604}`) 
    
}

// Source: https://www.w3resource.com/javascript-exercises/javascript-math-exercise-39.php
function thousandsSeparators(num)
{
    var num_parts = num.toString().split(".");
    num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return num_parts.join(".");
}

function saveToBilling() {
    storedBilling = JSON.parse(localStorage.getItem('stored_billing')) || [] /* Retrieve */

    let allCartItemNames = $(".cart-item-name").map(function() {
        return this.innerHTML
    }).get()

    let allCartItemQuantity = $(".cart-item-quantity").map(function() {
        return this.value
    }).get()

    let allCartItemPrices = $(".cart-item-price").map(function() {
        return parseFloat(this.innerHTML.replace('₱', ''))
    }).get()

    let totalPrice = $(".cart-total-price").text().replace('Total: ₱', '')

    let dateAndTime = new Date().toLocaleString()
    let newDateAndTime = dateAndTime.replace(', ', '<br>')

    /* Save all of the values of the items in cart to local storage */
    let billingInfo = {buyer: stored_loggedin.username,
                       item_name: allCartItemNames,
                       item_quantity: allCartItemQuantity,
                       item_price: allCartItemPrices,
                       cart_total: totalPrice,
                       date_time: newDateAndTime}
    storedBilling.push(billingInfo)
    localStorage.setItem('stored_billing', JSON.stringify(storedBilling))  /* Save */ 
}

