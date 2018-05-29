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
var choice = "black"
var getinfo, info= []
var build = {};
var next

/// build map

build_object(build)
console.log(build)

// setup_map returns 3 elements

setup_map(build, function(build) {
    console.dir(build) 
    test0(build)
})

//create_mapd3

function test0(build) {
    console.log(build)
    create_map(build, function(build) {
        console.log(build)
    })
}
 
/////////////////////////////
// This builds map making object
// param - data
// return - nothing 
/////////////////////////////

function build_object (build) {

    // return new Promise(function(resolve, reject) { 
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
    .translateExtent([[-275,0], [width,800]])
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
        return build
    //     if (build) {
    //         resolve(build)
    //     } else {
    //         reject("error")
    //     } 
    // }) // end promise
}

/////////////////////////////
// This sets up map data
// param - data
// return - nothing 
/////////////////////////////

function setup_map (build, callback) {
    // return new Promise(function(resolve, reject) { 

     // transform topoJson into json: objects > admin > geometries array 
     d3.queue()
     .defer(d3.json, 'data/nc_counties.json')
     .defer(d3.csv, 'data/income2.csv')
     // .defer(d3.csv, 'ethnicity.csv')
     .defer(d3.csv, 'data/races.csv')
     .await(function(error, data, income, ethnicity) {
     if (error) return;

     // manage map data -- 

         // states = an array of geojson objcts: type, properties, arcs
         build.states = topojson.feature(data, data.objects.north_carolina1);
         
         // reset scale and translate
         build.projection.scale(1).translate([0, 0]);
         b = build.path.bounds(build.states); 
         s = .85 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
         t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];
         build.projection.scale(s).translate(t);
  
         income.forEach(function(element, item) {
             var income3 = Math.round(parseInt(element.HOUSEHOLD_MEAN)/1000);
             if (income3 > highest_income) {
                 highest_income = income3;
             }
         })
        barChartCoord = [];
     // manage income / ethnicity data

         income.forEach(function (element, item) {
             // console.log(element);
             // csvID = element['GEO.id2'];
             csvID = element.ID;
             income = Math.round(parseInt(element.HOUSEHOLD_MEAN)/1000);
        
             name = element.GEO;
             white = ethnicity[item].WHITE;
             black = (ethnicity[item].BLACK);
             hispanic = (ethnicity[item].HISPANIC);
             total_race = (ethnicity[item].TOTAL);
             hispanic_ratio = Math.round((hispanic / total_race) *100);
             race_ratio = Math.round((black / total_race) *100);   
             income_ratio=Math.round((income / highest_income)*100);
     
             add = {
                 csvID: csvID, 
                 name: name,
                 income: income, 
                 highest_income: highest_income, 
                 race_ratio: race_ratio, 
                 income_ratio: income_ratio,
                 hispanic_ratio: hispanic_ratio
             }; 
             
             if (choice=="black") {
             barChartCoord.push({x:income_ratio, y:race_ratio})
            } else if (choice == "brown"){
                barChartCoord.push({x:income_ratio, y:hispanic_ratio})                
            };
                income2.push(add) 
                
            })  //end of income loop
        
            console.log(barChartCoord)
            barChartCoord.sort(function(x, y){
                return d3.ascending(x.x, y.x);
            })
            build.barChartCoord = barChartCoord;
            build.income2 = income2;
            callback(build)
      
                }) // end await
      
}

 // organize data for bar chart    
//  barChartCoord = create_bars(barChartCoord);

 // create barchart         
//  create_barChart(barChartCoord);

 // add color to the map
//  create_map() 
        
        // if (build) {
        //     resolve(build)
        // } else {
        //     reject("error")
        // } 
    // }) // end promise

    // return new Promise(function(resolve, reject) { 

   /////////////////////////////
// This creates map with color / text
// param - data
// return - nothing 
/////////////////////////////

function create_map(build, callback) {

    console.log("hit!!")

    var gradient = ["#3CC953", "#47D268", "#52DB7D", "#5DE493", "#68EDA8", "#74F7BE"]

    var color = d3.scaleThreshold()
        .domain([5, 20, 35, 50, 65])
        .range(gradient)

        // https://www.strangeplanet.fr/work/gradient-generator/index.php

  

    var map = build.svg.append('g')
        .attr('class', 'boundary');
    
    mexico = map.selectAll('path')
        .data(build.states.features);
    
    // create map - 
    mexico.enter()
        .append('path')
       
        .attr('d', build.path)
        .attr('id', function(d, i) {
            return build.income2[i].csvID;
        })
        .style('fill', function(d, i) {
            // console.log(income2[i].name  +" -- ", income2[i].race_ratio +" -- ", income2[i].csvID+ "--id--" + i)
            next = color(build.income2[i].race_ratio);
          
            return next
          
        })
        // .on('click', create_modal)
        
    //Update
    // mexico.attr('fill', '#eee');
    //Exit
    mexico.exit().remove();

    ////////////////////////////////////////
    // get and add county names - 
    var cityText = build.svg.selectAll('text')
        .data(build.states.features);
// console.log(states.features)
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
        callback(build)
    }
 


        // if (info) {
        //     resolve(info)
        // } else {
        //     reject("error")
        // } 
    // }) // end of await
    // })  // end of promise
// }

 
 

/////////////////////////////
// This creates bar chart
// param - data
// return - nothing 
/////////////////////////////

function create_barChart(barChartCoord) {
    console.log(barChartCoord); 
    return barChartCoord;
}