var height = function(margin){
    return $(".thismap").height() - margin.top - margin.bottom;
}

var width = function(margin,map_width) {
    return $('.wrapper').width() - map_width - margin.left - margin.right;
}

gradientColors = function(){
    return {  0.50: "rgb(0,0,255)", 0.60: "rgb(0,255,255)", 0.70: "rgb(0,255,0)", 0.80: "yellow", 1.0: "rgb(255,0,0)" };
}

titles_by_index = function()
{   return {
        "ComedyAFI": 5,
        "RomanticComedyAFI": 6,
        "RomanceAFI": 7,
        "AdventureAFI": 8,
        "DramaAFI": 9,
        "MysteryAFI": 10,
        "FantasyAFI": 11,
        "SciFiAFI": 12,
        "ComedyDramaAFI": 13,
        "MelodramaAFI": 14,
        "HorrorAFI": 15,
        "FilmNoirAFI": 16
    }
}

var margin = { top: 15, right: 0, bottom: 5, left: 80 };

var domainAFI = ["ComedyAFI", "RomanticComedyAFI", "RomanceAFI", "AdventureAFI",
                "DramaAFI", "MysteryAFI", "FantasyAFI", "SciFiAFI", "ComedyDramaAFI",
                "MelodramaAFI", "HorrorAFI", "FilmNoirAFI"];

window.summarizeSeriationDataByYear = function(movie_seriation_array)
{
    var objs = {};

    for (var i = 0; i < movie_seriation_array.length; i++){

        var obj = movie_seriation_array[i];
        var year = obj.Year;

        reminder = (year - 1911) % 10;
        minYear = year - reminder;
        maxYear = minYear + 10;

        if (year >= minYear && year <= maxYear)
        {
            var range = minYear.toString() + "-" + maxYear.toString();

            if (!(range in objs)){
                objs[range] = {
                    'ComedyAFI': 0,
                    'RomanticComedyAFI': 0,
                    'RomanceAFI': 0,
                    'AdventureAFI': 0,
                    'DramaAFI': 0,
                    'MysteryAFI': 0,
                    'FantasyAFI': 0,
                    'SciFiAFI': 0,
                    'ComedyDramaAFI': 0,
                    'MelodramaAFI': 0,
                    'HorrorAFI': 0,
                    'FilmNoirAFI': 0,
                    'total': 0,
                    'year': 0
                }
            }

            objs[range].ComedyAFI += parseInt(obj.ComedyAFI);
            objs[range].RomanticComedyAFI += parseInt(obj.RomanticComedyAFI);
            objs[range].RomanceAFI += parseInt(obj.RomanceAFI);
            objs[range].AdventureAFI += parseInt(obj.AdventureAFI);
            objs[range].DramaAFI += parseInt(obj.DramaAFI);
            objs[range].MysteryAFI += parseInt(obj.MysteryAFI);
            objs[range].FantasyAFI += parseInt(obj.FantasyAFI);
            objs[range].SciFiAFI += parseInt(obj.SciFiAFI);
            objs[range].ComedyDramaAFI += parseInt(obj.ComedyDramaAFI);
            objs[range].MelodramaAFI += parseInt(obj.MelodramaAFI);
            objs[range].HorrorAFI += parseInt(obj.HorrorAFI);
            objs[range].FilmNoirAFI += parseInt(obj.FilmNoirAFI);


            var tots =  parseInt(obj.ComedyAFI) + parseInt(obj.RomanticComedyAFI) +
                        parseInt(obj.RomanceAFI) + parseInt(obj.AdventureAFI) +
                        parseInt(obj.DramaAFI) + parseInt(obj.MysteryAFI) +
                        parseInt(obj.FantasyAFI) + parseInt(obj.SciFiAFI) +
                        parseInt(obj.ComedyDramaAFI) + parseInt(obj.MelodramaAFI) +
                        parseInt(obj.HorrorAFI) + parseInt(obj.FilmNoirAFI);

            objs[range].total += tots;
            objs[range].year = Math.floor((minYear+maxYear)/2);
        }
    }
    return objs;
};

