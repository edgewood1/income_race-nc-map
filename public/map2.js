(function () {
    // 1. h x w of canvas

    var height = 550,
        width = 1450;
        var income;
        var color;
        var white;
        var black;
        var race_percentn;
        var total;
        var master_total =[];;
        var high = 0;
        var z;
        var data=[];
        var data2=[]
        var master_race_percent=[];
        var income2=[]
        var add = {}
        
    // 2.5create getPaths with projections  // used in geoID? 
    var projection = d3.geoMercator()
        .scale(500)
        .translate([width/2, height/2])
        
    mexico = void 0;

    var geoID = function (d) {
        // return "c" + d.properties.GEOID2;
        return d.properties.GEOID;
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
        .append("svg")
        .attr("id", "inner_map")
        // responsive SVG needs these 2 attributes and no width and height attr
        .attr("preserveAspectrace_percent", "xMinYMin meet")
        .attr("viewBox", "0 0 1400 600")
        //class to make it responsive
        .classed("svg-content-responsive", true);

    // 6. transform topoJson into json: objects > admin > geometries array 
    d3.queue()
        .defer(d3.json, 'nc_counties.json')
        .defer(d3.csv, 'income.csv')
        .defer(d3.csv, 'ethnicity.csv')
        .await(function(error, data, income, ethnicity) {
        if (error) return;
           
        //////////////////////////////// MANAGE INCOME/ETHNICITY       
            income.forEach(function (element, item) {
        
                csvID = element['GEO.id2'];
          

                income = Math.round(parseInt(element.HC01_EST_VC15)/1000);
                    if (income > high) {
                        high = income;
                    }
                name = element['GEO.display-label']
                white = parseInt(ethnicity[item].HD01_VD02);
                black = parseInt(ethnicity[item].HD01_VD03);
                race_percent = Math.round(black / (black +white )*100);   
                race_percent2=Math.round((income/high)*100);
                
                add = {
                    csvID: csvID, 
                    name: name,
                    income: income, 
                    high: high, 
                    race_percent: race_percent, 
                    race_percent2: race_percent2,
                };

                

                data2.push({x:race_percent2, y:race_percent});

                income2.push(add)

                
            })  //end of income loop

            data2.sort(function(x, y){
                return d3.ascending(x.x, y.x);
            })
            data2[0] = {x:0, y:0};
            data2 = next(data2);
            console.log ("first -- ", data2)
            goToBar(data2);
       
            console.log("income - ", income2)

            /////// MANAGE DATA 
            // states = an array of geojson objcts: type, properties, arcs
            var states = topojson.feature(data,         data.objects.north_carolina1);
            // 6. v. sert / reset scale and translate
            var b, s, t;
            projection.scale(1).translate([0, 0]);
            var b = path.bounds(states); 
            var s = .85 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
            var t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
            projection.scale(s).translate(t);

            // var color = d3.scaleThreshold()
            //     .domain([10, 20, 30, 40, 50])
            //     .range(['#FF0000','#FF3300','#FF6600','#FF9900','#FFCC00', '#FFFF00'  ])

            // var color = d3.scaleSequential()
            // .domain([5, 70])
            // .interpolator(d3.interpolateViridis);

            // var color = d3.scaleLinear()
            //     .domain([5, 30, 60])
            //     .range(['red', '#ddd', 'blue']);

            var color= d3.scaleQuantize()
                .domain([0, 70])
                .range(['IndianRed', 'LightCoral', 'Salmon', 'DarkSalmon', 'LightSalmon', 'Crimson', 'Red', 'FireBrick', 'DarkRed']);

            var map = svg.append('g')
                .attr('class', 'boundary');
            
            mexico = map.selectAll('path')
                .data(states.features);
            
            //====================================
            //7. Enter
            mexico.enter()
                .append('path')
                .attr('d', path)
                .attr('id', function(d, i) {
                    return income2[i].csvID;
                })
                .attr('fill', function(d, i) {
                    // console.log(income2[i].name  +" -- ", income2[i].race_percent +" -- ", income2[i].csvID)
                    return color(income2[i].race_percent);
                })
                .on('click', info_modal)
                
            //Update
            // mexico.attr('fill', '#eee');
            //Exit
            mexico.exit().remove();
            ////////////////////////////////// MODAL ///////////////////

          

            function info_modal(d) {
                var elem = document.querySelector('.modal');
                var instance = M.Modal.init(elem);
                var z = d.properties.GEOID;
                income2.forEach(function(e, i) {
                    if (z == e.csvID) {
                        name = e.name;
                        income = e.income;
                        race = e.race_percent;
                        csvID = e.csvID;
                    }
                })         
                // add data to the table - 
                instance.open();
                console.log(z);

                d3.select("#place1")
                    .html(
                        name + "<br>"+"Mean Household Income:  " + 
                        income + "<br>" + "Black Percentage: " + 
                        race + " %" + "<br>" +
                        csvID ) 
                    .attr('class', 'text3')
                    // .attr('font-size', '16px')
                    d3.select(".bar")
                    // .color
                    .attr('fill', function (d, i) { return color(i); })
            };

            ////////////////////////////////////////
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
              // BAR CHART -

        function goToBar(data2) {

              var width2 =800, 
              height2 =300;
            console.log ("bar", data2)
              // 2. set the ranges
              var x = d3.scaleBand()
                      .range([0, width2])
                      .padding(0.1);
              var y = d3.scaleLinear()
                      .range([height2, 0]);        
          
              // 4. set canvas: add body > svg > group > move top left margin
              var svg2 = d3.select("#chartArea").append("svg")
                  // .attr("width", width + margin.left + margin.right)
                  // .attr("height", height + margin.top + margin.bottom)
                  // .attr("width", width)
                  // .attr("height", height)
                  // .append("g")
                  // .attr("transform", 
                  //     "translate(100, 60)")
                      // - above,will move image within the canvas
                      //   // responsive SVG needs these 2 attributes and no width and height attr
                        .attr("preserveAspectRatio", "xMinYMin meet")
                        .attr("viewBox", "-50 0 880 350")
                        //(left/right inside box, higher goes up inside, 
                        //higher makes inside smaller more fits, higher canvas goes down lower )
                        //class to make it responsive
                        .classed("svg-content-responsive", true);

           // 2.  - Scale the range of the data in the domains
           x.domain(data2.map(function(d) { return d.x; }));
           y.domain([0, d3.max(data2, function(d) { return d.y; })]);
   
           // 4. add barchart 
           svg2.selectAll(".bar")
               .data(data2)
               .enter().append("rect")
               .attr("class", "bar")
               .attr("x", function(d) { return x(d.x); })
               .attr("width", x.bandwidth())
               .attr("y", function(d) { return y(d.y); })
               .attr("height", function(d) { return height - y(d.y); });
               
               
   
               var label = ['race', 'income']
           
           // add the x Axis and HEADER
           svg2.append("g")
               .attr("transform", "translate(0," + height + ")")
               .call(d3.axisBottom(x))
           svg2.append('g')
               .append('text')
               .attr('x', 200)
               .attr('y', 330)
               .attr('class', 'bartext')
               .text('median income in thousands')
   
           // add the y Axis and HEADER
           svg2.append("g")
               .call(d3.axisLeft(y))
           svg2.append('g')
               .append('text')
               .attr('class', 'bartext')
               .attr('transform', 'translate(-30,180)rotate(-90)')
               .attr('font-size', '20px')
               .text('black pop. %');  
    }
      
           function next(here) {
        //    console.log(here);
               var data=[];
               var c =0;
               // creates 3 sets of 4
               for (v=0; v<9; v++){
                   var x = 0;
                   var y = 0;
                   for (w=0+c;  w<9+c; w++) {
                       x += (here[w].x);
                       y += (here[w].y);
                   }
                   data.push({x, y});
                   data[v].x=data[v].x/10;
                   data[v].y=data[v].y/10;
                   c+=11;
               }
               console.log(data);
               return data;
   
           }
})()