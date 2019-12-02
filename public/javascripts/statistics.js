(function() {
    $('#statisticSelectShop').on('change', function(e) {
        e.preventDefault();
        $(this).parent().parent().trigger('submit', (e) => {});
    })
})(jQuery);
