
var thisTilelayer, groupLayers, map, legend;


$(document).ready(function()
{
    // set up map and graph area widths
    var total_map_width = Math.floor($(".wrapper").width() * 0.65);
    var graph_outer_width = Math.floor(total_map_width * 0.35);
    var graph_inner_width = $('.wrapper').width() - graph_outer_width - margin.left - margin.right;

    d3.select(".wrapper").append("div").attr("class", "thismap").attr("id", "map");
    d3.select('.thismap').style('width', total_map_width + 'px');


    /* graph display functions*/
    compressSeriationGraph(total_map_width,graph_outer_width);
    expandSeriationGraph(graph_outer_width,graph_inner_width);

    /* map and dropdown menu initializers */
    initializeMap();
    addLegend();
    populateDropdownWithGenres();

    /* movie display functions */
    drawMoviesByGenre();
    drawMoviesByYear();
    displaySeriationGraphAndMap(total_map_width);

});

window.initializeMap = function(){
    var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    var mapType = 'http://{s}.www.toolserver.org/tiles/bw-mapnik/{z}/{x}/{y}.png';

    thisTilelayer = new L.tileLayer(mapType, { attribution: '&copy; ' + mapLink + ' Contributors', maxZoom: 18 });
    groupLayers = new L.LayerGroup();
    map = new L.map('map').setView( [37.75,-122.43589], 11 );
    thisTilelayer.addTo(map);
}

window.updateHeatMap = function(arr){
    groupLayers.clearLayers();
    var heat = L.heatLayer(arr,{
            radius: 20,
            blur: 50,
            maxZoom: 10,
            gradient: gradientColors()
        });

    groupLayers.addLayer(heat);
    groupLayers.addTo(map);
}

window.compressSeriationGraph = function(total_map_width,graph_outer_width){
    $('.zoom_map').click(function(){
        d3.select('.thismap').transition().duration(4000).style("width", total_map_width+'px');
        updateSeriationChart(margin, width(margin,(graph_outer_width+48)));
    });
}

window.expandSeriationGraph = function(graph_outer_width,graph_inner_width){
    $(".zoom_graph").click(function(){
        d3.select('.thismap').transition().duration(4000).style("width", graph_outer_width + 'px');
        updateSeriationChart(margin, width(margin,graph_inner_width));
    });
}

window.drawMoviesByYear = function(){
    $("div#years > div > a").click(function(){

        if ($(this).attr('id') === 'all'){
            map_data = queryAllMovies(0);
        }
        else if($(this).attr('id') === 'tens'){
            map_data = queryAllMovies(1911);
        }
        else if($(this).attr('id') === 'twenties'){
            map_data = queryAllMovies(1921);
        }
        else if($(this).attr('id') === 'thirties'){
            map_data = queryAllMovies(1931);
        }
        else if($(this).attr('id') === 'forties'){
            map_data = queryAllMovies(1941);
        }
        else if($(this).attr('id') === 'fifties'){
            map_data = queryAllMovies(1951);
        }
        else if($(this).attr('id') === 'sixties'){
            map_data = queryAllMovies(1961);
        }
        else if($(this).attr('id') === 'seventies'){
            map_data = queryAllMovies(1971);
        }
        else if($(this).attr('id') === 'eighties'){
            map_data = queryAllMovies(1981);
        }
        else if($(this).attr('id') === 'nineties'){
            map_data = queryAllMovies(1991);
        }
        else if($(this).attr('id') === 'zeroes'){
            map_data = queryAllMovies(2001);
        }
        else if($(this).attr('id') === 'zerotens'){
            map_data = queryAllMovies(2011);
        }

        updateHeatMap(map_data);

    });
}

window.drawMoviesByGenre = function(){

    $(".dropdowns").change(function()
    {
        var res = $(".dropdowns").val()+"AFI";
        var map_data = queryAllMovies(res);
        updateHeatMap(map_data);
    });
}

window.populateDropdownWithGenres = function(){
    var genres = ["Comedy", "RomanticComedy", "Romance", "Adventure",
                     "Drama", "Mystery", "Fantasy", "SciFi", "ComedyDrama",
                     "Melodrama", "Horror", "FilmNoir"];
    $(".dropdowns").find('option').remove();
    for(i = 0; i < genres.length; i++){
        $(".dropdowns").append('<option value="'+genres[i]+'">'+genres[i]+'</option>');
    }
}

window.queryAllMovies = function(genre, beginning_year){
    var result = [];
    var maximum_year = 0;

    for (var i = 0; i < AFIPoints.length; i++){
        var arr = AFIPoints[i];

        if(arguments.length === 1){
            if (typeof arguments[0] === 'number') {
                years = yearRange(arguments[0],genre);

                if (arr[4] >= years[0] && arr[4] <= years[1]){
                    result.push(arr);
                }
            }
            else if (typeof arguments[0] === 'string'){
                genre = arguments[0];
                var matching_arry = titles_by_index()[genre];
                if(arr[matching_arry] === genre){
                    result.push(arr);
                }
            }
        }else if (arguments.length == 2){
            genre = arguments[0];
            years = yearRange(arguments[1],beginning_year);
            var matching_arry = titles_by_index()[genre];
            if(arr[matching_arry] === genre && (arr[4] >= years[0] && arr[4] <= years[1] )){
                result.push(arr);
            }
        }
    }
    return result;
}

window.yearRange = function(arg,input){
    result = [];
    beginning = 1911;
    if (arg === 0){
        result.push(beginning,beginning+200);
    }else{
        result.push(input,input+10);
    }
    return result;
}

window.addLegend = function(){
    legend = L.control ({position: 'bottomleft' });
    legend.onAdd = function(map){
        var  div2 = L.DomUtil.create ( 'div' , 'info legend' );
        div2.innerHTML = '<p>' + "Density" + '</p>';
        grades = [1, 0.8, 0.7, 0.6, 0.5], labels = ["high","","med","","low"];
 
        for (var i = 0; i < grades.length; i++) {
            div2.innerHTML += '<i style="background:' + gradientColors()[grades[i]] + '"></i> ' + labels[i]+'<br>';
        }
      return  div2;
    };
   legend.addTo (map);
}