window.calculateDataForSeriationGraph = function(movie_seriation_array){

    var results = [];

    objs = summarizeSeriationDataByYear(movie_seriation_array);
    for (key in objs){

        var values = objs[key];

        for (secondKeys in values){

            var newObj = {};
            newObj['rangeYear'] = key;
            newObj['year'] = values.year;

            var w = newObj['rangeYear'].split("-");

            newObj['minyear'] = w[0];
            newObj['maxyear'] = w[1];
            newObj['name'] = secondKeys;

            newObj['value'] = values[secondKeys];
            newObj["percent"] = Math.floor(values[secondKeys] / values.total * 100.0);

            if(secondKeys != 'total' && newObj['name'] != "year"){
                results.push(newObj);
            }
        }
    }
    return results;
};



window.displaySeriationGraphAndMap = function(_current_map_width){

    var div = d3.select("html").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

    var data = calculateDataForSeriationGraph(movie_seriation_dataAFI);

    var cValue = function(d) { return d.name; }, color = d3.scale.category10();

    var x = d3.scale.ordinal()
        .domain(domainAFI)
        .rangeRoundBands([30, width(margin, _current_map_width)], 0.0);


    var y = d3.scale.linear()
        .domain([1905, 2020])
        .range([height(margin), 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(-height(margin), 0, 0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(10, "Y")
        .orient("left");

    var chart = d3.select(".wrapper").append("svg")
        .attr("width",  width(margin, _current_map_width) + margin.left + margin.right)
        .attr("height", height(margin) + margin.top + margin.bottom)
        .attr("class", "chart")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        chart.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + 0 + "," + height(margin) + ")")
            .call(xAxis);


        chart.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("dy", "0.71em")
            .style("text-anchor", "middle")
            .attr("x", 0 - height(margin)/2)
            .attr("y", 0 - margin.left/1.5)
            .text("Year");

        chart.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", function(d) { return d.percent/4; })
            .attr("cx", function(d) { return x(d.name); })
            .attr("cy", function(d) { return y(d.year); })
            .attr("fill", function(d) { return color(cValue(d));})
            .on("mouseover", function(d) {
                div .transition()
                    .duration(200)
                    .style("opacity", .85);
                div .html(htmlElement(d))
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 58) + "px");

                    updateHeatMap(queryAllMovies(d.name, parseInt(d.minyear)));

                })
            .on("mouseout", function(d) {
                div.transition().duration(500).style("opacity", 0);
            });

};

window.htmlElement = function(d){
    return "<p class='testclass'>" + d.name + "</p>" +
        "<table class='tiptable'>" + "<tbody" +
        "<tr>" + "<td>" + "Years:" + "</td>" + "<td>" + d.rangeYear + "</td>" + "</tr>" +
        "<tr>" + "<td>" + "Frequency: " + "</td>" + "<td>" + d.percent + "%" + "</td>" + "</tr>" +
        "<tr>" + "<td>" + "Total Titles: " + "</td>" + "<td>" + d.value  + "</td>" + "</tr>" +
        "</tbody" + "</table>"
}

window.updateSeriationChart = function(margin,graphs_width){

    var x = d3.scale.ordinal()
        .domain(domainAFI)
        .rangeRoundBands([30, width(margin,graphs_width)], 0.0);

    var xAxis = d3.svg.axis()
        .scale(x)
        .tickSize(-height(margin), 0, 0)
        .orient("bottom");

    d3.select('svg.chart').transition().duration(4000)
        .attr("width",  function(d) { return (width(margin, graphs_width) + margin.left + margin.right); });

    d3.select("g.x.axis")
        .transition()
        .duration(4000)
        .call(xAxis);

    d3.selectAll(".dot").transition().duration(4000).attr("cx", function(d) { return x(d.name); });

};

























