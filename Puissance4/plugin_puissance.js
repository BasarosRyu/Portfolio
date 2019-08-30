(function($)
{ 
	$.fn.plugin_puissance=function()
	{
	var grille_x = how_grille_x();
	var grille_y = how_grille_y();
	var player_one = color_player_one();
	var player_two = color_player_two();
	var score_player_one = 0;
	var score_player_two = 0;
	var last_play;


	/*-----------------------------------------------*\ 
				Pour les options : grille et couleurs
	\*-----------------------------------------------*/
	function how_grille_y()
	{
		var grille_y = 6;
		var test = $('#grille_y').text();

		if($('#grille_y').text().length > 0)
		{
			if($.isNumeric(test) == false) 
				{ return grille_y; }

			else if($.isNumeric(test) != false)
			{ 
				if($('#grille_y').text() == "1")
					{ grille_y = 6 }

				else if($('#grille_y').text() == "2")
					{ grille_y = 6 }

				else if($('#grille_y').text() == "3")
					{ grille_y = 6 }
				else
					{ grille_y = test}
			}

		}
		return grille_y;
	}

	function how_grille_x()
	{
		var grille_x = 7;
		var test = $('#grille_x').text();

		if($('#grille_x').text().length > 0)
		{
			if($.isNumeric(test) == false) 
				{ return grille_x; }

			else if($.isNumeric(test) != false)
			{ 
				if($('#grille_x').text() == "1")
					{ grille_x = 7 }

				else if($('#grille_x').text() == "2")
					{ grille_x = 7 }

				else if($('#grille_x').text() == "3")
					{ grille_x = 7 }
				else
					{ grille_x = test}
			}
		}
		return grille_x;
	}

	function color_player_one()
	{
		var color_one;

		if($('#color_one').text().length > 0)
			{ color_one = $('#color_one').text(); }
		else
			{ color_one = 'red'; }
		return color_one;
	}

	function color_player_two()
	{	
		var color_two;

		if($('#color_two').text().length > 0)
		 { color_two = $('#color_two').text(); }
		else
		 { color_two = 'yellow'; }
		return color_two;
	}


	/*-----------------------------------------------*\ 
				Poser le jeton/la pièce
	\*-----------------------------------------------*/
	function pos_piece(element)
	{
		if(who_play %2 == 0)
		{
			if(element.data('played') != 'yes')
			{
				$(element).css('background-color', color_player_two());
				$(element).attr('data-played', 'yes');
				$(element).data('color', color_player_two());
				$("#text_affich").html('----- Au tour du joueur 1 -----');
			}
		}

		if(who_play %2 != 0)
		{
			if(element.data('played') != 'yes')
			{
				$(element).css('background-color', color_player_one());
				$(element).attr('data-played', 'yes');
				$(element).data('color', color_player_one());
				$("#text_affich").html('----- Au tour du joueur 2 -----');
			}
		}
		$('.circle_player_two').remove();
		$('.circle_player_one').remove();
		who_play +=1;
	}


	/*-----------------------------------------------*\ 
			Vérification pour poser un jeton
	\*-----------------------------------------------*/
	function shut_down(element, element2)
	{
		var l = element2;

		for(l; l > 0; l -=1)
		{
			if($('[data-posy="'+ l +'"][data-posx="'+ $(element).data('posx') +'"]').attr('data-played') != "yes")
			{
				animation(element, $('[data-posy="'+ l +'"][data-posx="'+ $(element).data('posx') +'"]'));
				return false;
			}
		}	
	}

	function animation(element, element2)
	{
		var posTop = $('[data-posy="1"]').offset().top;
		var posLeft = $(element).offset().left;

		if(who_play %2 == 0)
		{
			$('body').prepend('<div class="circle_player_two"></div>');
			$('.circle_player_two').css({
				top: (posTop-8),
				left: (posLeft-8),
				'background-color': color_player_two()
			})
			$('.circle_player_two').animate({
				top : '+=' + ($(element2).offset().top - posTop)
			},500,'linear').queue(function()
			{
				pos_piece(element2);
				winner_is(element2);
			});
		}

		if(who_play %2 != 0)
		{
			$('body').prepend('<div class="circle_player_one"></div>');
			$('.circle_player_one').css({
				top: (posTop-8),
				left: (posLeft-8),
				'background-color': color_player_one()
			})
			$('.circle_player_one').animate({
				top : '+=' + ($(element2).offset().top - posTop)
			},500,'linear').queue(function()
			{
				pos_piece(element2);
				winner_is(element2);
			});
		}
		last_play = element2;
	}


	/*-----------------------------------------------*\ 
		Test de IA && extra 
	\*-----------------------------------------------*/

	function random_nbr(min, max)
	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	function IA_play(element, element2)
	{	
		var play_here_verti = can_win_verti(last_play);
		var play_here_hori = can_win_hori(last_play);
		var play_here_slash = can_win_slash(last_play);
		var play_here_anti_slash = can_win_anti_slash(last_play);
		var rand = random_nbr(1, element);

		if(play_here_verti != undefined)
			{ shut_down($('[data-posx="'+ play_here_verti.data('posx')+'"][data-posy="'+ play_here_verti.data('posy') +'"]'), element2); }

		else if(play_here_hori != undefined)
			{ shut_down($('[data-posx="'+ play_here_hori.data('posx')+'"][data-posy="'+ play_here_hori.data('posy') +'"]'), element2); }

		else if(play_here_slash != undefined)
			{ shut_down($('[data-posx="'+ play_here_slash.data('posx')+'"][data-posy="'+ play_here_slash.data('posy') +'"]'), element2); }

		else if(play_here_anti_slash != undefined)
			{ shut_down($('[data-posx="'+ play_here_anti_slash.data('posx')+'"][data-posy="'+ play_here_anti_slash.data('posy') +'"]'), element2); }
		else
			{ shut_down($('[data-posx="'+rand+'"][data-posy="1"]'), element2); }
	}

	/*
	Le bot vérifie s'il peut gagner ou s'il doit gagner verticalement
	*/

	function verif_can_win_verti(element)
	{
		var validation = false;
	 	var next1 = $('[data-posx="'+ $(element).data('posx') +'"][data-posy="'+ ($(element).data('posy')+1) +'"]').data('color');
	 	var next2 = $('[data-posx="'+ $(element).data('posx') +'"][data-posy="'+ ($(element).data('posy')+2) +'"]').data('color');
	 	var next3 = $('[data-posx="'+ $(element).data('posx') +'"][data-posy="'+ ($(element).data('posy')+3) +'"]').data('color');

		if(next1 == player_one && next2 == player_one && next3 == player_one
			|| next1 == player_two && next2 == player_two && next3 == player_two)
			{ validation = true; }
		return validation;
	}

	function can_win_verti(element)
	{
		var list_case = $('[data-played="no"]');
		var o = 0;

		for(o; o < list_case.length; o +=1)
		{
			if(verif_can_win_verti(list_case[o]) == true)
				{ return $('[data-posx="'+ $(list_case[o]).data('posx') +'"][data-posy="'+ $(list_case[o]).data('posy') +'"]') }
		}	
	}

	/*
	Le bot vérifie s'il peut gagner ou s'il doit gagner horizontalement
	*/

	function verif_can_win_hori(element)
	{
		var validation = false;
		var next1 = $('[data-posx="'+ ($(element).data('posx') +1) +'"][data-posy="'+ $(element).data('posy') +'"]').data('color');
		var next2 = $('[data-posx="'+ ($(element).data('posx') +2) +'"][data-posy="'+ $(element).data('posy') +'"]').data('color');
		var next3 = $('[data-posx="'+ ($(element).data('posx') +3) +'"][data-posy="'+ $(element).data('posy') +'"]').data('color');
	 	var prev1 = $('[data-posx="'+ ($(element).data('posx') -1) +'"][data-posy="'+ $(element).data('posy') +'"]').data('color');
		var prev2 = $('[data-posx="'+ ($(element).data('posx') -2) +'"][data-posy="'+ $(element).data('posy') +'"]').data('color');
		var prev3 = $('[data-posx="'+ ($(element).data('posx') -3) +'"][data-posy="'+ $(element).data('posy') +'"]').data('color');

		if(next1 == player_one && next2 == player_one && next3 == player_one
			|| prev1 == player_one && prev2 == player_one && prev3 == player_one
			|| prev1 == player_one && next1 == player_one && next2 == player_one
			|| prev2 == player_one && prev1 == player_one && next1 == player_one)
			{ validation = true; }

		if(next1 == player_two && next2 == player_two && next3 == player_two
			|| prev1 == player_two && prev2 == player_two && prev3 == player_two
			|| prev1 == player_two && next1 == player_two && next2 == player_two
		 	|| prev2 == player_two && prev1 == player_two && next1 == player_two)
			{ validation = true; }

		return validation;
	}

	function can_win_hori(element)
	{
		var list_case = $('[data-played="no"]');
		var o = 0;

		for(o; o < list_case.length; o +=1)
		{
			if(verif_can_win_hori(list_case[o]) == true)
				{ return $('[data-posx="'+ $(list_case[o]).data('posx') +'"][data-posy="'+ $(list_case[o]).data('posy') +'"]') }
		}	
	}

	/*
	Le bot vérifie s'il peut gagner ou s'il doit gagner en diagonale
	*/

	function verif_can_win_slash(element)
	{
	 	var validation = false;
		var next1 = $('[data-posx="'+ ($(element).data('posx') +1) +'"][data-posy="'+ ($(element).data('posy')-1) +'"]').data('color');
		var next2 = $('[data-posx="'+ ($(element).data('posx') +2) +'"][data-posy="'+ ($(element).data('posy')-2) +'"]').data('color');
		var next3 = $('[data-posx="'+ ($(element).data('posx') +3) +'"][data-posy="'+ ($(element).data('posy')-3) +'"]').data('color');
		var prev1 = $('[data-posx="'+ ($(element).data('posx') -1) +'"][data-posy="'+ ($(element).data('posy')+1) +'"]').data('color');
		var prev2 = $('[data-posx="'+ ($(element).data('posx') -2) +'"][data-posy="'+ ($(element).data('posy')+2) +'"]').data('color');
		var prev3 = $('[data-posx="'+ ($(element).data('posx') -3) +'"][data-posy="'+ ($(element).data('posy')+3) +'"]').data('color');

		if(next1 == player_one && next2 == player_one && next3 == player_one
			|| prev1 == player_one && prev2 == player_one && prev3 == player_one
			|| prev1 == player_one && next1 == player_one && next2 == player_one
			|| prev2 == player_one && prev1 == player_one && next1 == player_one)
			{ validation = true; }

		if(next1 == player_two && next2 == player_two && next3 == player_two
			|| prev1 == player_two && prev2 == player_two && prev3 == player_two
			|| prev1 == player_two && next1 == player_two && next2 == player_two
			|| prev2 == player_two && prev1 == player_two && next1 == player_two)
			{ validation = true; }
		return validation;
	}

	function can_win_slash(element)
	{
		var list_case = $('[data-played="no"]');
		var o = 0;

		for(o; o < list_case.length; o +=1)
		{
			if(verif_can_win_slash(list_case[o]) == true)
				{ return $('[data-posx="'+ $(list_case[o]).data('posx') +'"][data-posy="'+ $(list_case[o]).data('posy') +'"]') }
		}	
	}

	function verif_can_win_anti_slash(element)
	{
	 	var validation = false;
		var next1 = $('[data-posx="'+ ($(element).data('posx') +1) +'"][data-posy="'+ ($(element).data('posy')+1) +'"]').data('color');
		var next2 = $('[data-posx="'+ ($(element).data('posx') +2) +'"][data-posy="'+ ($(element).data('posy')+2) +'"]').data('color');
		var next3 = $('[data-posx="'+ ($(element).data('posx') +3) +'"][data-posy="'+ ($(element).data('posy')+3) +'"]').data('color');
		var prev1 = $('[data-posx="'+ ($(element).data('posx') -1) +'"][data-posy="'+ ($(element).data('posy')-1) +'"]').data('color');
		var prev2 = $('[data-posx="'+ ($(element).data('posx') -2) +'"][data-posy="'+ ($(element).data('posy')-2) +'"]').data('color');
		var prev3 = $('[data-posx="'+ ($(element).data('posx') -3) +'"][data-posy="'+ ($(element).data('posy')-3) +'"]').data('color');

		if(next1 == player_one && next2 == player_one && next3 == player_one 
			|| prev1 == player_one && prev2 == player_one && prev3 == player_one
			|| prev1 == player_one && next1 == player_one && next2 == player_one
			|| prev2 == player_one && prev1 == player_one && next1 == player_one)
			{ validation = true; }

		if(next1 == player_two && next2 == player_two && next3 == player_two 
			|| prev1 == player_two && prev2 == player_two && prev3 == player_two
			|| prev1 == player_two && next1 == player_two && next2 == player_two
			|| prev2 == player_two && prev1 == player_two && next1 == player_two)
			{ validation = true; }
		return validation;
	}

	function can_win_anti_slash(element)
	{
		var list_case = $('[data-played="no"]');
		var o = 0;

		for(o; o < list_case.length; o +=1)
		{
			if(verif_can_win_anti_slash(list_case[o]) == true)
				{ return $('[data-posx="'+ $(list_case[o]).data('posx') +'"][data-posy="'+ $(list_case[o]).data('posy') +'"]') }
		}	
	}

	/*-----------------------------------------------*\ 
		Fonction pour vérifier si on a gagné
	\*-----------------------------------------------*/
	function win_horizontal(element)
	{
		var validation = false;
		var good_color = $('[data-posx="'+ $(element).data('posx') +'"][data-posy="'+ $(element).data('posy') +'"]').data('color');
		var next1 = $('[data-posx="'+ ($(element).data('posx') +1) +'"][data-posy="'+ $(element).data('posy') +'"]').data('color');
		var next2 = $('[data-posx="'+ ($(element).data('posx') +2) +'"][data-posy="'+ $(element).data('posy') +'"]').data('color');
		var next3 = $('[data-posx="'+ ($(element).data('posx') +3) +'"][data-posy="'+ $(element).data('posy') +'"]').data('color');
		var prev1 = $('[data-posx="'+ ($(element).data('posx') -1) +'"][data-posy="'+ $(element).data('posy') +'"]').data('color');
		var prev2 = $('[data-posx="'+ ($(element).data('posx') -2) +'"][data-posy="'+ $(element).data('posy') +'"]').data('color');
		var prev3 = $('[data-posx="'+ ($(element).data('posx') -3) +'"][data-posy="'+ $(element).data('posy') +'"]').data('color');

		if(next1 == good_color && next2 == good_color && next3 == good_color
			|| prev1 == good_color && prev2 == good_color && prev3 == good_color
			|| prev1 == good_color && next1 == good_color && next2 == good_color
			|| prev2 == good_color && prev1 == good_color && next1 == good_color)
			{ validation = true; }
		return validation;
	}

	function win_vertical(element)
	{
	 	var validation = false;
	 	var good_color = $('[data-posx="'+ $(element).data('posx') +'"][data-posy="'+ $(element).data('posy') +'"]').data('color');
	 	var next1 = $('[data-posx="'+ $(element).data('posx') +'"][data-posy="'+ ($(element).data('posy')+1) +'"]').data('color');
	 	var next2 = $('[data-posx="'+ $(element).data('posx') +'"][data-posy="'+ ($(element).data('posy')+2) +'"]').data('color');
	 	var next3 = $('[data-posx="'+ $(element).data('posx') +'"][data-posy="'+ ($(element).data('posy')+3) +'"]').data('color');

	 	if(next1 == good_color && next2 == good_color && next3 == good_color)
	 		{ validation = true; }
	 	return validation;
	}

	function win_diagonale_slash(element)
	{
	 	var validation = false;
		var good_color = $('[data-posx="'+ $(element).data('posx') +'"][data-posy="'+ $(element).data('posy') +'"]').data('color');
		var next1 = $('[data-posx="'+ ($(element).data('posx') +1) +'"][data-posy="'+ ($(element).data('posy')-1) +'"]').data('color');
		var next2 = $('[data-posx="'+ ($(element).data('posx') +2) +'"][data-posy="'+ ($(element).data('posy')-2) +'"]').data('color');
		var next3 = $('[data-posx="'+ ($(element).data('posx') +3) +'"][data-posy="'+ ($(element).data('posy')-3) +'"]').data('color');
		var prev1 = $('[data-posx="'+ ($(element).data('posx') -1) +'"][data-posy="'+ ($(element).data('posy')+1) +'"]').data('color');
		var prev2 = $('[data-posx="'+ ($(element).data('posx') -2) +'"][data-posy="'+ ($(element).data('posy')+2) +'"]').data('color');
		var prev3 = $('[data-posx="'+ ($(element).data('posx') -3) +'"][data-posy="'+ ($(element).data('posy')+3) +'"]').data('color');

		if(next1 == good_color && next2 == good_color && next3 == good_color
			|| prev1 == good_color && prev2 == good_color && prev3 == good_color
			|| prev1 == good_color && next1 == good_color && next2 == good_color
			|| prev2 == good_color && prev1 == good_color && next1 == good_color)
			{ validation = true; }
		return validation;
	}

	function win_diagonale_antislash(element)
	{
	 	var validation = false;
		var good_color = $('[data-posx="'+ $(element).data('posx') +'"][data-posy="'+ $(element).data('posy') +'"]').data('color');
		var next1 = $('[data-posx="'+ ($(element).data('posx') +1) +'"][data-posy="'+ ($(element).data('posy')+1) +'"]').data('color');
		var next2 = $('[data-posx="'+ ($(element).data('posx') +2) +'"][data-posy="'+ ($(element).data('posy')+2) +'"]').data('color');
		var next3 = $('[data-posx="'+ ($(element).data('posx') +3) +'"][data-posy="'+ ($(element).data('posy')+3) +'"]').data('color');
		var prev1 = $('[data-posx="'+ ($(element).data('posx') -1) +'"][data-posy="'+ ($(element).data('posy')-1) +'"]').data('color');
		var prev2 = $('[data-posx="'+ ($(element).data('posx') -2) +'"][data-posy="'+ ($(element).data('posy')-2) +'"]').data('color');
		var prev3 = $('[data-posx="'+ ($(element).data('posx') -3) +'"][data-posy="'+ ($(element).data('posy')-3) +'"]').data('color');

		if(next1 == good_color && next2 == good_color && next3 == good_color 
			|| prev1 == good_color && prev2 == good_color && prev3 == good_color
			|| prev1 == good_color && next1 == good_color && next2 == good_color
			|| prev2 == good_color && prev1 == good_color && next1 == good_color)
			{ validation = true; }
		return validation;
	}

	function winner_is(element)
	{
		var list_circle = $('[data-played="no"]')
		var val_hor = win_horizontal(element);
		var val_ver = win_vertical(element);
		var val_slash = win_diagonale_slash(element);
		var val_no_slash = win_diagonale_antislash(element);

		if(val_hor == true || val_ver == true || val_slash == true || val_no_slash == true)
		{
			$('.winner_is').css('display', 'block');
			if(who_play %2 == 0)
			{ 
				$('.result').html('BRAVO, le joueur 1 a gagné !!!'); 
				score_player_one += 1;
				$('.score').html('Joueur 1 : '+ score_player_one +' VS '+ score_player_two +' : Joueur 2');
			}

			if(who_play %2 != 0)
			{
				$('.result').html('BRAVO, le joueur 2 a gagné !!!');
				score_player_two += 1;
				$('.score').html('Joueur 1 : '+ score_player_one +' VS '+ score_player_two +' : Joueur 2');
			}
			return false;
		}
		if(list_circle.length == 0)
		{
			$('.winner_is').css('display', 'block');
			$('.result').html("Et... C'est un match nul !!!");
		}
		if($('#IA_yes').is(':checked'))
		{
			if(who_play %2 == 0)
			{
				IA_play(how_grille_x(), how_grille_y());
			}
		}
	}


	/*-----------------------------------------------*\ 
					Création de la grille
	\*-----------------------------------------------*/
	$('#puissance_four').before('<div id="text_affich">----- Au tour du joueur 1-----</div>');
	$('#text_affich').before('<div class="buttons_menu"></div>');
	$('.buttons_menu').append('<button type="button" class="restart">Restart</button>');
	$('.restart').after('<button type="button" class="options">Options</button>');
	$('.options').after('<button type="button" class="annuler">Annuler</button>');
	$('#puissance_four').after('<div class="score"> Joueur 1 : '+ score_player_one +' VS '+ score_player_two +' : Joueur 2 </div>');
	$('.score').css('width', (grille_x *125)+ 'px' );
	$('#text_affich').css('width', (grille_x *125)+ 'px' );
	$('#puissance_four').append("<div class='grille'></div>");
	$('.grille').css('width', (grille_x *125)+ 'px' );

	function play_the_game(grille_x_param, grille_y_param)
	{
		who_play = 1;
		var i = 1;
		var j = 1;
		var k = 0;
		var list_circle = document.getElementsByClassName('circle');

		for(i; i <= grille_y_param; i +=1)
		{
			$('.grille').append('<div class="row" data-posy="' + i +'"></div>');
		}

		for(j; j <= grille_x_param; j +=1)
		{
			$('.row').append('<div class="circle" data-played="no" data-posx="' + j + '"></div>');
		}

		for(k; k < list_circle.length; k +=1)
		{
			$(list_circle[k]).attr('data-posy', $(list_circle[k]).parent().data('posy'));
		}

		$('.circle').click(function(){

			shut_down($(this), grille_y_param);
		});
	}


	/*-----------------------------------------------*\ 
					Bouton des options
	\*-----------------------------------------------*/
	$('.buttons, .buttons_menu').after('<div class="options_game"></div>')
	$('.options_game').append('Nombre de ligne : <div class="choice_options" id="grille_x" contenteditable="true"></div>');
	$('.options_game').append(' Nombre de colonne : <div class="choice_options" id="grille_y" contenteditable="true"></div>');
	$('.options_game').append('Couleur Joueur 1 : <div class="choice_options" id="color_one" contenteditable="true"></div>');
	$('.options_game').append(' Couleur Joueur 2 : <div class="choice_options" id="color_two" contenteditable="true"></div>');
	$('.options_game').append(' Jouer contre une IA  : <div class="choice_options" id="play_vs_IA"></div>');
	$('#play_vs_IA').append('<input type="radio" id="IA_yes" name="VSIA" value="Oui">Oui');
	$('#play_vs_IA').append('<input type="radio"name="VSIA" id="IA_no" value="Non" checked> Non ');
	
	$('.options_game').append('<button type="button" id="ok">Submit</button>');


	/*-----------------------------------------------*\ 
			Création du popin et gestion d'après jeux
	\*-----------------------------------------------*/
	$('body').after('<div class="winner_is"></div>');
	$('.winner_is').append('<div class="modal-content"></div>');
	$('.modal-content').append('<div class="result"></div>');
	$('.result').after('<div class="buttons"></div>');
	$('.buttons').append('<button type="button" class="restart">Restart</button>');


	/*-----------------------------------------------*\ 
			Utilisation des fonctions pour jouer
	\*-----------------------------------------------*/
	play_the_game(grille_x, grille_y);

	$('.restart').click(function(){
		who_play = 1;
		$('.circle_player_one').remove();
		$('.circle_player_two').remove();
		$('.circle').attr('data-played', 'no');
		$('.circle').data('color', 'white');
		$('.circle').removeAttr('style');
		$('.winner_is').css('display', 'none');
	});

	$('.annuler').click(function(){
		who_play -= 1;
		$(last_play).css('background-color', 'white');
		$(last_play).attr('data-played', 'no');
		$(last_play).data('color', 'white');
	});

	$('.options').click(function(){
		if($('.options_game').hasClass('active'))
			{ $('.options_game').css('display', 'none'); }
		else
			{ $('.options_game').css('display', 'block'); }
		$('.options_game').toggleClass('active');
	});

	$('#ok').click(function(){
		$('.grille').remove();
		$('.row').remove();
		$('.circle').remove();
		var grille_x = how_grille_x();
		var grille_y = how_grille_y();
		var player_one = color_player_one();
		var player_two = color_player_two();
		$('#puissance_four').append("<div class='grille'></div>");
		$('.grille').css('width', (grille_x *125)+ 'px' );
		play_the_game(grille_x, grille_y);
	});

	$('.circle').click(function(){
		shut_down($(this), grille_y);
	});
}
})(jQuery);