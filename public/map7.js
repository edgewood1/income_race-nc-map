$( document ).ready(function() {
    $(".button-collapse").sideNav();
  });

// svg variables
var height = 550,
    width = 1450;

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 1450 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;
    
// data variables 
var z, 
    income,
    color,
    svg2,
    white,
    black,
    race_ratio,
    income_ratio, 
    states, 
    b, s, t;

var highest_income = 0;
var barChartCoord = []
var data =[]
var income2=[]
var add = {}
var mexico = void 0;
var choice = "Black";
var build = {};
var final_race =[];
$("#black").on("click", function() {
    barChartCoord=null;
    $("#map").empty();
    $("#chartArea").empty();
    choice = "Black";
    build_map(choice, build)

})   
$("#brown").on("click", function() {
    barChartCoord =null;
    $("#map").empty();
    $("#chartArea").empty();
    choice = "Brown";
    build_map(choice, build);
})   


build_map(choice, build);

function build_map(choice, build) { 
    
// define projection, which convert long-lat to x-y coord
build.projection = d3.geoMercator()
    .scale(500)
    .translate([width/2, height/2])
    
// define path - 

build.path = d3.geoPath().projection(build.projection);

// define drawing board
build.svg = d3.select("#map")
    .append("svg")
    .attr("id", "inner_map")
    .call(d3.zoom()
        .scaleExtent([1/1.5,3])
        // .extent([[0, 0], [width, height]])
        .translateExtent([[-275,0], [width+100,800]])
        .on("zoom", function () {
            build.svg.attr("transform", d3.event.transform)
        })
    )
     
    // responsive SVG needs these 2 attributes and no width and height attr
    .attr("preserveAspectrace_ratio", "xMinYMin meet")
        //1 - highest_incomeer goes left, 
            //2 - highest_incomeer goes up
            //3- lower makes inside bigger
            //4- highest_incomeer makes border larger
    .attr("viewBox", "525 0 1200 600")
    //class to make it responsive
    .append("g")
    .classed("svg-content-responsive", true)
    // create_map(svg, path, mexico, projection);

    setup_map(choice, build)
}

       
// Create map
// setup_map(choice, build);

/////////////////////////////
// This sets up map data
// param - data
// return - nothing 
/////////////////////////////

var main_data = {};

