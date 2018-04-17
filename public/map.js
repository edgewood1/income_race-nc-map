(function () {

    // 1. h x w of canvas

    var height = 550,
        width = 1450,
        
    // 2. get unique id - 

    // 2.5create getPaths with projections  // used in geoID? 
    projection = d3.geoMercator(),
    mexico = void 0;

    var geoID = function (d) {
        return "c" + d.properties.GEOID;
    };

    // 3. On click, get ID - (add opacity?)
    var click = function (d) {
        d3.selectAll('path').attr('fill-opacity', 0.2)
        d3.select('#' + geoID(d)).attr('fill-opacity', 1);
    };

    // 4. projections: convert long/lat to x/y

    var path = d3.geoPath().projection(projection);
    
    // 5. create drawing board svg
    var svg = d3.select("#map")
        // .classed("svg-container", true) //container class to make it responsive

        .append("svg")
        // .attr("width", width)
        // .attr("height", height)
      
        // responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 1400 600")
        //class to make it responsive
        .classed("svg-content-responsive", true);

    var box = svg.append('text')
        .attr('id', 'place')
        .attr('x', 2)
        .attr('y', 2)
        .attr("width", 250)
        .attr("height", 50);

    // 6. transform topoJson into json: objects > admin > geometries array 
    d3.json('nc_counties.json', function (error, data) {
        if (error) return;
        console.log('mexico', data);
        // states = an array of geojson objcts: type, properties, arcs
        var states = topojson.feature(data, data.objects.north_carolina1);

        // 6. v. sert / reset scale and translate
        var b, s, t;
        projection.scale(1).translate([0, 0]);
        var b = path.bounds(states); 
        // //w
        var s = .85 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
        // // x 
        var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
        // //y
        projection.scale(s).translate(t);
        //z
        var map = svg.append('g').attr('class', 'boundary');
        //zz
        mexico = map.selectAll('path').data(states.features);
        //Update
        var color = d3.scaleLinear().domain([0, 33]).range(['red', 'yellow']);
        //7. Enter
        mexico.enter()
            .append('path')
            .attr('d', path)
            .attr('id', geoID)
            .on("click", jack)
            .attr('fill', function (d, i) { return color(i); })
        //Update
        mexico.attr('fill', '#eee');
        //Exit
        mexico.exit().remove();
        var number;
        var white;
        var black;
        var ration;
        
        // calculates data for the top-right table
        function jack(d) {
            var z = d.properties.GEOID;
            d3.queue()
                .defer(d3.csv, 'income.csv')
                .defer(d3.csv, 'ethnicity.csv')
                .await(function(error, d1, d2) {
                    console.log(d1);         
                    d1.forEach(function (element, item) {
                        if (z == element['GEO.id2']) {
                            csvID = element['GEO.id2']
                            number = element.HC01_EST_VC15
                        }
                    })
                    d2.forEach(function (element, item) {
                        if (z == element['GEO.id2']) {
                            white = parseInt(element.HD01_VD02);
                            black = parseInt(element.HD01_VD03);
                            ration = Math.round(black / (black +white )*100);
                        }
                        console.log(black);
                    })
                    console.log(ration);
                    
                    // add data to the table - 

                    d3.select("#place")
                        .text("Mean Household Income:  " + number + " Black Percentage: " + ration + " %") 
                        .attr('dx', '195')
                        .attr('dy', '40')
              
                        .attr('class', 'text3')
                        .attr('font-size', '20px')
                 
                     
                
                });
            // //   end pt.2
        };

        // get and add county names - 
        var cityText = svg.selectAll('text')
            .data(states.features);

        cityText.enter()
        	.append('text')
          	.text(function (d) {
            	return d.properties.NAME;
          	})
          	.attr("transform", function (d) { 
          		return "translate(" + path.centroid(d) + ")"; 
          	})
          	.attr("dx", function (d) { 
          		return d.properties.dx || "0"; 
          	})
          	.attr("dy", function (d) { 
          		return d.properties.dy || "0.35em"; 
          	})
    });
})();