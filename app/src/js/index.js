'use strict';

$(document).ready(function () {

	// Scroll to top
	if ($(window).innerWidth() > 767) {
		$(window).scroll(function () {
			if ($(this).scrollTop() > 100) {
				$('.scrolltotop').fadeIn();
			} else {
				$('.scrolltotop').fadeOut();
			}
		});

		$('.scrolltotop').click(function () {
			$("html, body").animate({
				scrollTop: 0
			}, 200);
			return false;
		});
	}
});
