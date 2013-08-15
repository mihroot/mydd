(function( $ ) {
	
	var oDDCount = 0; //opened drop downs count
	
	var opts = {
		txt_nonSelected: 'Select page',
		slide: false,
		onchange: null
	};
	
	
	// Plugin definition.
	$.fn.mydd = function( options ) {

		opts = $.extend( {}, opts, options );
		

	 	
		return this.each(function() {
			
			var $mydd = $(this);	
			
			
			var inputName = $mydd.attr('data-name');
			if(!inputName) {
				inputName = '';
			}
			

			var $hiddenInput = $('<input class="mydd-hidden-input" type="hidden" value="" name="'+inputName+'" />').insertBefore($mydd);
			
			//a bit of magic :)
			$mydd.addClass('widget-mydd').wrapInner('<li><ul class="mydd-items-list"></ul></li>');
			
			//save list object
			var $mydd_il = $('.mydd-items-list', this);
			$mydd_il.hide();
			
			
			
			//
			var $selected; var itemsCount = $('li', $mydd_il).length;
			if(itemsCount <= 1) {
				if(itemsCount) {
					$selected = $('li', $mydd_il);
				}
				$mydd.addClass('disabled');
			} else {
				$selected = $('.selected:first', $mydd_il);
				if(!$selected.length) {
					$selected = $('li:first', $mydd_il);
				}
			}
		
			
			
			$mydd.children('li').prepend('<div class="mydd-current-choice">'+($selected.length?$selected.html():'')+'<i class="mydd-showlist-icon icon-chevron-down"></i></div>');
			
			if($selected.length) {
				selectItem($mydd, $selected, $hiddenInput);
			}
			
			if(itemsCount <= 1) {
				return;
			}
			
			
			
			
			
			////////////////////
			$('.mydd-current-choice', $mydd).click(function(e) {
				if($mydd.hasClass('active')) {
					close_dd($mydd, $mydd_il);
				} else {
					open_dd($mydd, $mydd_il);
				}
            });
			
			
			////////////////////
			$('.mydd-items-list li', $mydd).click(function(e) {
				
				if($(this).hasClass('selected')) {
					close_dd($mydd, $mydd_il);
					return false;
				}
				
				$mydd.find('.mydd-current-choice').html($(this).html()+'<i class="mydd-showlist-icon icon-chevron-down"></i>');
							
				//saveID.call(this);
				selectItem($mydd, $(this), $hiddenInput);
				
				close_dd($mydd, $mydd_il);
				
            }).mouseenter(function(e) {
				$(this).addClass('hover');
			}).mouseleave(function(e) {
				$(this).removeClass('hover');
			});
		});
	
	};
 
	
	
	
	//Private: 
	function bind() {
		$(window).bind('click.checkNonMyDDClick', function(e) {
			if($(e.target).parents('.widget-mydd').length <= 0) {
				$.each($('.widget-mydd.active'), function(i, v) {					
					close_dd($(this), $('.mydd-items-list', this));
				});
			}
		});
	}
	
	
	//Private: 
	function unbind() {
		$(window).unbind('click.checkNonMyDDClick');
	}
	
	
	
	
	//Private: 
	function open_dd($mydd, $mydd_il) {
		if($mydd.hasClass('active')) {
			return false;
		}	
		
		
		$mydd.addClass('active');
		if(opts.slide) {
			$mydd_il.slideDown('fast');
		} else {
			$mydd_il.show();
		}
		
		$('.mydd-showlist-icon', $mydd).removeClass('icon-chevron-down').addClass('icon-chevron-up');
		

		oDDCount++;
		if(oDDCount == 1) {
			bind();
		}	
	}
	
	
	
	
	//Private: 
	function close_dd($mydd, $mydd_il) {
		if(!$mydd.hasClass('active')) {
			return false;
		}
		
		$('.mydd-showlist-icon', $mydd).removeClass('icon-chevron-up').addClass('icon-chevron-down');
		if(opts.slide) {
			$mydd_il.slideUp('fast', function() {
				$mydd.removeClass('active');
			});
		} else {
			$mydd.removeClass('active');
			$mydd_il.hide();
		}
		
		oDDCount--;
		if(oDDCount == 0) {
			unbind();
		}
	}
	
	
	
	//Private: 
	function selectItem($mydd, $item, $hiddenInput) {
		
		$('.selected', $mydd).removeClass('selected');
		$item.addClass('selected');
				
		var data_id = $item.attr('data-id');
		if(!data_id) data_id = '';
		
		$hiddenInput.val(data_id);
		if(opts.onchange) {
			opts.onchange.call($item[0], data_id);
		}
	}

	
}( jQuery ));