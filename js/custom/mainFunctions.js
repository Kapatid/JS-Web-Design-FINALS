$(function(){
    /* Unused because files needs to be loaded locally */
    /* $("#nav-placeholder").load("./common/navbar.html");
    $("#footer-placeholder").load("./common/footer.html"); */
    // object-fit polyfill run

    $(window).scroll(function(){
        $('nav').toggleClass('scrolled', $(this).scrollTop() > 50);
    });

    tippy('#socialMediaBtn', {
        placement: 'bottom',
        animation: 'shift-away'
    });
    
    // object-fit polyfill run
});
