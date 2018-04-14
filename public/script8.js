(function() {
// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);        
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

var data =[];

d3.queue()
    .defer(d3.csv, 'income.csv')
    .defer(d3.csv, 'ethnicity.csv')
    .await(function(error, d1, d2) {
    d1.forEach(function (element, item) {     
          csvID = element['GEO.id2'];
          number = Math.round(parseInt(element.HC01_EST_VC15)/1000);
          white = parseInt(d2[item].HD01_VD02);
          black = parseInt(d2[item].HD01_VD03);
          ratio = Math.round(black / (black +white )*100);
        //   race = parseInt(d2[item].HD01_VD03)
          data.push({x:number, y:ratio});
          data[0] = {x:0, y:0};
    })
    
    data.sort(function(x, y){
        return d3.ascending(x.x, y.x);
     })
    console.log(data);

  // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d.x; }));
    y.domain([0, d3.max(data, function(d) { return d.y; })]);

  // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.y); })
        .attr("height", function(d) { return height - y(d.y); });

    var label = ['race', 'income']
  // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
    
    svg.append('g')
        .append('text')
        .attr('x', 200)
        .attr('y', 330)
        .attr('class', 'bartext')
        .text('median income in thousands')

  // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y))
      
    svg.append('g')
        .append('text')
        .attr('class', 'bartext')
        .attr('transform', 'translate(-30,180)rotate(-90)')
        .attr('font-size', '20px')
        .text('black pop. %');  
    })

})()