
//---------------------------------- Bottom View --------------------
d3.select("div#chart2")
   .append("div")
   .classed("svg2-container", true)
   // d3.select(".svg2-container")
   .append("svg")
   .attr("class", "svg_topics")
   //responsive SVG needs these 2 attributes and no width and height attr
   .attr("preserveAspectRatio", "xMinYMin meet")
   .attr("viewBox", "0 0 600 600")
   //class to make it responsive
   .classed("svg2-content-responsive", true); 
//---------------------------------- Responsive SVG + X-Zoom --------------------

     function zoomed() {
        xz_scale = d3.event.transform.rescaleX(x_scale);
        svg_topics.selectAll(".datapoints").attr("cx", function(d){return xz_scale(d.Time); });
        svg_topics.selectAll(".time_lapse").attr("x", function(d){return xz_scale(d);});

      }

    var zoom = d3.zoom()
        .scaleExtent([1, 10])
        .translateExtent([[0, 0], [width, height]])
        .extent([[0, 0], [width, height]])
        .on("zoom", zoomed);

    var svg_topics = d3.select(".svg_topics").call(zoom);

    radius = 10;
    var width = 1200;
    var height = 1200 * ratio / 100;

    d3.select(".svg_topics").attr("viewBox","0 0 " + width + " " + height)
    d3.select(".svg2-container").style("padding-bottom", ratio+"%") 
    // updateWindow_down();
    
    
    function updateWindow_down(){
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight|| e.clientHeight|| g.clientHeight;
        down_height = 1200 * ratio / 100; 
        d3.select(".svg2-container").style("padding-bottom", ratio+"%") 
        d3.select(".svg_topics").attr("viewBox","0 0 " + width + " " + down_height)
    }

    d3.select(window).on('resize.updatesvg', updateWindow_down);

//---------------------------------- Input Elements --------------------

    d3.select("#topic_time_slider").on("input", function() {
      time_weight = +this.value;
      // console.log("time_weight", time_weight)
      distanceFunction();
    });

    d3.selectAll(".checkmark_container").on("change", function() {
      check_mark = +this.value;
      // console.log("time_weight", check_mark)
    });

    
    d3.selectAll(".radio_container").on("change", function(d, i) {  
      topic_num = d3.select('input[name="topics_radio"]:checked').property("value");
      dataset = d3.select('input[name="dataset_radio"]:checked').property("value");
      participant = d3.select('input[name="user_radio"]:checked').property("value");
      console.log(" ", topic_num," ", dataset, " ", participant)
      init();
    });

