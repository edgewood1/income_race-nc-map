(function () {  // data setup
    // dataData = [÷÷

    var data1 =[
        {x: 4, y:9}, {x: 2, y: 7},{x: 1, y:9}, {x: 2, y: 7} 
    ];
    //     var data =[
            
    //     ];
var data=[];
var now;
var rows;

d3.queue()
  .defer(d3.csv, 'income.csv')
  .defer(d3.csv, 'ethnicity.csv')
  .await(here);

function here(error, income, ethnicity) {
  console.log(income );      
  income.forEach(function (element, item) {     
    csvID = income['GEO.id2'];
    number = Math.round(parseInt(element.HC01_EST_VC15)/1000);
    white = parseInt(ethnicity[item].HD01_VD02);
    black = parseInt(ethnicity[item].HD01_VD03);
    ratio = Math.round(black / (black +white )*100);
                // black =d2.HD01_VD03;
                // number =d1.HC01_EST_VC15;
                //   race = parseInt(d2[item].HD01_VD03)
    data.push({x:number, y:ratio});
                // now = {x:number, y:ratio}
                // data[item]=now;
                //   delete data[0]
            // }) 
  })
            //   }, function(error, rows) {
            // console.log(rows);
     
    // })

    console.log(data1[0].x);
    console.log(data[1].x)

    // console.dir(data);
    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 720 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;
    
    // set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    
    // define the line
    var valueline = d3.line()
        .x(function(d) { return x(d.x); })
        .y(function(d) { return y(d.y); });
    
    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#chartArea").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    }
   function drawGraph (data) {
    
      // format the data
      data.forEach(function(d) {
      console.dir(d);
          d.x = d.x;
          d.y = +d.y;
      });

    
      // Scale the range of the data
      x.domain(d3.extent(data, function(d) { return d.x; }));
      
      y.domain([ d3.min(data, function(d) { return d.y - margin.top; }), 
                 d3.max(data, function(d) { return d.y + margin.top}) ]);
    
      // Add the valueline path.
      svg.append("path")
          .data([data])
          .attr("class", "line")
          .attr("d", valueline);
    
      // Add the X Axis
      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x).ticks(5));
    
      // Add the Y Axis
      svg.append("g")
          .call(d3.axisLeft(y).ticks(8));
    
    }
    
    //drawGraph
    drawGraph(data);
    
      

   })();