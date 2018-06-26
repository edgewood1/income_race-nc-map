$( document ).ready(function() {
    $(".button-collapse").sideNav();
    window.location.href="#description"
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
    window.location.href = "#description"
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
                var income3 = Math.round(parseInt(element.HOUSEHOLD_MEDIAN)/100);
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
                    // barChartCoord.push({x:e.properties.INCOME_PERCENT, y:e.properties.BLACK_PERCENT})
                    barChartCoord.push({y:e.properties.INCOME_PERCENT, x:e.properties.BLACK_PERCENT, geoId:e.properties.GEOID})
                } else if (choice == "Brown"){
                    barChartCoord.push({y:e.properties.INCOME_PERCENT, x:e.properties.HISPANIC_PERCENT, geoId:e.properties.GEOID})                
                };                    
            })  //end of income loop
         
            barChartCoord.sort(function(x, y){
                return d3.descending(x.y, y.y);
            })
          console.log(barChartCoord)
    // organize data for bar chart    
            // barChartCoord = create_bars(barChartCoord);

    // create barchart         
            create_barChart(barChartCoord, choice);

    // add color to the map
            create_map(main_data, choice) 
})


/////////////////////////////
// This creates bar chart
// param - data
// return - nothing 
/////////////////////////////

function create_barChart(barChartCoord, choice) {

     
    
    // 4. set canvas: add body > svg > group > move top left margin
   svg2 = d3.select("#chartArea")
        .append("svg")
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "-120 -60 300 400")
        .classed("svg-content-responsive", true)
        //1 - higher goes left, 
        //2 - higher goes up
        //3- lower makes inside bigger
        //4- highest_incomeer makes border larger
        //class to make it responsive
        .append("g")
            
    var width2 =360,
        height2 =260;
    
    // 2. set the ranges // blacks

    var xScale = d3.scaleLinear()
        .domain([0, d3.max(barChartCoord, function(d) { return d.x; })])
        .range([0, width2-10]);   
var jf =[]
var jj=barChartCoord.map(function(d) { return d.y; })
var jx = jj.map(function(e, i) { 
    return e        
        
    })


    var yScale = d3.scaleBand()
            // .domain(function(d) {return d.y})
            .domain(barChartCoord.map(function(d) { return d.y; }))
            .range([0, (height2)])
            
            .padding(.6);

    var xBegins=-40
 
    // 4. add barchart 
    svg2.selectAll(".bar")
        .data(barChartCoord)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr('id',  function(barChartCoord) { return "d"+barChartCoord.geoId; }) 
        .attr("name", function(d) {return d.name})    
        .attr('x', xBegins)
        .attr("width", function(d) { return xScale(d.x); })
        .attr("y", function(d) { return yScale(d.y); })
        .attr("height", function(d) { return yScale.bandwidth()})

        
    var margin = 25;
         // X - AXIS // passing the x scale band in 
    var xAxis = d3.axisBottom()
         .scale(xScale)
        //  .ticks(10)
        //  .tickSize(12) // <-A
        //  .tickPadding(10) // <-B
         // .tickFormat(d3.format(".0%")); // <-C
    
    svg2.append("g")
        .style("font", "20px times")        
        .attr("transform", "translate(" + xBegins +"," +(height2+10) + ")")
        .call(xAxis)
    
    svg2.append('g')
        .append('text')
        .attr('x', 25)
        .attr('y', 330)
        .style("font", "24px times")
        .text(choice +" pop. %");   
    
    var yAxis = d3.axisLeft()
        .scale(yScale)
        .tickValues(yScale.domain().filter(function(d,i){ return !(i%10)}));
        // .tickValues([40, 50, 60, 70,  90])
        // .tickPadding(10)

    // Y-AXIS
    svg2.append("g")
        .style("font", "20px times")
        .attr("transform", "translate(" + -50 +"," + 0 + ")")
        .call(yAxis)
   
    
    svg2.append('g')
        .append('text')
        // translate (lower-left, up/down)
        .attr('transform', 'translate(-100,250)rotate(-90)')
        .style("font", "24px times")
        
        .text('median income in thousands')

        // add title? 
svg2.append("g")
.append('text')
.attr('x', 35)
.attr('y', -25)
.style("font", "24px times")
.text('STATE-WIDE STATS')


    }



// This creates the info - modal 
// on click 
// param - data
// return - ? 

