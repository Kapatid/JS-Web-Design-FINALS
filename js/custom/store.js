
document.addEventListener("DOMContentLoaded", theDomHasLoaded, false);
window.addEventListener("load", pageFullyLoaded, false);

function theDomHasLoaded(e) {
    var username;
    var stored_loggedin = JSON.parse(localStorage.getItem('loggedin')) || []; /* Retrieve */

    if(stored_loggedin.username != null && stored_loggedin.acc_found == true){
        username = stored_loggedin.username;
        $('#navLoginSignup').hide()
        $('#accountDropdown').show()
        $('#navbarDropdown').text(username)
    } else {
        $('#navLoginSignup').show()
        $('#accountDropdown').hide()
        $('#navbarDropdown').text('Account')
    }

    $("body").removeClass("preload");

    // Immediately add events on add item to cart buttons
    $('.btn-add').on('click', addItem)
    $('.btn-buy').on('click', buyItems)
}

function pageFullyLoaded(e) {
    $('#logoutButton').on('click', LogOut)

    function LogOut(){
        var reset_values = {};
        localStorage.setItem('loggedin', JSON.stringify(reset_values)) || [];  /* Save */
        location = location;
        location.reload()
      }

    $(window).on('scroll', () => {
        $('nav').toggleClass('scrolled', $(this).scrollTop() > 50);
    });

    tippy('#socialMediaBtn', {
        placement: 'bottom',
        animation: 'shift-away'
    });

    updateCartTotal()
}

// #region STORE FUNCTIONS 
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
    let itemPrice = buttonClicked.previousElementSibling.innerHTML.replace('Price: ₱', '')
    // Store our <div> content
    let itemRowContent = `<div class="card" style="margin-top:6px">
                            <div class="card-body">
                                <div class="cart-item-row row">
                                    <div class="col">
                                        <p class="cart-item-name" style="font-weight:bold">${itemName}</p> 
                                        <p class="cart-item-price">Price: ₱${itemPrice}</p>
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

    $(input.previousElementSibling.previousElementSibling).html(`Price: ₱${changedPrice}`)
    updateCartTotal()
}

function updateCartTotal() {
    let allCartItemPrices = $(".cart-item-price").map(function() {
        return parseFloat(this.innerHTML.replace('Price: ₱', ''))
    }).get()

    // Increment total variable for each item's price in our cart
    let total=0;
    for(let i in allCartItemPrices) { 
        total += allCartItemPrices[i];
    }

    // Update total text by using class
    $('.cart-total-price.card-title').html(`Total: ${total}`)
    
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

    // Delete all of cart items by knowing their card classes
    for(let i in allCartItemNames) { 
        allCartItemNames[i].remove()   
    }

    alert(`Thank you for buying from our store! \u{1F604}`) 
    updateCartTotal()
}
// #endregion

