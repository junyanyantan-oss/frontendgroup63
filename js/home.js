$(function () {
    'use strict';

    const $track = $('#gameShowcaseTrack');
    const $cards = $track.children('.home-game-card');
    let currentIndex = 0;
    let timer;

    function visibleCards() {
        if (window.innerWidth < 768) return 1;
        if (window.innerWidth < 1200) return 2;
        return 3;
    }

    function showGame(index) {
        const maximumIndex = Math.max(0, $cards.length - visibleCards());
        currentIndex = Math.min(Math.max(index, 0), maximumIndex);
        const cardWidth = $cards.first().outerWidth(true);
        $track.stop(true).animate({ left: -(currentIndex * cardWidth) }, 550);
        $('#gameShowcaseStatus').text(`Showing game ${currentIndex + 1} of ${$cards.length}`);
    }

    function startScrolling() {
        clearInterval(timer);
        timer = setInterval(function () {
            const maximumIndex = Math.max(0, $cards.length - visibleCards());
            showGame(currentIndex >= maximumIndex ? 0 : currentIndex + 1);
        }, 3000);
    }

    $('#nextGame').on('click', function () {
        showGame(currentIndex + 1);
        startScrolling();
    });

    $('#previousGame').on('click', function () {
        showGame(currentIndex - 1);
        startScrolling();
    });

    $(window).on('resize', function () {
        showGame(currentIndex);
    });

    $track.on('mouseenter', function () { clearInterval(timer); });
    $track.on('mouseleave', startScrolling);

    showGame(0);
    startScrolling();
});
