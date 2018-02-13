
//---------------------------------- Top View --------------------
d3.select("div#chart1")
   .append("div")
   .classed("svg-container", true) //container class to make it responsive
   .append("svg")
   .attr("class", "svg1")
   //responsive SVG needs these 2 attributes and no width and height attr
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 600 600")
   //class to make it responsive
   .classed("svg-content-responsive", true); 

//---------------------------------- Responsive SVG --------------------
var svg = d3.select(".svg1");
    radius = 10;
    var ratio = 25       // Aspect ratio starts with 100 25
    var width = 1200;
    var height = 1200 * ratio / 100;
    
    down_height = 1200 * 0.25;

    d3.select(".svg-container").style("padding-bottom", ratio+"%") 
    
    updateWindow_top();
    // updateWindow_down();
    
    function updateWindow_top(){
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight|| e.clientHeight|| g.clientHeight;

        down_height = 1200 * ratio / 100;
        // console.log("window: ", w.innerHeight,">",(g.clientHeight + down_height), "top: ", g.clientHeight, "down", down_height)     

        // if ( (w.innerHeight - (g.clientHeight + down_height)) > 150) {
        if ((ratio < 80) & ( (w.innerHeight - (g.clientHeight * 2)) > 50)) {
            ratio = ratio+0.5;
            d3.select(".svg-container").style("padding-bottom", ratio+"%") 
            // console.log("ratio ", ratio)
            updateWindow_top()
        }

        if ((ratio > 1) & ( ((g.clientHeight * 2) - w.innerHeight) > 20)) {
            ratio = ratio-0.5;
            d3.select(".svg-container").style("padding-bottom", ratio+"%") 
            // console.log("ratio ", ratio)
            updateWindow_top()
        }

        height = 1200 * ratio / 100;
        d3.select(".svg1").attr("viewBox","0 0 " + width + " " + height)
        
    }

    d3.select(window).on('resize.updatesvg', updateWindow_top);

    svg.append("rect")
            .attr("class","top-rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("height", height)
            .attr("width", width)
            .style("stroke", "gray")
            .style("fill", "none")
            .style("stroke-width", 2);


var circles = d3.range(20).map(function() {
  return {
    x: Math.round(Math.random() * (width - radius * 2) + radius),
    y: Math.round(Math.random() * (height - radius * 2) + radius)
  };
});

var color = d3.scaleOrdinal()
    .range(d3.schemeCategory20);

svg.selectAll("circle")
  .data(circles)
  .enter().append("circle")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", radius)
    .style("fill", function(d, i) { return color(i); })
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

function dragstarted(d) {
  d3.select(this).raise().classed("active", true);
}

function dragged(d) {
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
  d3.select(this).classed("active", false);
}
