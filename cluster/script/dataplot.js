
//---------------------------------- Top View --------------------
d3.select("div#chart1")
   .append("div")
   .classed("svg-container", true) //container class to make it responsive
   .append("svg")  //canvas
   .attr("class", "svg_data")
   //responsive SVG needs these 2 attributes and no width and height attr
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 600 600")  
   //class to make it responsive
   .classed("svg-content-responsive", true); 

//---------------------------------- Responsive SVG --------------------
// var svg_data = d3.select(".svg_data");
    radius = 10;
    var ratio = 25       // Aspect ratio starts with 100 25
    var width = 1200;
    var height = 1200 * ratio / 100;
    
    down_height = 1200 * 0.25;
    // height = down_height

    d3.select(".svg-container").style("padding-bottom", ratio+"%");
    // d3.select(".svg_data").attr("width", width).attr("height", height);
    // d3.select(".svg_data").attr("viewBox","0 0 " + width + " " + height);

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
            // console.log("ratio ", ratio)
            updateWindow_top()
        }

        height = 1200 * ratio / 100;
        d3.select(".svg_data").attr("viewBox","0 0 " + width + " " + height)
        
    }

    d3.select(window).on('resize.updatesvg', updateWindow_top);



      // ---------- Border around the view ---------- 
    d3.select(".svg_data").append("rect")
            .attr("class","zoom_rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("height", height)
            .attr("width", width)
            .style("stroke", "gray")
            .style("fill", "#f0f0f5")
            .style("fill-opacity", 0.1)
            .style("stroke-width", 2)
    
         console.log("W: ", width, "H: ", height)
         tsne_width = width;
         tsne_height = height * 4;

     const margin = 40;
            scalepop = d3.scaleSqrt().domain([0, 100000]).range([0.2, 24])
            scalecountry = d3.scaleOrdinal(d3.schemeCategory20b)
            centerx = d3.scaleLinear()
            .range([tsne_width / 2 - tsne_height / 2 + margin, tsne_width / 2 + tsne_height / 2 - margin])
        centery = d3.scaleLinear()
            .range([margin, height - margin]);


     function zoomed_up() {
        // xz_scale = d3.event.transform.rescaleX(x_scale);
        // xz_scale = d3.event.transform.rescaleX(y_scale);
        // svg_topics.selectAll(".docs").attr('transform', d => `translate(${d.x},${d.y})`); // .attr("cx", function(d){return xz_scale(d.Time); });
         svg_topics.selectAll(".docs").attr("transform", d3.event.transform);
        // svg_topics.selectAll(".docs")attr("transform", d3.event.transform)
          // svg_topics.selectAll(".docs").attr("transform", d3.event.transform);

      }

    var zoom_up = d3.zoom()
        .scaleExtent([1, 20])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomed_up);
