var YT2CSV;

;(function(global, document, $){

    "use strict";

    YT2CSV = global.YT2CSV = global.YT2CSV || {};

    YT2CSV.entries = [];

    YT2CSV.key = 'AIzaSyDiQiIcGfOe5EZCkwCA8npAHtvQxRe78-A';

    YT2CSV.endpointList = "https://www.googleapis.com/youtube/v3/search?part=id,snippet";
    YT2CSV.endpointDetails = "https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics";

    YT2CSV.extraParamsList = '&key='+YT2CSV.key+'&type=video&maxResults=50&callback=?';
    YT2CSV.extraParamsDetails = '&key='+YT2CSV.key+'&callback=?';

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

            YT2CSV.callList(requested,'');
            $('.req-records').html(requested);
    	});
    };

    YT2CSV.callList = function(requested,pageToken){

        var query = YT2CSV.endpointList+'&pageToken='+pageToken+'&q='+$("#q").val()+YT2CSV.extraParamsList;

        $.getJSON(query,
            function(data){
                //console.log(data);
                if(data && data.items && data.items.length) {
                    //console.log(data.items[0]);
                    $('#thumb').attr('src',data.items[0].snippet.thumbnails.default.url);
                    YT2CSV.entries = YT2CSV.entries.concat(data.items);
                    $('#current-record').html(YT2CSV.entries.length);
                    //console.log(YT2CSV.entries.length,requested);
                    if(YT2CSV.entries.length >= requested || data.items.length < 50){
                        YT2CSV.callDetails(requested);
                    } else {
                        YT2CSV.callList(requested,data.nextPageToken);
                    }
                }
            }).error(function(error) { console.log(error); YT2CSV.parse(); });
    };

    YT2CSV.callDetails = function (requested) {
        var chunks = _.chunk(YT2CSV.entries, 50);
        YT2CSV.entries = []
        _.forEach(chunks,function(c){
            var ids = _.reduce(c, function(list, obj) {
                  list.push(obj.id.videoId);
                  return list;
                }, []);
            var query = YT2CSV.endpointDetails+'&id='+ids.join(',')+YT2CSV.extraParamsList;
            $.getJSON(query,
                function(data){
                    YT2CSV.entries = YT2CSV.entries.concat(data.items);
                    $('#current-record-details').html(YT2CSV.entries.length);
                    if(YT2CSV.entries.length >= requested || data.items.length < 50){
                        YT2CSV.parse();
                        $('#thumb').attr('src','http://www.acupuncture-atlanta.com/images/acupuncture-atlanta-youtube-icon2.png');
                    }
                });

        });
    };

	YT2CSV.parse = function () {
        var wrap = {'entries':_.map(YT2CSV.entries,function(item){
            return {
                id: item.id,
                date: item.snippet.publishedAt,
                title: item.snippet.title,
                description: item.snippet.description,
                duration: item.contentDetails.duration,
                dimension: item.contentDetails.dimension,
                definition: item.contentDetails.definition,
                caption: item.contentDetails.caption,
                channel: item.snippet.channelTitle,
                viewCount: item.statistics.viewCount,
                likeCount: item.statistics.likeCount,
                dislikeCount: item.statistics.dislikeCount,
                favoriteCount: item.statistics.favoriteCount,
                commentCount: item.statistics.commentCount
            }
        })};
        $('.json .editing').val(JSON.stringify(wrap));
        $('.json .editing').trigger('paste');
	};


})(window, document,jQuery);

window.onload = function() {
    //$('#loader').modal();
    YT2CSV.init(); 
}
