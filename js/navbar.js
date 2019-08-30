$(document).ready(function(){
	$('#navbar-icon').click(function(event)
	{
		event.preventDefault();
		$('body').toggleClass('sidebar');
	});

	$('body').click(function(event) {
		var navbarli = document.querySelector('.navbar-icon');
		if (event.target != navbarli) {
			$('body').removeClass('sidebar');
		}
	});
})