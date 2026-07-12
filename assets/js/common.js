// aHR0cHM6Ly9naXRodWIuY29tL2x1b3N0MjYvYWNhZGVtaWMtaG9tZXBhZ2U=
$(function () {
    lazyLoadOptions = {
        scrollDirection: 'vertical',
        effect: 'fadeIn',
        effectTime: 300,
        placeholder: "",
        onError: function(element) {
            console.log('[lazyload] Error loading ' + element.data('src'));
        },
        afterLoad: function(element) {
            if (element.is('img')) {
                // remove background-image style
                element.css('background-image', 'none');
            } else if (element.is('div')) {
                // set the style to background-size: cover; 
                element.css('background-size', 'cover');
                element.css('background-position', 'center');
            }
        }
    }

    $('img.lazy, div.lazy:not(.always-load)').Lazy({visibleOnly: true, ...lazyLoadOptions});
    $('div.lazy.always-load').Lazy({visibleOnly: false, ...lazyLoadOptions});

    $('[data-toggle="tooltip"]').tooltip()

    var $grid = $('.grid').masonry({
        "percentPosition": true,
        "itemSelector": ".grid-item",
        "columnWidth": ".grid-sizer"
    });
    // layout Masonry after each image loads
    $grid.imagesLoaded().progress(function () {
        $grid.masonry('layout');
    });

    $(".lazy").on("load", function () {
        $grid.masonry('layout');
    });

    function updateAbstractToggles() {
        $('.publication-abstract').each(function () {
            var $abstract = $(this);
            var $toggle = $abstract.next('.abstract-toggle');
            if (!$toggle.length || !$abstract.is(':visible')) return;
            var truncated = $abstract.hasClass('expanded') || this.scrollHeight > this.clientHeight + 1;
            $toggle.toggleClass('d-none', !truncated);
        });
    }

    $(document).on('click', '.abstract-toggle', function () {
        var $abstract = $(this).prev('.publication-abstract');
        var expanded = $abstract.toggleClass('expanded').hasClass('expanded');
        $(this).text(expanded ? 'Show less' : 'Read more');
    });

    updateAbstractToggles();

    var abstractResizeTimer;
    $(window).on('resize', function () {
        clearTimeout(abstractResizeTimer);
        abstractResizeTimer = setTimeout(updateAbstractToggles, 150);
    });
})
