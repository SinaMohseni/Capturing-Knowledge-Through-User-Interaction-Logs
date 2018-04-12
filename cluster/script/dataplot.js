
//---------------------------------- Top View --------------------
d3.select("div#chart1")
   .append("div")
   .classed("svg-container", true) //container class to make it responsive
   .append("svg")  //canvas
   .attr("class", "svg_record")
   //responsive SVG needs these 2 attributes and no width and height attr
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 600 600")  
   //class to make it responsive
   .classed("svg-content-responsive", true); 

//---------------------------------- Responsive SVG --------------------
// var svg_record = d3.select(".svg_record");
    radius = 10;
    var ratio = 25       // Aspect ratio starts with 100 25
    var width = 1200;
    var height = 1200 * ratio / 100;
    
    down_height = 1200 * 0.25;
    // height = down_height

    d3.select(".svg-container").style("padding-bottom", ratio+"%");
    // d3.select(".svg_record").attr("width", width).attr("height", height);
    // d3.select(".svg_record").attr("viewBox","0 0 " + width + " " + height);

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

        if ((ratio < 80) & ( (w.innerHeight - (g.clientHeight * 2)) > 50)) {
            ratio = ratio+1;
            d3.select(".svg-container").style("padding-bottom", ratio+"%") 
            updateWindow_top()
        }

        if ((ratio > 1) & ( ((g.clientHeight * 2) - w.innerHeight) > 20)) {
            ratio = ratio-0.5;
            d3.select(".svg-container").style("padding-bottom", ratio+"%") 
            updateWindow_top()
        }

        height = 1200 * ratio / 100;
        d3.select(".svg_record").attr("viewBox","0 0 " + width + " " + height)
        
    }


    d3.select(window).on('resize.updatesvg', updateWindow_top);


     var tooltip_top = d3.select(".svg_record")
        .append("g")
        .attr("class", "tooltip")
        .style("display", "none");

        tooltip_top.append("rect")
        .attr("width", 60)
        .attr("height", 30)
        .attr("rx",6)
        .attr("ry",6)
        .attr("fill", "black")
        .style("opacity", 0.6);

        tooltip_top.append("text")
        .attr("x", 30)
        .attr("dy", "1.2em")
        // .style("text-anchor", "middle")
        .attr("fill","white")
        .attr("font-size", "16px")
        .attr("font-weight", "bold");

    var dataXRange_record = {min: 0, max: 6000};
    var dataYRange_record = {min: 0, max: 10};
    var icon_size = 30;

    var x_scale_record = d3.scaleLinear()
    var y_scale_record = d3.scaleLinear()

    var records;

      // ---------- Border around the view ---------- 
    d3.select(".svg_record").append("rect")
            .attr("class","zoom_rect_up")
            .attr("x", 0)
            .attr("y", 0)
            .attr("height", height)
            .attr("width", width)
            .style("stroke", "gray")
            .style("fill", "#f0f0f5")
            .style("fill-opacity", 0.1)
            .style("stroke-width", 2)




     function zoomed_up() {
        xz_scale = d3.event.transform.rescaleX(x_scale_record);
        svg_record.selectAll(".record_points").attr("x", function(d){return xz_scale(d.Time); });
        // svg_record.selectAll(".time_lapse").attr("x", function(d){return xz_scale(d);});

      }

    var zoom_up = d3.zoom()
        .scaleExtent([1, 20])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomed_up);

    var svg_record = d3.select(".svg_record").call(zoom_up);


          // -------------- Animated zoom in ---------------
      var d0 = 0; 
          d1 = 5000; 

      svg_record.transition().duration(150)
      .call(zoom_up.transform, d3.zoomIdentity
          .scale(width / (x_scale_record(d1) - x_scale_record(d0)))
          .translate(-x_scale_record(d0), 0));   

    // function init_record(){

    // }  //  --------- End of Init() -----------