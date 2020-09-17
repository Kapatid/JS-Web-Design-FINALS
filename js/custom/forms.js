var sPath = window.location.pathname
var sPage = sPath.substring(sPath.lastIndexOf('/') + 1)

var username
var password

var currently_loggedin = {
  acc_found: false,
  username: "",
  password: ""
}

var stored_accounts
var stored_loggedin

var account_found = false

function GetInputValue() {
  this.stored_accounts = JSON.parse(localStorage.getItem('accounts')) || [] /* Retrieve */
  this.stored_loggedin = JSON.parse(localStorage.getItem('loggedin')) || [] /* Retrieve */

  if (sPage == "sign_up.html"){
    username = document.getElementById("username").value
    password = document.getElementById("password").value

    InputNewAccount(username, password)
    alert("Your are now registered.")
  }

  if (sPage == "log_in.html"){
    username = document.getElementById("username").value
    password = document.getElementById("password").value

    SearchAccounts(username, password)

    localStorage.setItem('loggedin', JSON.stringify(currently_loggedin)) || []  /* Save */
    location.reload()
  }
}

function InputNewAccount(name, pass){
  var accounts = {un: name, pw: pass}

  stored_accounts.push(accounts)
  
  localStorage.setItem('accounts', JSON.stringify(stored_accounts)) || []  /* Save */
}

function SearchAccounts(name, pass){

  try{
    for (let i = 0; i <= this.stored_accounts.length; i++) {
      if (name == stored_accounts[i].un && pass == stored_accounts[i].pw){
        currently_loggedin.acc_found = true
        this.account_found = true
        break
      }
    }
  }
  catch{  /* If there is error execute following code */
    currently_loggedin.acc_found = false;
    alert("Account not found.")
  }

  if (this.account_found == true){
    currently_loggedin.username = this.username
    currently_loggedin.password = this.password
    alert("You are now logged in.")
  }

}   