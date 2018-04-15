// BAR CHART -

(function() {

    // 1. set dimensions 
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 800 - margin.left - margin.right,
        height = 370 - margin.top - margin.bottom;

    // 2. set the ranges
    var x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
    var y = d3.scaleLinear()
            .range([height, 0]);        

    // 4. set canvas: add body > svg > group > move top left margin
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");

    //5. loop through data
    var data =[];
    var high =0;
    d3.queue()
        .defer(d3.csv, 'income.csv')
        .defer(d3.csv, 'ethnicity.csv')
        .await(function(error, d1, d2) {
            console.log(d1);
        // high = Math.max.apply(parseInt(Math, d1.map(function(o){return o.HC01_EST_VC15;})));   
        

        d1.forEach(function (element, item) {     
            csvID = element['GEO.id2'];
            // high = Math.max.apply(Math, parseInt(element.HC01_EST_VC15));
            number = Math.round(parseInt(element.HC01_EST_VC15)/1000);
            if (number > high) {
                high = number;
            }
            
            white = parseInt(d2[item].HD01_VD02);
            black = parseInt(d2[item].HD01_VD03);
            ratio2=Math.round((number/high)*100);
            ratio = Math.round(black / (black +white )*100);
            //   race = parseInt(d2[item].HD01_VD03)
            data.push({x:ratio2, y:ratio});
            data[0] = {x:0, y:0};
        })
        data.sort(function(x, y){
            return d3.ascending(x.x, y.x);
        })
        console.log(data);
        console.log(high);
    
    // 2.  - Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d.x; }));
    y.domain([0, d3.max(data, function(d) { return d.y; })]);

    // 4. add barchart 
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.y); })
        .attr("height", function(d) { return height - y(d.y); });
        

        var label = ['race', 'income']
    
     // add the x Axis and HEADER
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
    svg.append('g')
        .append('text')
        .attr('x', 200)
        .attr('y', 330)
        .attr('class', 'bartext')
        .text('median income in thousands')

    // add the y Axis and HEADER
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