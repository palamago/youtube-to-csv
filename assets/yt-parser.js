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
            $.getJSON($('#url').val()+'&callback=?',
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