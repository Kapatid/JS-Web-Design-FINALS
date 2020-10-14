var sPath = window.location.pathname
var sPage = sPath.substring(sPath.lastIndexOf('/') + 1)

var username
var password

var currently_loggedin = {
  acc_found: false,
  username: "",
  password: ""
}

var stored_accounts = []

var account_found = false

var regexUsername = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/
var regexPassword = /[ ]/

function GetInputValue() {
  this.stored_accounts = JSON.parse(localStorage.getItem('accounts')) || [] /* Retrieve */

  if (sPage == "sign_up.html"){
    username = $("#username").val()
    password = $("#password").val()

    CreateNewAccount(username, password)
  }

  if (sPage == "log_in.html"){
    username = $("#username").val()
    password = $("#password").val()

    SearchAccounts(username, password)  
  }
}

function CreateNewAccount(name, pass){
  var notValidUsername = regexUsername.test(name)
  var notValidPassword = regexPassword.test(pass)

  if (name == "" || pass == "") {
    alert(`Please complete form.`)
    $("#alertDiv").text(`Please complete form.`)
    return
  } 

  if (notValidUsername || notValidPassword) {
    alert(`Username or password not valid.`)
    $("#alertDiv").text(`Username or password not valid.`)
    return
  } 
  
  if (!notValidUsername && !notValidPassword && name != "" && pass != "") {
    var accounts = {un: name, pw: pass}
    stored_accounts.push(accounts)

    localStorage.setItem('accounts', JSON.stringify(stored_accounts)) || []  /* Save */
    alert(`You are now registered.`)
  }
}

function SearchAccounts(name, pass){
  if (name == "" || pass == "") {
    alert(`Please complete form.`)
    return
  } 

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
    localStorage.setItem('loggedin', JSON.stringify(currently_loggedin)) || []  /* Save */
    window.location.href ='../index.html'
  }
  
}   