function setup_map (choice, build) {

    // transform topoJson into json: objects > admin > geometries array 
    d3.queue()
        .defer(d3.json, './data/nc_counties.json')
        .defer(d3.csv, './data/income2.csv')
        // .defer(d3.csv, 'ethnicity.csv')
        .defer(d3.csv, './data/races.csv')
        .await(function(error, data, income, ethnicity) {
        if (error) return;

        // manage map data -- 
            // states = an array of geojson objcts: type, properties, arcs
            states = topojson.feature(data, data.objects.north_carolina1);
  
            // reset scale and translate
            build.projection.scale(1).translate([0, 0]);
            b = build.path.bounds(states); 
            s = .85 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
            t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
            build.projection.scale(s).translate(t);

            income.forEach(function(element, item) {
                var income3 = Math.round(parseInt(element.HOUSEHOLD_MEAN)/1000);
                if (income3 > highest_income) {
                    highest_income = income3;
                }
            })

            income.forEach(function(e, i) {
                states.features.forEach(function (f, j) { 
                    if (e.ID==f.properties.GEOID) {          
                        f.properties.INCOME = e.HOUSEHOLD_MEDIAN 
                        f.properties.INCOME_PERCENT = Math.round(e.HOUSEHOLD_MEDIAN / highest_income)
                    }
                })
            })

            ethnicity.forEach(function(e, i) {
                states.features.forEach(function (f, j) { 
                    if (e.ID==f.properties.GEOID) {               
                        f.properties.HISPANIC = parseInt(e.HISPANIC)
                        f.properties.BLACK = parseInt(e.BLACK)
                        f.properties.NATIVE = parseInt(e.NATIVE)
                        f.properties.WHITE = parseInt(e.WHITE)
                        f.properties.TOTAL = parseInt(e.TOTAL)
                        f.properties.BLACK_PERCENT = Math.round((f.properties.BLACK / f.properties.TOTAL)*100)
                        f.properties.HISPANIC_PERCENT = Math.round((f.properties.HISPANIC / f.properties.TOTAL)*100)
                    }  
                })
            })
            main_data = states.features;          
           barChartCoord = [];
        // manage income / ethnicity data

            main_data.forEach(function (e, i) {
        
                if (choice=="Black") {
                    barChartCoord.push({x:e.properties.INCOME_PERCENT, y:e.properties.BLACK_PERCENT})
                } else if (choice == "Brown"){
                    barChartCoord.push({x:e.properties.INCOME_PERCENT, y:e.properties.HISPANIC_PERCENT})                
                };                    
            })  //end of income loop
        
            barChartCoord.sort(function(x, y){
                return d3.ascending(x.x, y.x);
            })

    // organize data for bar chart    
            barChartCoord = create_bars(barChartCoord);

    // create barchart         
            create_barChart(barChartCoord, choice);

    // add color to the map
            create_map(main_data, choice) 
})

// This organizes data into 10 sets of 10
// So that it can be represented as 10 bars
// params - data
// returns - data

function create_bars(here) {
 
    var data=[];
    var c =0;
    // creates 3 sets of 4
    for (var v=0; v<10; v++){
        var x = 0;
        var y = 0;
        for (var w=0+c;  w<10+c; w++) {
            x += (here[w].x);
            y += (here[w].y);
        }
        data.push({x, y});
        data[v].x=Math.round(data[v].x/10);
        data[v].y=Math.round(data[v].y/10);
        c+=10;
    }
 
    return data;
}
/////////////////////////////
// This creates bar chart
// param - data
// return - nothing 
/////////////////////////////

function create_barChart(barChartCoord, choice) {

    var width2 =900, 
        height2 =260;
    
    // 2. set the ranges
    var x = d3.scaleBand()
            .range([0, width2/2.5])
            .padding(0.4);
    var y = d3.scaleLinear()
            .range([height2, 0]);        
    
    // 4. set canvas: add body > svg > group > move top left margin
   svg2 = d3.select("#chartArea")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "-120 -60 500 400")
        .classed("svg-content-responsive", true)
        //1 - higher goes left, 
        //2 - higher goes up
        //3- lower makes inside bigger
        //4- highest_incomeer makes border larger
        //class to make it responsive
        .append("g")
            
    // 2.  - Scale the range of the data in the domains
    x.domain(barChartCoord.map(function(d) { return d.x; }));
    y.domain([0, d3.max(barChartCoord, function(d) { return d.y; })]);
    
    // 4. add barchart 
    svg2.selectAll(".bar")
        .data(barChartCoord)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.bandwidth())
        .attr('id', function(d) {return Math.floor(x(d.x))})
        .attr('id',  function(barChartCoord) { return 'd'+Math.floor(barChartCoord.x); }) 
        .attr("y", function(d) { return y(d.y); })
        .attr("height", function(d) { return height2 - y(d.y); })
      
 // add title? 
 svg2.append("g")
    .append('text')
    .attr('x', 35)
    .attr('y', -15)
    .style("font", "24px times")
    .text('STATE-WIDE STATS')

    // add the x Axis and HEADER
    svg2.append("g")
        .style("font", "20px times")
        // .classed("bar_text", true)
        .attr("transform", "translate(0," + height2 + ")")
        .call(d3.axisBottom(x))

    svg2.append('g')
        .append('text')
        .attr('x', 25)
        .attr('y', 310)
        .style("font", "24px times")
        .text('median income in thousands')

    // add the y Axis and HEADER
    svg2.append("g")
        .style("font", "20px times")
        .call(d3.axisLeft(y))
    svg2.append('g')
        .append('text')
        // translate (lower-left, up/down)
        .attr('transform', 'translate(-40,180)rotate(-90)')
        .style("font", "24px times")
        .text(choice +" pop. %"); 
}

// This creates the info - modal 
// on click 
// param - data
// return - ? 

