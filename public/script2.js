    (function () {

      var height = 900,
        width = 1700,
        // 2. This translates long/lat to x/y
        projection = d3.geoMercator(),
        mexico = void 0;

      /// intereactivity - get unique id - 

      var geoID = function (d) {
        return "c" + d.properties.GEOID;
      };

      //On click, change all states to opacity .2, then gets specific geoID and gives it a greater opacity. 

      var click = function (d) {
        d3.selectAll('path').attr('fill-opacity', 0.2)
        d3.select('#' + geoID(d)).attr('fill-opacity', 1);
      };

      // 3. geoPath maps geoData into SVG paths 
      var path = d3.geoPath().projection(projection);
      // 4. create drawing board svg
      var svg = d3.select("#map")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

      var box = svg.append('text')
        .attr('id', 'place')
        .attr('x', 10)
        .attr('y', 10)
        .attr("width", 250)
        .attr("height", 100);

      // 5. transform topoJson into 
      //json: objects > admin > geometries array 

      d3.json('nc_counties.json', function (error, data) {
        if (error) return;

        // this array is placed into 'states'
        // as an array of geojson objcts: type, properties, arcs

        console.log('mexico', data);
        var states = topojson.feature(data, data.objects.north_carolina1);

        // Setup the scale and translate
        var b, s, t;
        projection.scale(1).translate([0, 0]);



        var b = path.bounds(states); // this yields the full state - 
        // this grabs the 6the
        // var b = path.bounds(states.features[3]);

        //calculate scaleby the longest geo-edge of our bounding box / number of pixels of this edge in visualization
        // take scale of width then height, and taking the larger of the two
        // The 95 value adjusts the scale because we are giving the map a bit of a breather at the edges in order to not have the paths intersect the edges of the SVG container item, basically reducing the scale by 5%.

        var s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
        // var s=100;

        //to return map to center we use translate(), which takes an array of 2 parameters: the amount to translate in x, and then in y.   calculate x by finding the center and multiplying it by the scale.  subtract result from the width of svg element.  so width of svg - scale x the center ... divided by 2 --- top right / topleft the second: same but for height..? bottom-right, bottom-left values used. 

        var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
        // var t=10;

        // reset projection to use our new scale and translation.

        projection.scale(s).translate(t);

        //Here, we will create a map variable that will group all of the following SVG elements into a <g> SVG tag. This will allow us to apply styles and better contain all of the proceeding paths' elements:

        var map = svg.append('g').attr('class', 'boundary');

        //Finally, we are back to the classic D3 enter, update, and exit pattern. We have our data, the list of Mexico states, and we will join this data to the path SVG element:

        mexico = map.selectAll('path').data(states.features);


        //Update
        var color = d3.scaleLinear().domain([0, 33]).range(['red', 'yellow']);


        //Enter
        mexico.enter()
          .append('path')
          .attr('d', path)
          .attr('id', geoID)
          // .on("click", click)
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
        
function jack(d) {

          var z = d.properties.GEOID;
        d3.queue()
          .defer(d3.csv, 'income.csv')
          .defer(d3.csv, 'ethnicity.csv')
          .await(function(error, d1, d2) {
    
          // }))
          // d3.csv('income.csv', function (d1) {
          //   d3.csv('ethnicity.csv', function (d2) {
            // var data1 = [];
            // var csv = [];
            // csv = 
            // data1.push(d1, d2);
            console.log(d1);
            // console.log(d1['GEO.id2']);
            // return {
            //   csvID: d1['GEO.id2'],
            //   number: d1.HC01_EST_VC15,
            //
            // }
            
          // });
     
          // }, function (error, rows) {
        //     console.log(rows);
        //     console.log(rows[2].number);
        //     console.log(rows[3].csvID);
            
            d1.forEach(function (element, item) {
              // element.forEach(function(e, i) {

              
              if (z == element['GEO.id2']) {
                csvID = element['GEO.id2']
                number = element.HC01_EST_VC15
        //         white = rows[item].white;
        //         black = rows[item].black;
              }
              // })
            })

                d2.forEach(function (element, item) {
              // element.forEach(function(e, i) {

              
              if (z == element['GEO.id2']) {
         
                white = parseInt(element.HD01_VD02);
                black = parseInt(element.HD01_VD03);
                ration = Math.round(black / (black +white )*100);
              }
            console.log(black);
            })

            console.log(ration);
            d3.select("#place")
              .text("Mean Household Income:  " + number  +  "   Black Percentage: " + ration + " %")
              .attr('dx', '250')
              .attr('dy', '40')
            // d3.select("#place")
            //   .text("White:  " + white)
            //   .attr('dx', '250')
            //   .attr('dy', '60')
            //   .text("Black:  " + black)
            //   .attr('dx', '250')
            //   .attr('dy', '80')
            
              // .attr('id', 'text2')
              .attr('font-size', '20px')
          // });
          
        //   // adding second data set here. 
        //   // white: HD01_VD02
        //   // black: HD01_VD03

        
          });
        // //   end pt.2
        };


        // The Enter section and the corresponding path functions are executed on every data element in the array. As a refresher, each element in the array represents a state in Mexico. The path function has been set up to correctly draw the outline of each state, as well as scale and translate it to fit in our SVG container.
        // var name = function (d) {
        //   return d.properties.NAME;
        // };

        // this gets the names of the cities into the counties
        var cityText = svg.selectAll('text')
          .data(states.features);

        cityText.enter()
          .append('text')
          .text(function (d) {
            return d.properties.NAME;
          })
          .attr("transform", function (d) { return "translate(" + path.centroid(d) + ")"; })
          .attr("dx", function (d) { return d.properties.dx || "0"; })
          .attr("dy", function (d) { return d.properties.dy || "0.35em"; })
      });

    })();