function create_modal(chosen_state, d) {
    window.location.href = "#chartArea"
    // $("#chartArea").style("margin-top", 40)
    var bar = 0;     
    var n = d.properties.NAME;
    // var z = d.properties.GEOID;
    main_data.forEach(function(e, i) {
        if (n == e.properties.NAME) {
        // if (z == e.properties.GEOID) {
            name = e.properties.NAME;
            income = e.properties.INCOME_PERCENT;
            race = e.properties.BLACK_PERCENT;
            csvID = e.properties.GEOID;
            hispanic_ratio= e.properties.HISPANIC_PERCENT;
        }
    })          

    

    d3.selectAll('.bar')
    // .filter(function(d) {return d})
    .style('fill', '#277b2e')
    .style('height', 2);

var id =0;

// write blog on this --- 
var bars=[]
var j=0
var bar1=document.getElementsByClassName("bar")
 
for (i=0; i<bar1.length; i++) { 
 
    var bar2=bar1[i].id 
    j++
    if (bar2=="d"+chosen_state) {break}
    bar2=bar2.slice(1)
    bar2=parseInt(bar2)
    
    bars.push(bar2)
}
console.log(j)
// [0].id;
    // bar1=bar1.slice(1)
    // console.log(bars)
   
 
    // switch (true) {
    //     case (income<=45 ): id='45', bars[0]; break;
    //     case (income>45 && income <=48 ): bars[1], bar=2; break;
    //     case (income>48 && income <=51 ): bars[2], bar =3; break;
    //     case (income>51 && income <=52 ): bars[3], bar = 4; break;
    //     case (income>52 && income <=55 ): bars[4], bar = 5; break;
    //     case (income>55 && income <=58 ): bars[5], bar = 6; break;
    //     case (income>58 && income <=60 ): bars[6], bar = 7; break;
    //     case (income>60 && income <=63 ): bars[7], bar = 8; break;
    //     case (income>63 && income <=69 ): bars[8]; bar = 9; break;
    //     case (income>70): bars[9], bar = 10; break;        
    // }

     
   d3.select('#d'+chosen_state)
    .style('fill', 'black')
    .style('height', 10)
    // make all bars blue - 
    // which bar = income? 
    // make that red

svg3 = d3.select("#place1")
        .attr('x', 35)
        .attr('y', 0)
        .attr('class', 'text3')
        .html('COUNTY-LEVEL STATS'+'<br>'+'__________________'+'<br>')

svg3.append('g')
        .attr('class', 'text3')
        .attr('x', 65)
        .attr('y', 25)         
        .html(
            name + "<br>"+"Median Household Income:   $" + 
            income + " K<br>" + "Black Percentage: " + 
            race + " %<br>" + "Brown Percentages:" +
            hispanic_ratio + " %" +"<br>" +"_______________"+"<br>")


svg3.append('g')
    .text("This county falls into bar number: "+ j)
    //   In this bar, the average income is $"+barChartCoord[bar].x +" and the average " + choice + " perentage is " + barChartCoord[bar].y) 
     
     
    
    

}

/////////////////////////////
// This creates map with color / text
// param - data
// return - nothing 

function create_map(main_data, choice) {
    
    var color = d3.scaleSequential(d3.interpolatePiYG)
    /////////////////////////////
   .domain([0, 70])

//    http://d3-legend.susielu.com/

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
       .on('click', function(d) {
           console.log(event.target.id)
           create_modal(event.target.id, d)
       })
    // .on('click', color_bar)

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
 

// This organizes data into 10 sets of 10
// So that it can be represented as 10 bars
// params - array of objects: [{x:3, y:3}, {x:4, y:7}.. ]
// returns - data

function create_bars(barChartCoord) {
 
    var data=[];
    var c =0;
    // creates 3 sets of 4
    for (var v=0; v<10; v++){
        var x = 0;
        var y = 0;
        // get the x / y of the first object - 
        // to this, add the x y of the next 9 objects
        // 10 objects total
        for (var w=0+c;  w<10+c; w++) {
            x += (barChartCoord[w].x);
            y += (barChartCoord[w].y);
        }
        data.push({x, y});
        //outer loop - take x/y of this new object and get an average
        data[v].x=Math.round(data[v].x/10);
        data[v].y=Math.round(data[v].y/10);
        // counter for the next 10 objects
        c+=10;
    }
 
    return data;
}