function create_modal(d) {
    // modal pt. 1
    // var elem = document.querySelector('.modal');
    // var instance = M.Modal.init(elem);
    
    var z = d.properties.GEOID;
    main_data.forEach(function(e, i) {
        if (z == e.properties.GEOID) {
            name = e.properties.NAME;
            income = e.properties.INCOME;
            race = e.properties.BLACK_PERCENT;
            csvID = e.properties.GEOID;
            hispanic_ratio= e.properties.HISPANIC_PERCENT;
        }
    })         
   //modal pt.2 
    // instance.open();
 
 // add data to the table - 
    d3.select("#place1")
        .attr('class', 'text3')
        .html("SINGLE COUNTY STATS"+"<br>"+
            name + "<br>"+"Mean Household Income:   $" + 
            income + " K<br>" + "Black Percentage: " + 
            race + " %<br>" + "Brown Percentages:" +
            hispanic_ratio + " %").style("text-decoration", "none")
    color_bar(d, income);
};

function color_bar(d, income) {
     
    d3.selectAll('.bar')
    // .filter(function(d) {return d})
    .style('fill', '#277b2e'); 
var id =0;

// 45 48 51 52 55 58 60 63 69 85
    switch (true) {
        case (income<=45 ): id='45'; break;
        case (income>45 && income <=48 ): id = '48'; break;
        case (income>48 && income <=51 ):  id = '51'; break;
        
        case (income>51 && income <=52 ): id = '52'; break;
        case (income>52 && income <=55 ):  id = '55'; break;
        
        case (income>55 && income <=58 ): id = '58'; break;
        case (income>58 && income <=60 ): id = '60'; break;
        case (income>60 && income <=63 ): id = '63'; break;
        case (income>63 && income <=69 ): id = '69'; break;
        case (income>70): id = '85'; break;        
    }

   d3.select('#d'+id)
    .style('fill', 'black')
    // make all bars blue - 
    // which bar = income? 
    // make that red
}

/////////////////////////////
// This creates map with color / text
// param - data
// return - nothing 
/////////////////////////////

function create_map(main_data, choice) {
 
   var color = d3.scaleSequential(d3.interpolatePiYG)
   .domain([0, 70])

build.svg.append("g")
  .attr("class", "legendLinear")
  .attr("transform", "translate(280,20)");

var legendLinear = d3.legendColor()
  .shapeWidth(30)
  .title(choice + " Percent")
  .orient('horizontal')
  .scale(color);

build.svg.select(".legendLinear")
  .call(legendLinear);

  ///////
   // .domain(domain)
   // var color = d3.scaleLinear()
    // .range(gradient)

   var map = build.svg.append('g')
       .attr('class', 'boundary');
   
   mexico = map.selectAll('path')
       .data(states.features);
 
   
   // create map - 
   mexico.enter()
       .append('path') 
       .attr('d', build.path)
       .attr('id', function(d, i) {
           return d.properties.GEOID;
       })
       .attr('fill', function(d, i) {
            if (choice=="Black") { 
                next = color(d.properties.BLACK_PERCENT)
            } else if (choice=="Brown") {
                next = color(d.properties.HISPANIC_PERCENT) 
            }
           return next
       })
       .on('click', create_modal)

   //Update
   // mexico.attr('fill', '#eee');
   //Exit
   mexico.exit().remove();

   ////////////////////////////////////////
   // get and add county names - 
   var cityText = build.svg.selectAll('text')
       .data(states.features);

   cityText.enter()
       .append('text')
       .style("font", "11px times")
       .style("padding-left", "-10px")
       .text(function (d) {
           return d.properties.NAME;
       })
       .attr("transform", function (d) { 
           return "translate(" + build.path.centroid(d)  + ")"; 
       })
       .attr("dx", function (d) { 
           return d.properties.dx || "-1.5em"; 
       })
       .attr("dy", function (d) { 
           return d.properties.dy || "0.35em"; 
       })

    }
}

function geoID (d) {
    return d.properties.GEOID;
};
    
        // 3. On click, get ID - (add opacity?)
function click (d) {
    d3.selectAll('path').attr('fill-opacity', 0.2)
    d3.select('#' + geoID(d)).attr('fill-opacity', 1);
};
 