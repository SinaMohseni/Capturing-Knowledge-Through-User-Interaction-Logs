

      function draw(full_jsondata){

      // var json_length = Object.keys(full_jsondata).length;

      // console.log(Object.keys(full_jsondata).length)

      var message_width;
      d3.select(".svg_topics").selectAll(".datapoints").data(full_jsondata).enter().append("circle")
        .attr("class","datapoints")
        .attr("cx", function(d){return x_scale(d.Time);})
        .attr("cy", function(d){return y_scale(d.y);})
        .attr("r",function(d){ return v_scale(d.value) ;}) //(points_size * d.value);})
        .style("stroke","none")
        .attr("fill",function(d, i) { return colors(d.topic); })
        .style("fill-opacity",  function(d){ return 0.7; })
        .on("mouseover", function(d) { 
          tooltip.style("display", null); 
          if (d.InteractionType == "search" | d.InteractionType == "highlight" | d.InteractionType == "create_note" | d.InteractionType == "writing_notes"){
            var message = d.InteractionType + " : " +d.tags + "      Time: "+ d.Time;
          }else{
            var message = d.InteractionType + " : " +d.DocNum + "     Time: "+ d.Time;
          }
          message_width = getWidthOfText(message, "sans-serif", "16px")
          tooltip.select("rect").attr("width", message_width*1.1)
          tooltip.select("text").text(message);
        })
        .on("mouseout", function() { tooltip.style("display", "none"); })
        .on("mousemove", function(d) {
              
              tooltip.select("rect").attr("x", -0.55*message_width) 
              tooltip.select("text").attr("x", -0.5*message_width)              
              
              var xPosition = d3.mouse(this)[0] - 5;
              var yPosition = d3.mouse(this)[1] - 40;

              if (xPosition + message_width/2 > width){
                xPosition -= ((xPosition + message_width/2) - width + 20)
                
              }else if (xPosition - message_width/2 < 0){
                xPosition += (message_width/2 - xPosition + 20)
              }
              tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");                   
        })
        .on("click", function(d){
          if (dbscan_state.cluster > 0) choose_segment(d); // show zone and details if clustering is done
          
        });

        
      // ------------- Generating time laps --------------          
   // var time_lapse_dur = dataXRange.max / 20;  // 20 in total 
      time_lapse_dur = 5 * 60;

      var time_lapse_data = d3.range(20).map(function(i) {
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

      svg_topics.selectAll(".time_lapse2").data(time_lapse_data).enter()
        .append("rect")
        .attr("class","time_lapse2")
        .attr("x", function(d) {return x_scale(d);}) 
        .attr("y", 0)
        .attr("width", 2)
        .attr("height", 10)
        .attr("fill", "red");

      // topicDistance(jsondata);
      
      // distanceFunction();     // define distance value for datapoints 
        
      // updateWindow()
      
      // -------------- Animated zoom in ---------------
      var d0 = 0; 
          d1 = 5000; 

      svg_topics.transition().duration(150)
      .call(zoom.transform, d3.zoomIdentity
          .scale(width / (x_scale(d1) - x_scale(d0)))
          .translate(-x_scale(d0), 0));                      

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

      d3.select(".svg_topics").selectAll(".tooltip").moveToFront();
      d3.select(".svg_topics").selectAll(".time_line").moveToBack();
   }  // End of Draw();




function getWidthOfText(txt, fontname, fontsize){
    if(getWidthOfText.c === undefined){
        getWidthOfText.c=document.createElement('canvas');
        getWidthOfText.ctx=getWidthOfText.c.getContext('2d');
    }
    getWidthOfText.ctx.font = fontsize + ' ' + fontname;
    return getWidthOfText.ctx.measureText(txt).width;
}

function choose_segment(d){

  prov_record(full_jsondata, d.cluster); 

  svg_topics.select(".zone").remove();

  svg_topics.append("rect")
    .attr("class","zone")
    .attr("x", (xz_scale(zone_s) - points_size/2))  // this_zone[0]
    .attr("width", (xz_scale(zone_e) - xz_scale(zone_s) + points_size))
    .attr("y", function(){
      console.log('Mode: ', dbscan_state.mode, topic_num, y_scale(topic_num-2),y_scale(topic_num-1), y_scale(topic_num), y_scale(topic_num+1))
      if (dbscan_state.mode == "time") return (y_scale(topic_num+1-0.3));// + y_scale(0.5));  //+0.5
      else return y_scale((d.topic + 1 - 0.5))
    })            
    .attr("height", function(){            //    , 400)
      if (dbscan_state.mode == "time") return y_scale(1 - 0.3);
      else return y_scale(topic_num + 0.1);
    })       
    .attr("fill", colors(d.cluster))
    .attr("opacity", 0.6)
    .attr("rx", 7) 
    .attr("ry", 7);

  svg_topics.select(".zone").moveToBack();
}