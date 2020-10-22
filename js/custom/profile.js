document.addEventListener("DOMContentLoaded", theDomHasLoaded, false);
window.addEventListener("load", pageFullyLoaded, false);

var username
var elementIDs = ["#inputName", "#inputEmail", "#inputPassword", "#inputAddress", "#inputPhoneNumber"]
var stored_user_info = []
var stored_loggedin = []
var stored_accounts = []
var storedBilling = []

function theDomHasLoaded(e) {
    stored_loggedin = JSON.parse(localStorage.getItem('loggedin')) || [] /* Retrieve */
    stored_user_info = JSON.parse(localStorage.getItem('user_info')) || [] /* Retrieve */
    storedBilling = JSON.parse(localStorage.getItem('stored_billing')) || [] /* Retrieve */

    /* Get user's username and display to page */
    if(stored_loggedin.username != null && stored_loggedin.acc_found == true){
        username = stored_loggedin.username
        $('#fullNameDisplay').text(username)
        $('#usernameDisplay').text("@" + username)
        $('#inputName').val(username)
    }

    /* Get saved user information and insert to page */
    for (let i in stored_user_info) {
        if (stored_loggedin.username == stored_user_info[i].username) {
            $(elementIDs[0]).val(stored_user_info[i].name)
            $(elementIDs[1]).val(stored_user_info[i].email)
            $(elementIDs[3]).val(stored_user_info[i].address)
            $(elementIDs[4]).val(stored_user_info[i].phone_number)
            break
        }
    }

    /* $(".edit-profile").hide() */
    $(".edit-billing").hide()
    $(".edit-settings").hide()
    $("#alertPasswordChange").hide()
}

function pageFullyLoaded() {

    /* On page load load all of the billing information of the user */
    for (var i in storedBilling) {
        if (storedBilling[i].buyer == username) {
            var itemNames = []
            var itemPrices = []
            var dateTime = storedBilling[i].date_time
            var cartTotal = storedBilling[i].cart_total

            /* Loop and push item name and prices from local storage into new local variable */
            for (var k in storedBilling[i].item_name) {
                let tempItemNames = storedBilling[i].item_name[k] + "<br>"
                let tempPrice = storedBilling[i].item_price[k] / storedBilling[i].item_quantity[k]
                let tempItemPrices =" ₱" + tempPrice +
                                    " (x" + storedBilling[i].item_quantity[k] + ")" + "<br>" 
                                   
                itemNames.push(tempItemNames)
                itemPrices.push(tempItemPrices)
            }

            /* Remove commas */
            let itemNamesToString = itemNames.join('')
            let itemPricesToString = itemPrices.join('')

            /* Data to insert in our html page */
            let itemRowContent = `<tr>
                                    <td class="td-date" style="width: 25%">${dateTime}</td>
                                    <td style="width: 2%">${itemNamesToString}</td>
                                    <td style="width: 25%"> <div class="col">
                                          <div class="row justify-content-center mb-2">
                                              ${itemPricesToString}
                                          </div>
                                          <div class="row border-top justify-content-center">
                                              ₱${cartTotal}
                                         </div>
                                         </div>
                                    </td>
                                  </tr>`

            /* Put itemRowContent in the specified html element by class */
            $('.billing-item-table').append(itemRowContent)
        }
    }

    /* Change password event */
    $("#changePasswordButton").on("click", () => {
        event.preventDefault()
        stored_accounts = JSON.parse(localStorage.getItem('accounts')) || [] /* Retrieve */

        let inputNewPassword = $('#inputNewPassword').val()
        let inputOldPassword = $('#inputOldPassword').val()
        let changeUserPass = true
        let usernameAndPassword = {un: username, pw: inputNewPassword}

        /* Search for matching username and change the password in local storage */
        for (let i in stored_accounts) {
            if (stored_accounts[i].un == username && stored_accounts[i].pw == inputOldPassword) {
                stored_accounts.splice([i], 1, usernameAndPassword)
                changeUserPass = true
                break
            } else {
                changeUserPass = false
            }
        }
        
        localStorage.setItem('accounts', JSON.stringify(stored_accounts))  /* Save */ 

        /* Reset input html elements to empty */
        $('#inputNewPassword').val("")
        $('#inputOldPassword').val("")

        /* Toggle alert html element */
        if (changeUserPass == true) {
            $('#alertPasswordChange').text("Password successfully changed!")
            $('#alertPasswordChange').show()
        } else {
            $('#alertPasswordChange').text("Please try again")
            $('#alertPasswordChange').show()
        }
        $('#alertPasswordChange').delay(900).fadeOut(800)
    })

    /* Reset local storage event */
    $("#resetButton").on("click", () => {
        event.preventDefault()
        localStorage.removeItem('stored_billing')
        localStorage.removeItem('loggedin')
        localStorage.removeItem('accounts')
        localStorage.removeItem('user_info')
        window.location.href ='../index.html'
    })
    
    /* Change profile view events */
    $(".link-profile").on("click", () => {
        event.preventDefault()
        $(".edit-profile").show()
        $(".edit-billing").hide()
        $(".edit-settings").hide()
    })
    $(".link-billing").on("click", () => {
        event.preventDefault()
        $(".edit-profile").hide()
        $(".edit-billing").show()
        $(".edit-settings").hide()
    })
    $(".link-settings").on("click", () => {
        event.preventDefault()
        $(".edit-profile").hide()
        $(".edit-billing").hide()
        $(".edit-settings").show()
    })

    /* Change user's image but not used because of website security reasons */
    $(".custom-file-input").on("change", function() {
        let source = this.value
        $(this.nextElementSibling).text(source)
    })

    /* Edit (the one with pencil image) event for every input html element */
    $(".edit-input").on("click", function() {
        let $inputField = $("#" + this.parentElement.nextElementSibling.id)
        $inputField.removeClass("form-control-plaintext").addClass("form-control")
        $inputField.attr("readonly", false)
    })

    /* Save value of every input html element to local storage */
    $(".btn-save-changes").on("click", function() {
        let userInfo = {username: username,
                        name: $(elementIDs[0]).val(), 
                        email: $(elementIDs[1]).val(),
                        address: $(elementIDs[3]).val(),
                        phone_number: $(elementIDs[4]).val()}
        let pushUserInfo = true
        
        $('#fullNameDisplay').text($(elementIDs[0]).val())
        
        for (let i in stored_user_info) {
            if (stored_user_info[i].username == userInfo.username) {
                stored_user_info.splice([i], 1, userInfo)
                pushUserInfo = false
                break
            }
        }
        if (pushUserInfo == true) {
            stored_user_info.push(userInfo)
        }

        localStorage.setItem('user_info', JSON.stringify(stored_user_info))  /* Save */ 

        for (let i in elementIDs) {
            let $currentElem = $(elementIDs[i])

            $currentElem.removeClass("form-control").addClass("form-control-plaintext")
            $currentElem.attr("readonly", true)
        }
    })

    tippy('.edit-input', {
        placement: 'right',
        animation: 'fade'
    });


}
