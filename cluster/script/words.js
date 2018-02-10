

d3.select("div#chart2")
   .append("div")
   .classed("svg2-container", true) //container class to make it responsive
   .append("svg")
   .attr("class", "svg2")
   //responsive SVG needs these 2 attributes and no width and height attr
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 600 600")
   //class to make it responsive
   .classed("svg2-content-responsive", true); 

var svg = d3.select(".svg2");
    // width = +svg.attr("width"),
    // height = +svg.attr("height"),
    radius = 32;
    // Aspect ratio is 100 25
    var width = 600;
    var height = 600 * 0.25 * (1/0.6);
    console.log("old", ratio)
    
    d3.select(".svg2").attr("viewBox","0 0 " + width + " " + height)

    d3.select(".svg2").append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("height", height -1 )
            .attr("width", width)
            .style("stroke", "black")
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

d3.select(".svg2").selectAll("circle")
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
