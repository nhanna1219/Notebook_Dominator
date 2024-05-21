$(function() {
    $('.dropdown').on('mouseenter', function() {
        $(this).find('.dropdown-menu').stop(true, true).fadeIn(100);
    }).on('mouseleave', function() {
        $(this).find('.dropdown-menu').stop(true, true) .fadeOut(100);
    });
});
