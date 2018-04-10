// var data = [];
var dbscan_state = {eps: 50, minPoints: 4, cluster: 0, index: 0, neigh: [], phase: "choose"};
var delay;
var process = null; // For setInterval



// Below functions all read full_jsondata
// Distance is based on Time here 
function time_clustering(){   

    dbscan_state.eps = time_weight;
    // clone logs
    temp_json = []
    temp_json = JSON.parse(JSON.stringify(full_jsondata));
    var data = []

    temp_json.forEach(function(d,i){
        data.push({"value": d.value, distance: d.Time, cluster: 0})  // itr_index: index_counter  (1/topic_num)
    });

    console.log("data: ", data.length)
    interaction_clustering(data,0)

}

function activity_clustering(){   

    dbscan_state.eps = activity_weight;
    // clone logs
    temp_json = []
    temp_json = JSON.parse(JSON.stringify(full_jsondata));
    var data = []

    temp_json.forEach(function(d,i){
        data.push({"value": d.value, distance: d.Time, cluster: 0})  // itr_index: index_counter  (1/topic_num)
    });

    console.log("data: ", data.length)
    interaction_clustering(data,0)

}


// Distance is based on Topic here
function topic_clustering1(){

    dbscan_state.eps = topic_weight/100;
    // clone logs
    var temp_json = []
    var temp_json = JSON.parse(JSON.stringify(full_jsondata));
    var data = []
    var time_tpoic = [0,0,0,0,0,0,0];
    var topic_last = [0,0,0,0,0,0,0];
    var time_dis = 0

    console.log(time_weight,topic_weight)

    temp_json.forEach(function(d,i){

        time_dis = d.Time/(10*time_weight);// - time_tpoic[d.topic];

        data.push({"value": d.value, topic: d.topic, distance: time_dis, cluster: 0})  // itr_index: index_counter  (1/topic_num)

        // console.log(time_tpoic, (d.Time - time_tpoic[d.topic]));  //, this_distance  // 
        time_tpoic[d.topic] = d.Time;
        topic_last[d.topic] = d.Time;


    });
    interaction_clustering(data,1) // 1: nominal

}


function topic_clustering2(){

    dbscan_state.eps = topic_weight/100;
    // clone logs
    var temp_json = []
    var temp_json = JSON.parse(JSON.stringify(full_jsondata));
    var data = []
    var time_tpoic = [0,0,0,0,0,0,0];
    var topic_last = [0,0,0,0,0,0,0];
    var time_dis = 0

    console.log(time_weight,topic_weight)
    total = temp_json.length
    temp_json.forEach(function(d,i){

        
        // this_distance = d.topic + ((d.Time - time_tpoic[d.topic]));

        this_distance = d.topic + 100*(d.Time/temp_json[total-1].Time)/time_weight;


        data.push({"value": d.value, distance: this_distance, cluster: 0})  // itr_index: index_counter  (1/topic_num)

        // console.log(time_tpoic, (d.Time - time_tpoic[d.topic]));  //, this_distance  // 
        time_tpoic[d.topic] = d.Time;
        topic_last[d.topic] = d.Time;

    });
    interaction_clustering(data,0) // 1: nominal

}


function topic_clustering3(){

    dbscan_state.eps = topic_weight/100;
    // clone logs
    var temp_json = []
    var temp_json = JSON.parse(JSON.stringify(full_jsondata));
    var data = []
    var time_tpoic = [0,0,0,0,0,0,0];
    var topic_last = [0,0,0,0,0,0,0];
    var time_dis = 0

    console.log(time_weight,topic_weight)
    total = temp_json.length;

    temp_json.forEach(function(d,i){


        this_distance = d.topic + (d.Time - time_tpoic[d.topic]);
        // this_distance = d.topic + 100*(d.Time/temp_json[total-1].Time)/time_weight;


        data.push({"value": d.value, distance: this_distance, cluster: 0})  // itr_index: index_counter  (1/topic_num)
        time_tpoic[d.topic] = d.Time;
        topic_last[d.topic] = d.Time;
    });
    interaction_clustering(data,0) // 1: nominal

}



function interaction_clustering(data,type) {
    /* Reset global variables */
    
    dbscan_state.minPoints = 4;
    dbscan_state.cluster = 0;
    dbscan_state.index = 0;
    dbscan_state.phase = "choose";
    dbscan_state.neigh = [];
    
    algo_delay = 0;
    clearInterval(process);
    process = null;

    dbscan_state.phase = "postchoose";

    // add stroke to circles before clustering 
    d3.select(".svg_topics").selectAll(".datapoints").attr("fill","none").style("stroke","black").style("stroke-width",0.3);


    dbscan_clustering(data,type);

    // remove circle strokes again
    // d3.select(".svg_topics").selectAll(".datapoints").attr("fill","none").style("stroke","none");
}


    // Show epsilon and 
    // d3.select(".svg_topics").append("text")   
    // .attr("id", "eps_value")
    // .attr("x", x(-20))
    // .attr("y", y(-9.5))
    // .text("epsilon = " + twodecs(dbscan_state.eps));

    // d3.select(".svg_topics").append("text")
    // .attr("id", "minPoints_value")
    // .attr("x", x(-20))
    // .attr("y", y(-10.5))
    // .text("minPoints = " + dbscan_state.minPoints);