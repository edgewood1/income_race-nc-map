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
var choice = "black";
var build = {};

$("#black").on("click", function() {
 
    barChartCoord=null;
    $("#map").empty();
    $("#chartArea").empty();
    choice = "black";
    build_map(choice, build)
    //refresh sc
})   
$("#brown").on("click", function() {
  
    barChartCoord =null;
    $("#chartArea").empty();
    choice = "brown";
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

function setup_map (choice, build) {

    // transform topoJson into json: objects > admin > geometries array 
    d3.queue()
        .defer(d3.json, 'nc_counties.json')
        .defer(d3.csv, 'income2.csv')
        // .defer(d3.csv, 'ethnicity.csv')
        .defer(d3.csv, 'races.csv')
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
           barChartCoord = [];
        // manage income / ethnicity data

            income.forEach(function (element, item) {
        
                // csvID = element['GEO.id2'];
                csvID = element.ID;
                income = Math.round(parseInt(element.HOUSEHOLD_MEAN)/1000);
           
                name = element.GEO;
                // white = parseInt(ethnicity[item].HD01_VD02);
                // black = parseInt(ethnicity[item].HD01_VD03);
                // race_ratio = Math.round(black / (black +white )*100);  

                white = ethnicity[item].WHITE;
               
                black = (ethnicity[item].BLACK);
          
                hispanic = (ethnicity[item].HISPANIC);
                total_race = (ethnicity[item].TOTAL);
                // white = parseInt(ethnicity[item].WHITE);
                // black = parseInt(ethnicity[item].BLACK);
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
        
 
        barChartCoord.sort(function(x, y){
            return d3.ascending(x.x, y.x);
        })

 
 
    // organize data for bar chart    
    barChartCoord = create_bars(barChartCoord);

    // create barchart         
    create_barChart(barChartCoord);

    // add color to the map
    create_map() 
})

/////////////////////////////
// This creates map with color / text
// param - data
// return - nothing 
/////////////////////////////

function create_map() {

  

    var gradient = ["#3CC953", "#47D268", "#52DB7D", "#5DE493", "#68EDA8", "#74F7BE"]

    var color = d3.scaleThreshold()
        .domain([5, 20, 35, 50, 65])
        .range(gradient)

        // https://www.strangeplanet.fr/work/gradient-generator/index.php

    // var color = d3.scaleSequential()
    // .domain([5, 70])
    // .interpolator(d3.interpolateViridis);

    // var color = d3.scaleLinear()
   
    //     .domain([0,10,20,30,40,50,60,70])
    // //     .range(['red', '#ddd', 'blue'])
    //     .range(['IndianRed', 'LightCoral', 'Salmon', 'DarkSalmon', 'LightSalmon', 'Crimson', 'Red', 'FireBrick', 'DarkRed'])
 
       
    

    // var color= d3.scaleQuantize()
    //     .domain([0, 70])
    //     .range(['IndianRed', 'LightCoral', 'Salmon', 'DarkSalmon', 'LightSalmon', 'Crimson', 'Red', 'FireBrick', 'DarkRed']);

    var map = build.svg.append('g')
        .attr('class', 'boundary');
    
    mexico = map.selectAll('path')
        .data(states.features);
    
    // create map - 
    mexico.enter()
        .append('path')
       
        .attr('d', build.path)
        .attr('id', function(d, i) {
            return income2[i].csvID;
        })
        .style('fill', function(d, i) {
            // console.log(income2[i].name  +" -- ", income2[i].race_ratio +" -- ", income2[i].csvID+ "--id--" + i)
            next = color(income2[i].race_ratio);
          
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

/////////////////////////////
// This creates bar chart
// param - data
// return - nothing 
/////////////////////////////

function create_barChart(barChartCoord) {

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
        .text('black pop. %'); 
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
    income2.forEach(function(e, i) {
        if (z == e.csvID) {
            name = e.name;
            income = e.income;
            race = e.race_ratio;
            csvID = e.csvID;
            hispanic_ratio= e.hispanic_ratio;
        }
    })         
   //modal pt.2 
    // instance.open();
 
 // add data to the table - 
    d3.select("#place1")
    .attr('class', 'text3')
        .html("<br>" +
            name + "<br>"+"Mean Household Income:   $" + 
            income + " K<br>" + "Black Percentage: " + 
            race + " %<br>" + "Brown Percentages:" +
            hispanic_ratio + " %") 
        

    color_bar(d, income);
};

function color_bar(d, income) {
     

    d3.selectAll('.bar')
    // .filter(function(d) {return d})
    .style('fill', '#277b2e'); 
var id =0;
    switch (true) {
        case (income<=37 ): id='37'; break;
        case (income>37 && income <=47 ): id = '47'; break;
        case (income>47 && income <=50 ):  id = '51'; break;
        
        case (income>50&& income <=53 ): id = '54'; break;
        case (income>53 && income <=56 ):  id = '57'; break;
        
        case (income>56 && income <=62 ): id = '62'; break;
        case (income>62 && income <=67 ): id = '68'; break;
        case (income>67 && income <=75 ): id = '76'; break;
        case (income>75): id = '87'; break;
        
    }

 



   d3.select('#d'+id)
    .style('fill', 'black')

        
    // make all bars blue - 
    // which bar = income? 
    // make that red
}

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

function geoID (d) {
    return d.properties.GEOID;
};
    
        // 3. On click, get ID - (add opacity?)
function click (d) {
    d3.selectAll('path').attr('fill-opacity', 0.2)
    d3.select('#' + geoID(d)).attr('fill-opacity', 1);
};
 