var YT2CSV;

;(function(global, document, $){

    "use strict";

    YT2CSV = global.YT2CSV = global.YT2CSV || {};

    YT2CSV.entries = [];

    YT2CSV.endpoint = "http://gdata.youtube.com/feeds/api/videos?alt=json-in-script";

    YT2CSV.extraParams = '&strict=false&v=2&fields=@gd:fields,entry(@gd:fields,published,updated, category(@label), title, content, link(@href),author, gd:comments/gd:feedLink(@countHint), media:group/media:content(@duration), media:group/media:thumbnail, gd:rating(@min), gd:rating(@max), gd:rating(@average), gd:rating(@numRaters), yt:statistics(@favoriteCount), yt:statistics(@viewCount))&callback=?';

    YT2CSV.init = function () {
    	$('#send').on('click',function(){
            if($("#q").val()==''){
                alert('Complete el texto que desea buscar');
                return;
            }

            _gaq.push(['_trackEvent', 'button', 'dale']);

            $('#loader').modal({backdrop:false,keyboard:false});
            $('.csv,.json').hide();

            YT2CSV.entries = [];
            
            var requested = $('#requested-records').val();
            requested = (requested == "" || isNaN(requested))?100:parseInt(requested);
            $('#requested-records').val(requested);

            var initial = $('#requested-initial').val();
            initial = (initial == "" || isNaN(initial))?1:parseInt(initial);
            $('#requested-initial').val(initial);

            YT2CSV.call(requested,initial);
            $('#req-records').html(requested);
    	});
    };

    YT2CSV.call = function(requested,start,per_page){
        start = (start)?start:1;
        per_page = (per_page)?per_page:50;

        var query = YT2CSV.endpoint+'&'+$("#filters input[value!=''], #filters select:has(option[value!='']:selected)").serialize()+'&max-results='+per_page+'&start-index='+start+YT2CSV.extraParams;

        $('#current-record').html(YT2CSV.entries.length);

        $.getJSON(query,
            function(data){
                if(data && data.feed && data.feed.entry) {
                    YT2CSV.entries = YT2CSV.entries.concat(data.feed.entry);
                    console.log(YT2CSV.entries.length,requested);
                    if(YT2CSV.entries.length >= requested){
                        YT2CSV.parse();
                    } else {
                        YT2CSV.call(requested,start+per_page,per_page);
                    }
                }
            }).error(function(error) { console.log(error); YT2CSV.parse(); });
    };

	YT2CSV.parse = function () {
        var wrap = {'entries':YT2CSV.entries};
        $('.json .editing').val(JSON.stringify(wrap));
        $('.json .editing').trigger('paste');
	};


})(window, document,jQuery);

window.onload = function() {
    //$('#loader').modal();
    YT2CSV.init(); 
}