//---------------------------------- View Elements and Variables --------------------


    var topic_num = 6; dataset = "armsdealing"; participant = "P1"
    var time_weight = 100, topic_weight = 0, action_weight = 400, cluster_weight = 20;
    var each_time_sec;
    var points_size = 10;
    var Axis_room = 50;
    var max_y = topic_num + 1; // total number of topics + 2;

    var colors = d3.scaleOrdinal()
                  .range(d3.schemeCategory10);

    var dataXRange = {min: 0, max: 6000};
    var dataYRange = {min: 0, max: max_y};

    var x_scale = d3.scaleLinear()
        .domain([dataXRange.min, dataXRange.max])
        .range([points_size, width - points_size]);

    var y_scale = d3.scaleLinear()
      .domain([dataYRange.min, dataYRange.max])
      .range([height - points_size, 0 + points_size]);

    d3.selection.prototype.moveToBack = function() {
        return this.each(function() {
            var firstChild = this.parentNode.firstChild;
            if (firstChild) {
                this.parentNode.insertBefore(this, firstChild);
            }
        });
    };
  
    d3.selection.prototype.moveToFront = function() {
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };    

   

      // ---------- Border around the view ----------
    d3.select(".svg_topics").append("rect")
            .attr("class","zoom_rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("height", height)
            .attr("width", width)
            .style("stroke", "gray")
            .style("fill", "#f0f0f5")
            .style("fill-opacity", 0.1)
            .style("stroke-width", 2)

    init();

    function init(){
    // d3.select(".svg2").remove();

    d3.json("cluster/data/Dataset_1/Topic_Events_Provenance/Arms_P8_timetopics_6.json", function(jsondata) {
      
      dataXRange.min = 0 
      dataXRange.max = d3.max(jsondata, function(d) { return d.Time; }) * 1.00;
      
      x_scale = d3.scaleLinear().domain([dataXRange.min, dataXRange.max]).range([points_size, width - points_size]);

      // Finding the maximum duration of documents reading time 
      dur_max = d3.max(jsondata, function(d) { if (d.InteractionType == "reading_document") {return d.Duration;}else{return 0;} })
      dur_min = d3.min(jsondata, function(d) { if (d.InteractionType == "reading_document") {return d.Duration;}else{return 1000;} })
      
      full_jsondata = minor_topics(jsondata);

      var json_length = Object.keys(jsondata).length;

      d3.select(".svg_topics").selectAll(".datapoint").data(jsondata).enter().append("circle")
        .attr("class","datapoints")
        .attr("cx", function(d){return x_scale(d.Time);})
        .attr("cy", function(d){
                // if ((d.InteractionType == "highlight") | (d.InteractionType == "bookmark_highlights") | (d.InteractionType == "create_note") | (d.InteractionType == "writing_notes") | (d.InteractionType == "connection")) {
                 temp = [];
                 for (var ii=0; ii<d.ClassNum.length; ii++){
                    temp2 = d.ClassNum[ii];
                    temp.push(temp2[1])
                 }
                  d.y = 1 + d3.scan(temp, function(a, b) { return b - a; })   // maximum index;
                  d.topic = d.y - 1;
                  d.value = d3.max(temp)   // value;

                  return y_scale(d.y); 
                  })
        .attr("r",function(d){ return points_size;})
        .style("stroke","none")
        .attr("fill",function(d, i) { return colors(d.y); })
        .style("fill-opacity",  function(d){ return 1.0; });

     
      // ------------- Generating time laps --------------          
      var time_lapse_dur = dataXRange.max / 20;  // 20 in total 

      var time_lapse_data = d3.range(20).map(function(i) {
                        // return { time: i * time_lapse_dur };
                        return i * time_lapse_dur;
                      });

      time_lapse = svg_topics.selectAll(".time_lapse").data(time_lapse_data).enter()
        .append("rect")
        .attr("class","time_lapse")
        .attr("x", function(d) {return x_scale(d);}) 
        .attr("y", height - 10)
        .attr("width", 2)
        .attr("height", 10)
        .attr("fill", "red");
        

      // topicDistance(jsondata);
      
      // distanceFunction();     // define distance value for datapoints 
        
      // updateWindow()
      
      // -------------- Animated zoom in ---------------
      var d0 = 0; 
          d1 = 4000; 

      svg_topics.transition().duration(150)
      .call(zoom.transform, d3.zoomIdentity
          .scale(width / (x_scale(d1) - x_scale(d0)))
          .translate(-x_scale(d0), 0));                      
      
    });   //  --------- End of data loop -----------


      // ------------- Generating timelines --------------          

      var time_line_data = d3.range(topic_num).map(function(i) {
                  return (i + 1);
                });

      time_line = svg_topics.selectAll(".time_line").data(time_line_data).enter().append("line")
                     .attr("class","time_line")
                     .attr("stroke-dasharray", ("3, 3"))
                     .attr("stroke","gray")
                     .attr("height", 2)
                     .attr("x1", 0) 
                     .attr("y1", function(d) {return y_scale(d);})
                     .attr("x2", width)    
                     .attr("y2", function(d) {return y_scale(d);})

   }

function minor_topics(){


}
function distanceFunction() {

console.log("I'm here!@ ")

}