(function () {    
 

var data =[];

d3.queue()
.defer(d3.csv, 'income.csv')
.defer(d3.csv, 'ethnicity.csv')
.await(function(error, d1, d2) {
    d1.forEach(function (element, item) {     
          csvID = element['GEO.id2'];
          number = parseInt(element.HC01_EST_VC15)/1000;
          white = parseInt(d2[item].HD01_VD02);
          black = parseInt(d2[item].HD01_VD03);
          ratio = Math.round(black / (black +white )*100);
        //   race = parseInt(d2[item].HD01_VD03)
          data.push({x:number, y:ratio});
          data[0] = {x:0, y:0};
    })

       var width = 500,
        height = 500,
        margin = 50,
        x = d3.scaleLinear() // <-A
            .domain([0, 10])
            .range([margin, width - margin]),
        y = d3.scaleLinear() // <-B
            .domain([0, 10])
            .range([height - margin, margin]);
// define canvas

   var line = d3.line() // <-D
            .x(function(d){return x(d.x);})
            .y(function(d){return y(d.y);});
        
    var svg = d3.select("body").append("svg");
    
    svg.attr("height", height)
        .attr("width", width);
        
     svg.selectAll("path")
            .data(data)
        .enter()
            .append("path") // <-E
            .attr("class", "line")            
            .attr("d", function(d){return line(d);}); // <-F
            
    renderAxes(svg);
        
    function renderAxes(svg){ // <-G
        var xAxis = d3.axisBottom()
                .scale(x.range([0, quadrantWidth()]));

        var yAxis = d3.axisLeft()
                .scale(y.range([quadrantHeight(), 0]));

        svg.append("g")        
            .attr("class", "axis")
            .attr("transform", function(){
                return "translate(" + xStart() 
                    + "," + yStart() + ")";
            })
            .call(xAxis);
            
        svg.append("g")        
            .attr("class", "axis")
            .attr("transform", function(){
                return "translate(" + xStart() 
                    + "," + yEnd() + ")";
            })
            .call(yAxis);
    }
        
    function xStart(){
        return margin;
    }        
    
    function yStart(){
        return height - margin;
    }
    
    function xEnd(){
        return width - margin;
    }
    
    function yEnd(){
        return margin;
    }
    
    function quadrantWidth(){
        return width - 2 * margin;
    }
    
    function quadrantHeight(){
        return height - 2 * margin;
    }   
    }    )
    })();