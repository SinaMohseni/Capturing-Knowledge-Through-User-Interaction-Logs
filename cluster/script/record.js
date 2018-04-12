

function prov_record(full_jsondata, cluster_no){
    
      // init_record();
      console.log("cluster_no", cluster_no)

      d3.select(".svg_record").selectAll(".record_points").remove();

      var copy_data = JSON.parse(JSON.stringify(full_jsondata));
      
      filtered_data = copy_data.filter(function(d) { 
           return ((d.cluster == cluster_no) & (d.InteractionType == "open_document" | d.InteractionType == "reading_document" | d.InteractionType == "search" | d.InteractionType == "highlight" | d.InteractionType == "create_note" | d.InteractionType == "writing_notes"));
      }) ///| d.InteractionType == "moving_document"


      dataXRange_record.min = filtered_data[0].Time;
      dataXRange_record.max = d3.max(filtered_data, function(d) { return d.Time; }) * 1.00;

      zone_s = dataXRange_record.min;
      zone_e = dataXRange_record.max;

      // console.log("Time Range",dataXRange_record.min, dataXRange_record.max)

      x_scale_record = d3.scaleLinear().domain([dataXRange_record.min, dataXRange_record.max]).range([2*icon_size, width - 2*icon_size]);
      y_scale_record = d3.scaleLinear().domain([dataYRange_record.min, dataYRange_record.max]).range([height - icon_size, 0 + icon_size]);

      // Finding the maximum duration of documents reading time 
      dur_max = d3.max(filtered_data, function(d) { if (d.InteractionType == "reading_document") {return d.Duration;}else{return 0;} })
      dur_min = d3.min(filtered_data, function(d) { if (d.InteractionType == "reading_document") {return d.Duration;}else{return 1000;} })

      records = d3.select(".svg_record").selectAll(".record_points")
                    .data(filtered_data).enter()
                    .append("image")  //.append("circle")
                    .attr("class","record_points")
                    // .attr("cx", function(d){return x_scale_record(d.Time);})
                    // .attr("cy", function(d){return y_scale_record(8);})
                    // .attr("r",function(d){ return v_scale(d.value) ;})
                    .attr("x", function(d){return x_scale_record(d.Time);})
                    .attr("y", function(d){return y_scale_record(8);})
                    .attr('xlink:href',function(d){
                    svgfile = d.InteractionType
                    if (svgfile.split("")[0] == "f") {
                        svgfile = ""
                    }
                    return "./cluster/style/"+ svgfile + ".svg";}
                    ) 
                    .attr('height', icon_size)
                    .attr('width', icon_size)
                    // .style("stroke","black")
                    // .attr("fill",function(d, i) { return colors(d.cluster); })
                    // .style("fill-opacity",  function(d){ return 0.9; })
                    .on("mouseover", function(d) { 
                      tooltip_top.style("display", null); 
                      if (d.InteractionType == "search" | d.InteractionType == "highlight" | d.InteractionType == "create_note" | d.InteractionType == "writing_notes"){
                        var message = d.InteractionType + " : " +d.tags + "      Time: "+ d.Time;
                      }else{
                        var message = d.InteractionType + " : " +d.DocNum + "     Time: "+ d.Time;
                      }
                      message_width = getWidthOfText(message, "sans-serif", "16px")
                      tooltip_top.select("rect").attr("width", message_width*1.1)
                      tooltip_top.select("text").text(message);
                    })
                    .on("mouseout", function() { tooltip_top.style("display", "none"); })
                    .on("mousemove", function(d) {
                          
                          tooltip_top.select("rect").attr("x", -0.55*message_width) 
                          tooltip_top.select("text").attr("x", -0.5*message_width)              
                          
                          var xPosition = d3.mouse(this)[0] - 5;
                          var yPosition = d3.mouse(this)[1] - 40;

                          if (xPosition + message_width/2 > width){
                            xPosition -= ((xPosition + message_width/2) - width + 20)
                            
                          }else if (xPosition - message_width/2 < 0){
                            xPosition += (message_width/2 - xPosition + 20)
                          }
                          tooltip_top.attr("transform", "translate(" + xPosition + "," + yPosition + ")");                   
                    });

            return [zone_s,zone_e]

}



// records.append("g").selectAll(".pattIcon") 
//                 .data(makeData2).enter().append('image')
//                 .attr("class", "pattern_icon")
//                 .each(function(d){  //  (d.source.y > d.target.y) & 
//                         if (( (highlightInteract == d.InteractionType) || (noteInteract == d.InteractionType) ||  (searchInteract == d.InteractionType) || (ceartNoteInteract == d.InteractionType) || (openDocInteract == d.InteractionType) ) ) {
//                             d.isSel = true;
//                             // console.log("+++++++++++++", d.InteractionType)
//                         } else if (d.InteractionType.split("")[0] == "f") {
//                             // console.log("+++++++++", d.InteractionType)
//                             d.isSel = false;
//                             d3.select(this).remove();
//                         } else {
//                             // console.log("---------", d.InteractionType)
//                             d.isSel = false;
//                             d3.select(this).remove();
//                         }

//                 })
//                 .attr('xlink:href',function(d){
//                     svgfile = d.InteractionType
//                     if (svgfile.split("")[0] == "f") {
//                         svgfile = ""
//                     }
//                     return "./prov/styles/"+ svgfile + ".svg";}
//                     ) 
//                 .attr('height', '30')
//                 .attr('width', '30')