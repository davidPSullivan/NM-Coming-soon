(function($) {

	var rand = function(min,max) {
		return Math.floor( Math.random() * max ) + min;
	}

	var matrixToArray = function(str){
	    return str.match(/(-?[0-9\.]+)/g);
	};

	var animateMethod = "transit";
	var easeN = 0.7;
	var count = 125;

	$.fn.setCloud = function(x,y) {
		// return $(this).css({
		// 	left : x,
		// 	top : y
		// });
		if ( x && y ) {

			switch(animateMethod) {
				case "bg":
					return $(this).css({
						"background-position" : x + "px " + y + "px"
					});
				break; 
				case "pos":
					return $(this).css({
						left : x,
						top : y
					});
				break;
				case "transit":
					return $(this).stop().transition({ x : x , y : y }, "cubic-bezier(0,.99,.36,.99)");
					//return $(this).css("transform", "translate(" + x + "px, " + y + "px)");
				break;
			}

		}
	}

	$.fn.updateCloud = function(mx,my) {
		var t = $(this);
		var size = parseInt(t.data("size"));
		
		var oryginalPos = {
			x : parseInt(t.data("x")),
			y : parseInt(t.data("y"))
		}

		var targetPos = {
			x : oryginalPos.x + mx / (8 - size),
			y : oryginalPos.y + my / (8 - size),
		}

		var actualPos = t.getPos();		

		var easedPos = {
			x : actualPos.x + (targetPos.x - actualPos.x) * easeN,
			y : actualPos.y + (targetPos.y - actualPos.y) * easeN,
		}

		t.setCloud(easedPos.x, easedPos.y);
	}

	$.fn.getPos = function(){
		var t = $(this);

		switch(animateMethod) {
			case "bg":
				return {
					x : parseInt( t.css("background-position-x") ),
					y : parseInt( t.css("background-position-y") ),
				}
			break; 
			case "pos":
				return {
					x : parseInt( t.css("left") ),
					y : parseInt( t.css("top") ),
				}
			break;
			case "transit":
				var posArr = matrixToArray( t.css("transform") )
				var pos = {
					x : parseInt(posArr[4]),
					y : parseInt(posArr[5]),
				}				
				return pos;
			break;
		}

	}

	$(window).load(function(){
		
		var win = {
			w : $(window).width(),
			h : $(window).height(),
			cX : $(window).width() / 2,
			cY : $(window).height() / 2
		};

		//fallback
		if ( $("body").hasClass("no-webgl") ) {

			var addCloud = function( size ){
				var perspective = size / 7;
				var pos = {
					x : rand(-win.cX / 2, win.w + win.cX / 2),
					y : rand(win.cY - 100 - 100 * ( 1 - perspective ), win.cY + 200 * perspective)
				}
				var cont = $("<div/>").addClass("cloud-scale").addClass("c-" + size).appendTo(".fallback-clouds");

				var cloud = $("<div/>", { "data-size" : size, "data-x" : pos.x , "data-y" : pos.y }).addClass("cloud").addClass("c-" + size).appendTo(cont);
				cloud.setCloud(pos.x, pos.y);
			}

			var init = function(){

				$(".cloud").remove();
				
				for (var i = 0; i < count; i++) {
					var progress = i / count;

					//generate size (more bigger clouds)

					var size = Math.floor ( (1 - progress*progress*progress) * 7 + 0.99 );
					

					addCloud(size);
				};
			}
			init();

			$(window).resize(function(){
				win = {
					w : $(window).width(),
					h : $(window).height(),
					cX : $(window).width() / 2,
					cY : $(window).height() / 2
				};
				init();
			})


		}

		var m = {
			x : win.cX,
			y : win.cY
		};

		$(window).on("mousemove", function(e){
			m = {
				x : (win.cX - e.pageX) * 0.5,
				y : (win.cY - e.pageY) * 0.2
			};
		});

		if ( animateMethod == "transit" ) {
			$(window).on("mousemove", function(e){
				$(".cloud").each(function(){
					var t = $(this);
					t.updateCloud(m.x,m.y);
				});
			});
		} else {

			redraw = function(){
				$(".cloud").each(function(){
					var t = $(this);
					t.updateCloud(m.x,m.y);
				});
			}

			setInterval(function(){
				redraw();
			},60);

		}

	});

})(jQuery);
