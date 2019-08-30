$(document).ready(function(){
	$('.navbar-nav li').click(function() {
		var list_li = document.getElementsByClassName('pageSlide');
		var i = 0;
		$('.navbar-nav li').removeClass('PSactive');
		for(i; i< list_li.length; i += 1)
		{
			$(list_li[i]).removeClass('PSactive');
			$(list_li[i]).removeAttr('style');

		}
		$(this).addClass('PSactive');
		$('#pageContact').css('display', 'none');

		var temp = $(this).data('target');
		$(temp).addClass('PSactive');
	})
})