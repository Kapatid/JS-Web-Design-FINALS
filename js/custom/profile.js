document.addEventListener("DOMContentLoaded", theDomHasLoaded, false);
window.addEventListener("load", pageFullyLoaded, false);

var username
var elementIDs = ["#inputName", "#inputEmail", "#inputPassword", "#inputAddress", "#inputPhoneNumber"]
var stored_user_info = []
var stored_loggedin = []
var stored_accounts = []

function theDomHasLoaded(e) {
    stored_loggedin = JSON.parse(localStorage.getItem('loggedin')) || [] /* Retrieve */
    stored_user_info = JSON.parse(localStorage.getItem('user_info')) || [] /* Retrieve */

    if(stored_loggedin.username != null && stored_loggedin.acc_found == true){
        username = stored_loggedin.username
        $('#fullNameDisplay').text(username)
        $('#usernameDisplay').text("@" + username)
        $('#inputName').val(username)
    }

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
}

function pageFullyLoaded() {
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

    $(".custom-file-input").on("change", function() {
        let source = this.value
        $(this.nextElementSibling).text(source)
    })

    $(".edit-input").on("click", function() {
        let $inputField = $("#" + this.parentElement.nextElementSibling.id)
        $inputField.removeClass("form-control-plaintext").addClass("form-control")
        $inputField.attr("readonly", false)
    })

    $(".btn-save-changes").on("click", function() {
        let userInfo = {username: username,
                        name: $(elementIDs[0]).val(), 
                        email: $(elementIDs[1]).val(),
                        change_password: $(elementIDs[2]).val(),
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
        console.log("Infos saved")
    })

    tippy('.edit-input', {
        placement: 'right',
        animation: 'fade'
    });


}
