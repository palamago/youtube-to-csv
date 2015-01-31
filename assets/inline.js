  var excerptRows = 7;
  var input;
  var url;
  var lastSaved;


  // function log(msg) {
  //   return $(".console").removeClass("error").html(msg);
  // }

  // function error(msg) {
  //   return log(msg).addClass("error");
  // }

  
  function doJSON() {
    // just in case
    $(".drop").hide();

    // get input JSON, try to parse it
    var newInput = $(".json textarea").val();
    if (newInput == input) return;

    input = newInput;
    if (!input) {
      // wipe the rendered version too
      $(".json code").html("");
      return;
    }

    console.log("ordered to parse JSON...");

    var json = jsonFrom(input);

    // if succeeded, prettify and highlight it
    // highlight shows when textarea loses focus
    if (json) {
      //var pretty = JSON.stringify(json, undefined, 2);
      //$(".json code").html(pretty);
      //hljs.highlightBlock($(".json code").get(0));
    } else
      $(".json code").html("");

    // convert to CSV, make available
    doCSV(json);

    return true;
  }

  // show rendered JSON
  function showJSON(rendered) {
    //$('#loader').hide();
    $('#loader').modal('hide');
    $('.csv').show();
    $('html, body').animate({
        scrollTop: $("#resultado").offset().top
    }, 1000);
    console.log("ordered to show JSON: " + rendered);
    if (rendered) {
      if ($(".json code").html()) {
        console.log("there's code to show, showing...");
        $(".json .rendered").show();
        $(".json .editing").hide();
        $('#loader').hide();
        $('.csv,.json').show();
      }
    } else {
      $(".json .rendered").hide();
      $(".json .editing").show().focus();
    }
  }

  function showCSV(rendered) {
    if (rendered) {
      if ($(".csv table").html()) {
        $(".csv .rendered").show();
        $(".csv .editing").hide();
      }
    } else {
      $(".csv .rendered").hide();
      $(".csv .editing").show().focus();
    }
  }

  // takes an array of flat JSON objects, converts them to arrays
  // renders them into a small table as an example
  

  function renderCSV(objects) {
    
    function harcodedReplace(field){
    
    return field.replace("published/$t","Publicado")
    .replace("updated/$t","Actualizado")
    .replace("category/1/label","Categoria")
    .replace("title/$t","Título")
    .replace("content/$t","Descripción")
    .replace("link/1/href","URL")
    .replace("author/0/name/$t","Autor")
    .replace("author/0/uri/$t","Autor URL")
    .replace("gd$comments/gd$feedLink/countHint","Cantidad de comentarios")
    .replace("media$group/media$content/0/duration","Duración (en segundos)")
    .replace("media$group/media$thumbnail/0/url","Miniatura 1")
    .replace("media$group/media$thumbnail/1/url","Miniatura 2")
    .replace("media$group/media$thumbnail/2/url","Miniatura 3")
    .replace("media$group/media$thumbnail/3/url","Miniatura 4")
    .replace("media$group/media$thumbnail/0/height","Alto Miniatura 1")
    .replace("media$group/media$thumbnail/1/height","Alto Miniatura 2")
    .replace("media$group/media$thumbnail/2/height","Alto Miniatura 3")
    .replace("media$group/media$thumbnail/3/height","Alto Miniatura 4")
    .replace("media$group/media$thumbnail/0/width","Ancho Miniatura 1")
    .replace("media$group/media$thumbnail/1/width","Ancho Miniatura 2")
    .replace("media$group/media$thumbnail/2/width","Ancho Miniatura 3")
    .replace("media$group/media$thumbnail/3/width","Ancho Miniatura 4")
    .replace("media$group/media$thumbnail/0/time","Tiempo Miniatura 1")
    .replace("media$group/media$thumbnail/1/time","Tiempo Miniatura 2")
    .replace("media$group/media$thumbnail/2/time","Tiempo Miniatura 3")
    .replace("media$group/media$thumbnail/3/time","Tiempo Miniatura 4")
    .replace("gd$rating/average","Rating (promedio)")
    .replace("gd$rating/max","Rating (máx)")
    .replace("gd$rating/min","Rating (min)")
    .replace("gd$rating/numRaters","Cantidad de votantes")
    .replace("yt$statistics/favoriteCount","Cantidad de Favoritos")
    .replace("yt$statistics/viewCount","Cantidad de Vistas");
  }
  
    var rows = $.csv.fromObjects(objects, {justArrays: true});
    if (rows.length < 1) return;

    // find CSV table
    var table = $(".csv table")[0];
    $(table).html("");

    // render header row
    var thead = document.createElement("thead");
    var tr = document.createElement("tr");
    var header = rows[0];
    for (field in header) {
      var th = document.createElement("th");
      $(th).html(harcodedReplace(header[field]))
      tr.appendChild(th);
    }
    thead.appendChild(tr);

    // render body of table
    var tbody = document.createElement("tbody");
    for (var i=1; i<rows.length; i++) {
      tr = document.createElement("tr");
      for (field in rows[i]) {
        var td = document.createElement("td");
        $(td)
          .html(rows[i][field])
          .attr("title", rows[i][field]);
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }

    table.appendChild(thead);
    table.appendChild(tbody);
  }

  function doCSV(json) {

    // 1) find the primary array to iterate over
    // 2) for each item in that array, recursively flatten it into a tabular object
    // 3) turn that tabular object into a CSV row using jquery-csv
    var inArray = arrayFrom(json);

    var outArray = [];
    for (var row in inArray)
        outArray[outArray.length] = parse_object(inArray[row]);

    $("span.rows.count").text("" + outArray.length);

    var csv = $.csv.fromObjects(outArray);
    // excerpt and render first 10 rows
    renderCSV(outArray.slice(0, excerptRows));
    showCSV(true);

    // show raw data if people really want it
    $(".csv textarea").val(csv);

    // download link to entire CSV as data
    // thanks to http://jsfiddle.net/terryyounghk/KPEGU/
    // and http://stackoverflow.com/questions/14964035/how-to-export-javascript-array-info-to-csv-on-client-side
    var uri = "data:text/csv;charset=utf-8," + encodeURIComponent(csv.replace("published/$t","Publicado")
    .replace("updated/$t","Actualizado")
    .replace("category/1/label","Categoria")
    .replace("title/$t","Título")
    .replace("content/$t","Descripción")
    .replace("link/1/href","URL")
    .replace("author/0/name/$t","Autor")
    .replace("author/0/uri/$t","Autor URL")
    .replace("gd$comments/gd$feedLink/countHint","Cantidad de comentarios")
    .replace("media$group/media$content/0/duration","Duración (en segundos)")
    .replace("media$group/media$thumbnail/0/url","Miniatura 1")
    .replace("media$group/media$thumbnail/1/url","Miniatura 2")
    .replace("media$group/media$thumbnail/2/url","Miniatura 3")
    .replace("media$group/media$thumbnail/3/url","Miniatura 4")
    .replace("media$group/media$thumbnail/0/height","Alto Miniatura 1")
    .replace("media$group/media$thumbnail/1/height","Alto Miniatura 2")
    .replace("media$group/media$thumbnail/2/height","Alto Miniatura 3")
    .replace("media$group/media$thumbnail/3/height","Alto Miniatura 4")
    .replace("media$group/media$thumbnail/0/width","Ancho Miniatura 1")
    .replace("media$group/media$thumbnail/1/width","Ancho Miniatura 2")
    .replace("media$group/media$thumbnail/2/width","Ancho Miniatura 3")
    .replace("media$group/media$thumbnail/3/width","Ancho Miniatura 4")
    .replace("media$group/media$thumbnail/0/time","Tiempo Miniatura 1")
    .replace("media$group/media$thumbnail/1/time","Tiempo Miniatura 2")
    .replace("media$group/media$thumbnail/2/time","Tiempo Miniatura 3")
    .replace("media$group/media$thumbnail/3/time","Tiempo Miniatura 4")
    .replace("gd$rating/average","Rating (promedio)")
    .replace("gd$rating/max","Rating (máx)")
    .replace("gd$rating/min","Rating (min)")
    .replace("gd$rating/numRaters","Cantidad de votantes")
    .replace("yt$statistics/favoriteCount","Cantidad de Favoritos")
    .replace("yt$statistics/viewCount","Cantidad de Vistas"));
    $(".csv a.download").attr("href", uri);
  }

  // loads original pasted JSON from textarea, saves to anonymous gist
  // rate-limiting means this could easily fail with a 403.
  function saveJSON() {
    if (!input) return false;
    if (input == lastSaved) return false;

    _gaq.push(['_trackEvent', 'button', 'save']);

    // save a permalink to an anonymous gist
    var gist = {
      description: "test",
      public: true,
      files: {
        "source.json": {
            "content": input
        }
      }
    };

    // TODO: show spinner/msg while this happens

    console.log("Saving to an anonymous gist...");
    $.post(
      'https://api.github.com/gists',
      JSON.stringify(gist)
    ).done(function(data, status, xhr) {

      // take new Gist id, make permalink
      setPermalink(data.id);

      // mark what we last saved
      lastSaved = input;

      console.log("Remaining this hour: " + xhr.getResponseHeader("X-RateLimit-Remaining"));

    }).fail(function(xhr, status, errorThrown) {
      console.log(xhr);
      // TODO: gracefully handle rate limit errors
      // if (status == 403)

      // TODO: show when saving will be available
      // e.g. "try again in 5 minutes"
      // var reset = xhr.getResponseHeader("X-RateLimit-Reset");
      // var date = new Date();
      // date.setTime(parseInt(reset) * 1000);
      // use http://momentjs.com/ to say "in _ minutes"

    });

    return false;
  }

  // given a valid gist ID, set the permalink to use it
  function setPermalink(id) {
    if (history && history.pushState)
      history.pushState({id: id}, null, "?id=" + id);

    // log("Permalink created! (Copy from the location bar.)")
  }

  // check query string for gist ID
  function loadPermalink() {
    var id = getParam("id");
    if (!id) return;

    $.get('https://api.github.com/gists/' + id,
      function(data, status, xhr) {
        console.log("Remaining this hour: " + xhr.getResponseHeader("X-RateLimit-Remaining"));

        var input = data.files["source.json"].content;
        $(".json textarea").val(input);
        doJSON();
        showJSON(true);
      }
    ).fail(function(xhr, status, errorThrown) {
      console.log("Error fetching anonymous gist!");
      console.log(xhr);
      console.log(status);
      console.log(errorThrown);
    });
  }

  $(function() {

    $(".json textarea").blur(function() {showJSON(true);});
    $(".json pre").click(function() {showJSON(false)});
    $(".csv textarea").blur(function() {showCSV(true);})
    $(".csv .raw").click(function() {
      showCSV(false);
      $(".csv textarea").focus().select();
      return false;
    })

    // if there's no CSV to download, don't download anything
    $(".csv a.download").click(function() {
      _gaq.push(['_trackEvent', 'button', 'csv']);
      return !!$(".csv textarea").val();
    });

    $(".save a").click(saveJSON);

    // transform the JSON whenever it's pasted/edited
    $(".json textarea")
      .on('paste', function() {
        // delay the showing so the paste is pasted by then
        setTimeout(function() {
          doJSON();
          $(".json textarea").blur();
        }, 1);
      })
      .keyup(doJSON); // harmless to repeat doJSON

    // go away
    $("body").click(function() {
      $(".drop").hide();
    });

    $(document)
      .on("dragenter", function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(".drop").show();
      })
      .on("dragover", function(e) {
        e.preventDefault();
        e.stopPropagation();
      })
      .on("dragend", function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(".drop").hide();
      })
      .on("drop", function(e) {
        $(".drop").hide();

        if (e.originalEvent.dataTransfer) {
          if (e.originalEvent.dataTransfer.files.length) {
            e.preventDefault();
            e.stopPropagation();

            var reader = new FileReader();

            reader.onload = function(ev) {
              console.log(ev.target.result);
              $(".json textarea").val(ev.target.result);

              setTimeout(function() {
                doJSON();
                $(".json textarea").blur();
              }, 1);
            }

            reader.readAsText(e.originalEvent.dataTransfer.files[0]);
          }
        }
      });

    // highlight CSV on click
    $(".csv textarea").click(function() {$(this).focus().select();});

    loadPermalink();
  });
