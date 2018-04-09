
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


    d3.csv('./cluster/cities.csv', function (cities) {

        const data = cities
            .sort((a, b) => d3.descending(+a[2015], +b[2015]))
            .map((d, i) => {
              return {
                lon: +d.Longitude,
                lat: +d.Latitude,
                name: d['Urban Agglomeration'],
                r: scalepop(+d[2015]),
                color: scalecountry(+d['Country Code'])
              };
            })
            .slice(0, 800);

         const svg = d3.select(".svg_data").call(zoom_up);
      
        // pos is the array of positions that will be updated by the tsne worker
        // start with the geographic coordinates as is (plate-carrée)
        // random or [0,0] is fine too
        let pos = data.map(d => [d.lon, -d.lat]);


        const forcetsne = d3.forceSimulation(
          data.map(d => (d.x = tsne_width / 2, d.y = tsne_height / 2, d))
        )
            .alphaDecay(0.005)
            .alpha(0.1)
            .force('tsne', function (alpha) {

                centerx.domain(d3.extent(pos.map(d => d[0]))); 
                centery.domain(d3.extent(pos.map(d => d[1])));

                data.forEach((d, i) => {
                    d.x += alpha * (centerx(pos[i][0]) - d.x);
                    d.y += alpha * (centery(pos[i][1]) - d.y);
                });
            })
            .force('collide', d3.forceCollide().radius(d => 1.5 + d.r))
            .on('tick', function () {

             drawsvg(svg, data);

            });

        function drawsvg(svg, nodes) {
          const g = svg.selectAll('g.city')
          .data(nodes);
          
          var enter = g.enter().append('g').classed('city', true);

          enter.append('circle')
          .attr('r', d => d.r)
          .attr("class", "docs")
          .attr('fill', d => d.color)
          .append('title')
          .text(d => d.name); 
          
          // enter
          // .filter(d => d.r > 7)
          // .append('text')
          // .attr('fill', 'white')
          // .attr("class", "docs")
          // .style('font-size', d => d.r > 9 ? '12px' : '9px')
          // .attr('text-anchor', 'middle')
          // .attr('dominant-baseline', 'middle')
          // .attr('pointer-events', 'none')
          // .text(d => d.name.substring(0,2));
          
          g.attr('transform', d => `translate(${d.x},${d.y})`);

        }

      
        d3.queue()
            .defer(d3.text, 'cluster/script/tsne.js')
            .defer(d3.text, 'https://unpkg.com/d3-geo')
            .defer(d3.text, 'cluster/script/worker.js')
            .awaitAll(function (err, scripts) {

                  const worker = new Worker(
                    window.URL.createObjectURL(
                      new Blob(scripts, {
                        type: "text/javascript"
                      })
                    )
                  );
                
                worker.postMessage({
                    maxIter: 10,
                    dim: 2,
                    perplexity: 30.0,
                    data: data
                });

                worker.onmessage = function (e) {
                  if (e.data.log) console.log.apply(this, e.data.log);
                  if (e.data.pos) pos = e.data.pos;
                  if (e.data.done && e.data.done < 10000  && e.data.cost > 1e-2) {
                    worker.postMessage({
                          maxIter: e.data.done + 10,
                    });
                  }
                };
              });
});