$(function() {
    function showFlashMessage() {
        setTimeout(function() {
            $('.alert').fadeOut('fast');
        }, 3000);
    }

    showFlashMessage();
});