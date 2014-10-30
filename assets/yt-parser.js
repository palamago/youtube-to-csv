var YT2CSV;

;(function(global, document, $){

    "use strict";

    YT2CSV = global.YT2CSV = global.YT2CSV || {};

    YT2CSV.entries = [];

    YT2CSV.init = function () {
    	$('#send').on('click',function(){
            _gaq.push(['_trackEvent', 'button', 'dale']);
            $('#loader').show();
            $('.csv,.json').hide();
            $.getJSON($('#url').val()+'&fields=@gd:fields,entry(@gd:fields,published,updated, category(@label), title, content, link(@href),author, gd:comments/gd:feedLink(@countHint), media:group/media:content(@duration), media:group/media:thumbnail, gd:rating(@min), gd:rating(@max), gd:rating(@average), gd:rating(@numRaters), yt:statistics(@favoriteCount), yt:statistics(@viewCount))&callback=?',
                function(data){
	    			if(data && data.feed && data.feed.entry) {
		    			YT2CSV.entries = data.feed.entry;
		    			YT2CSV.parse();
	    			}
	    		});

    	});
    };

	YT2CSV.parse = function () {
        var wrap = {'entries':YT2CSV.entries};
        $('.json .editing').val(JSON.stringify(wrap));
        $('.json .editing').trigger('paste');
	};


})(window, document,jQuery);

window.onload = function() {
    YT2CSV.init(); 
}
