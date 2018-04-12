
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
    
     var tooltip = d3.select(".svg_topics")
        .append("g")
        .attr("class", "tooltip")
        .style("display", "none");

        tooltip.append("rect")
        .attr("width", 60)
        .attr("height", 30)
        .attr("rx",6)
        .attr("ry",6)
        .attr("fill", "black")
        .style("opacity", 0.6);

        tooltip.append("text")
        .attr("x", 30)
        .attr("dy", "1.2em")
        // .style("text-anchor", "middle")
        .attr("fill","white")
        .attr("font-size", "16px")
        .attr("font-weight", "bold");

     var xz_scale;
     function zoomed() {
        xz_scale = d3.event.transform.rescaleX(x_scale);
        svg_topics.selectAll(".datapoints").attr("cx", function(d){return xz_scale(d.Time); });
        svg_topics.selectAll(".time_lapse").attr("x", function(d){return xz_scale(d);});
        svg_topics.selectAll(".time_lapse2").attr("x", function(d){return xz_scale(d);});

        svg_topics.select(".zone").attr("x", (xz_scale(zone_s) - points_size/2));
        svg_topics.select(".zone").attr("width",(xz_scale(zone_e) - xz_scale(zone_s) + points_size/2));
      }

    var zoom = d3.zoom()
        .scaleExtent([1, 20])
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
    
    var full_jsondata = []
    // var data = [];

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
    var check_marks = {reading_document: true , open_document: true, highlight: true, brush_document_title: false, search: true, connect: false, bookmark_highlights: false,writing_notes: true,create_note:false};
    var sliders = {time:50, topic: 60, time_topic: 60, action: 30, activity: 30};
    // var time_weight = 50, topic_weight = 60, time_topic_weight = 60, action_weight = 30, activity_weight = 30;

    d3.select("#time_slider").on("input", function() {time_weight = +this.value;});
    d3.select("#topic_slider").on("input", function() {topic_weight = +this.value;});
    d3.select("#time_topic_slider").on("input", function() {time_topic_weight = +this.value;});
    d3.select("#action_slider").on("input", function() {action_weight = +this.value;});
    d3.select("#activity_slider").on("input", function() {activity_weight = +this.value;});


    d3.selectAll(".checkmark_container").on("change", function(d, i) {  
      d3.select("input[value=read]").on("change", function() {check_marks.reading_document = this.checked;});
      d3.select("input[value=open]").on("change", function() {check_marks.open_document = this.checked;});
      d3.select("input[value=highlight]").on("change", function() {check_marks.highlight = this.checked;});
      d3.select("input[value=brush]").on("change", function() {check_marks.brush_document_title = this.checked;});
      d3.select("input[value=search]").on("change", function() {check_marks.search = this.checked;});
      d3.select("input[value=connect]").on("change", function() {check_marks.connect = this.checked;});
      d3.select("input[value=bookmark]").on("change", function() {check_marks.bookmark_highlights = this.checked;});
      d3.select("input[value=write]").on("change", function() {check_marks.writing_notes = this.checked;});
      d3.select("input[value=new]").on("change", function() {check_marks.create_note = this.checked;});
      
      init();
    });
    
    d3.selectAll(".radio_container").on("change", function(d, i) {  
      topic_num = parseInt(d3.select('input[name="topics_radio"]:checked').property("value"));
      dataset = d3.select('input[name="dataset_radio"]:checked').property("value");
      participant = d3.select('input[name="user_radio"]:checked').property("value");
      
      init();
    });

