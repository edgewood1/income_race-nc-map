(function () {

// Set the dimensions of the canvas / graph
var height = 500, 
width = 500, 
margin = 25,
xAxis, yAxis, xAxisLength, yAxisLength;

svg = d3.select("body").append("svg")
    .attr('class', 'axis')
    .attr('width', width)
    .attr('height', height);

    // function renderXAxis(){
        xAxisLength = width - 2 * margin;
    
        var scale = d3.scaleLinear()
                        .domain([0, 100])
                        .range([0, xAxisLength]);
        
        xAxis = d3.axisBottom()
                .scale(scale);
                
        svg.append("g")       
            .attr("class", "x-axis")
            .attr("transform", function(){ 
                return "translate(" + margin + "," + (height - margin) + ")";
            })
            .call(xAxis);
    // }
    
    // function renderYAxis(){        
        yAxisLength = height - 2 * margin;
    
        var scale = d3.scaleLinear()
                        .domain([100, 0])
                        .range([0, yAxisLength]);
    
        yAxis = d3.axisLeft()
                .scale(scale);

        svg.append("g")       
            .attr("class", "y-axis")
            .attr("transform", function(){
                return "translate(" + margin + "," + margin + ")";
            })
            .call(yAxis);
   
 

// var axis = fn()
//     .scale(scale)
//     .ticks(5);

// d3.scaleLinear().domain([0, 1000]).range([0, axisWidth])
// d3.scalePow().exponent(2).domain([0, 1000]).range([0, axisWidth])
// d3.scaleTime()
//     .domain([new Date(2016, 0, 1), new Date()])
//     .range([0, axisWidth])

// Parse the date / time
// var parseDate = d3.time.format("%d-%b-%y").parse;

// Set the ranges
// var x = d3.time.scale().range([0, width]);
// var x = d3.scaleLinear().range([width, 0]);
// var y = d3.scaleLinear().range([height, 0]);

// Define the axes

// d3. select(".axis")
//     .call(d3.axisBottom(x));

// var xAxis = d3.svg.axis().scale(x)
//     .orient("bottom").ticks(5);

// var yAxis = d3.svg.axis().scale(y)
//     .orient("left").ticks(5);

// Define the line
// var valueline = d3.line()
//     .x(function(d1) { return x(d1.number); })
//     .y(function(d2) { return y(d2.ration); });
    
// // Adds the svg canvas
// var svg = d3.select("body")
//     .append("svg")
//         .attr("width", width + margin.left + margin.right)
//         .attr("height", height + margin.top + margin.bottom)
//     .append("g")
//         .attr("transform", 
//               "translate(" + margin.left + "," + margin.top + ")");

// // Get the data
// d3.queue()
//     .defer(d3.csv, 'income.csv')
//     .defer(d3.csv, 'ethnicity.csv')
//     .await(function(error, d1, d2) {
//         d1.forEach(function (element, item) {     
//               csvID = element['GEO.id2']
//               d1.number = element.HC01_EST_VC15
//         })
//         d2.forEach(function (element, item) {
//                 white = parseInt(element.HD01_VD02);
//                 black = parseInt(element.HD01_VD03);
//                 d2.ration = Math.round(black / (black +white )*100);
//         })

//     // Scale the range of the data
//     x.domain(d3.extent(data, function(d1) { return d1.number; }));
//     y.domain([0, d3.max(data, function(d2) { return d2.ration; })]);

//     // Add the valueline path.
//     svg.append("path")
//         .attr("class", "line")
//         .attr("d", valueline(data));

//     // Add the X Axis
//     svg.append("g")
//         .attr("class", "x axis")
//         .attr("transform", "translate(0," + height + ")")
//         .call(xAxis);

//     // Add the Y Axis
//     svg.append("g")
//         .attr("class", "y axis")
//         .call(yAxis);

// })

})();