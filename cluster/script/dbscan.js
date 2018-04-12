
function dbscan_clustering(data,type){

    dbscan_state.phase = "inprogress";
    
    algo_delay = 0;

    process = setInterval(function() {
        dbscan_iter(data,type);
        d3.select(".svg_topics").selectAll(".datapoints")
        // .transition()
        .style("fill", function(d,i) { 
            d.cluster = data[i].cluster;
            if (data[i].cluster == 0){
            return "black";
            }else{
            return colors(data[i].cluster); 
            }
        });
    }, delay);

}

function region_query(data, x, eps) {
    var res = new Array();

    search_s = 0;
    search_e = data.length;

    
    for(var i = search_s; i < search_e; i++) {
        if(Math.abs(data[i].distance-x.distance) < eps) {  // if(Math.abs(data[i].distance-x.distance) < eps) {
            res.push(data[i]);
        }
    }
    return res;
}


function region_query_nominal(data, x, eps) {
    var res = new Array();

    search_s = 0;
    search_e = data.length;

    for(var i = search_s; i < search_e; i++) {


        if (data[i].topic != x.topic){
            topic_dist = 1
        }else{ 
            topic_dist = 0;
        }

        if((Math.abs(data[i].distance-x.distance) + topic_dist) < eps) {  // if(Math.abs(data[i].distance-x.distance) < eps) {
            res.push(data[i]);
        }
    }
    return res;
}



function dbscan_iter(data,type) {

    if(dbscan_state.neigh.length == 0) {
        var index = dbscan_state.index; 
        while(index < data.length && data[index].cluster != 0){
            index += 1;
        }
        if(index == data.length) {
            dbscan_state.index = index;
            clearInterval(process);  // stop wasteful computation
            process = null;
            dbscan_state.phase = "done";
            console.log("--------------- done! ", dbscan_state.cluster ," clusters")
            return;
        }
        dbscan_state.index = index + 1;
        var z = data[index];

        var neigh;
        if (type == 0) {
            neigh = region_query(data, z, dbscan_state.eps);
        }else {
            neigh = region_query_nominal(data, z, dbscan_state.eps);
        }  

        if(neigh.length >= dbscan_state.minPoints) {
            dbscan_state.cluster += 1;
            console.log("clusters!")
            for(var j = 0; j < neigh.length; j++) {
                neigh[j].cluster = dbscan_state.cluster;
                if(neigh[j] != z) {
                    dbscan_state.neigh.push(neigh[j]);
                }
            }
        }
    }

    else {
        var z = dbscan_state.neigh.shift();

        var neigh
        if (type == 0) neigh = region_query(data, z, dbscan_state.eps);
        else neigh = region_query_nominal(data, z, dbscan_state.eps);      

        if(neigh.length >= dbscan_state.minPoints) {
            for(var j = 0; j < neigh.length; j++) {
                if(neigh[j].cluster != dbscan_state.cluster) {
                    neigh[j].cluster = dbscan_state.cluster;
                    dbscan_state.neigh.push(neigh[j]);
                }
            }
        }
    }
}

