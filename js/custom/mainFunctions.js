$(function(){
    /* Unused because of CORS policy when files are not on a server */
    /* $("#nav-placeholder").load("./common/navbar.html");
    $("#footer-placeholder").load("./common/footer.html"); 

    $.getJSON('../common/users.json', (data) => {
        $.each(data, (i, user) => {
            console.log(`username: ${user.username} password: ${user.password} \n`)
        })
    })*/

    let username;
    let stored_loggedin = JSON.parse(localStorage.getItem('loggedin')) || []; /* Retrieve */

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
});
