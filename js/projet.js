$(document).ready(function(){

	modal = '';

	$('.glob-td').mouseenter(function(event) {
		$(this).css('margin', '20px');
	});

	$('.glob-td').mouseleave(function(event) {
		$(this).css('margin', '10px');
	});

	$('.glob-td').click(function(event) {
		modal = $(this).data('target');
		$(modal).removeClass('hide');
	});


	window.onclick = function(event) {
		if (event.target == modal) {
			$(modal).addClass('hide');
		}
	};

	$('.close').click(function(event) {
		$(modal).addClass('hide');	
	});
})