//---------------------------------- View Elements and Variables --------------------

    var topic_num = 6; dataset = "Arms"; participant = "P1"
    var each_time_sec;
    var points_size = 10;
    var Axis_room = 50;

    var dbscan_state = {mode:"time", eps: 50, minPoints: 4, cluster: 0, index: 0, neigh: [], phase: "choose"};

    var colors = d3.scaleOrdinal()
                  .range(d3.schemeCategory10);

    var dataXRange = {min: 0, max: 6000};
    var dataYRange = {min: 0, max: (topic_num + 1)};
    var zone_s = 0;
    var zone_e = 0;
    var x_scale = d3.scaleLinear()
        .domain([dataXRange.min, dataXRange.max])
        .range([points_size, width - points_size]);

    var y_scale = d3.scaleLinear()
      .domain([dataYRange.min, dataYRange.max])
      .range([height - points_size, 0 + points_size]);

    var v_scale = d3.scaleLinear().domain([0, 1.0]).range([2, 10]);

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

      removeNclear();
      

      full_jsondata = []
        

      dbscan_state = {eps: 50, minPoints: 4, cluster: 0, index: 0, neigh: [], phase: "choose"};
      // data = [];
        
      new_json = []
      

      d3.json("cluster/data/Dataset_"+dataset+"/Topic_Events_Provenance/"+dataset.toString()+"_"+participant.toString()+"_timetopics_"+topic_num.toString()+".json", function(jsondata) {

        dataXRange.min = 0;
        dataXRange.max = d3.max(jsondata, function(d) { return d.Time; }) * 1.00;
        dataYRange.max = parseInt(topic_num) + 1;

        x_scale = d3.scaleLinear().domain([dataXRange.min, dataXRange.max]).range([points_size, width - points_size]);
        y_scale = d3.scaleLinear().domain([dataYRange.min, dataYRange.max]).range([height - points_size, 0 + points_size]);

        // Finding the maximum duration of documents reading time 
        dur_max = d3.max(jsondata, function(d) { if (d.InteractionType == "reading_document") {return d.Duration;}else{return 0;} })
        dur_min = d3.min(jsondata, function(d) { if (d.InteractionType == "reading_document") {return d.Duration;}else{return 1000;} })
        

        new_json = JSON.parse(JSON.stringify(jsondata));
        full_jsondata = minor_topics(new_json);
        draw(full_jsondata)
      });   //  --------- End of jsondata loop -----------


      }  //  --------- End of Init() -----------




function minor_topics(jsondata){

      var new_jsondata = []

      // for (j=0;j<Object.keys(jsondata).length;j++){    // Copy jsondata into a new array
      //   full_jsondata.push(jsondata[j])
      // }
      // console.log(Object.keys(jsondata).length , jsondata)      

      index_counter = 0
      jsondata
      .filter(function(d){
        return (check_marks[d.InteractionType] == true)
      })
      .forEach(function(d,i){

                 temp = [];
                 for (var ii=0; ii<d.ClassNum.length; ii++){
                    temp2 = d.ClassNum[ii];
                    temp.push(temp2[1])
                 }

                index_ = d3.scan(temp, function(a, b) { return b - a; })   // maximum index;
                this_topic = d.ClassNum[index_][0]
                
                for (var ii=0; ii<d.ClassNum.length; ii++){
                    temp2 = d.ClassNum[ii];
                    new_jsondata.push({"DocNum":d.DocNum,"tags": d.tags,"y":temp2[0],"value":temp2[1],"topic": this_topic,"Time": d.Time, "InteractionType": d.InteractionType, cluster: 0, itr_index: index_counter})
                    index_counter +=1
                }
      })  // End of forEach loop ----------

      return(new_jsondata)

}   //------------- End of minor_topics();

function removeNclear(){

      d3.select(".svg_topics").selectAll(".datapoints").remove();
      d3.select(".svg_topics").selectAll(".time_lapse").remove();
      d3.select(".svg_topics").selectAll(".time_lapse2").remove();
      d3.select(".svg_topics").selectAll(".time_line").remove();
      d3.select(".svg_record").selectAll(".record_points").remove();
      svg_topics.select(".zone").remove();
      dbscan_state.minPoints = 4;
      dbscan_state.cluster = 0;
      dbscan_state.index = 0;
      dbscan_state.phase = "choose";
      dbscan_state.neigh = [];
}