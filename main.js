// Add your JavaScript code here
const MAX_WIDTH = Math.max(1080, window.innerWidth);
const MAX_HEIGHT = 720;
const margin = {top: 40, right: 100, bottom: 40, left: 175};
const NUM_EXAMPLES1 = 10;
const NUM_EXAMPLES3 = 10;

// Assumes the same graph width, height dimensions as the example dashboard. Feel free to change these if you'd like
let graph_1_width = (MAX_WIDTH / 2) - 10, graph_1_height = 250;
let graph_2_width = (MAX_WIDTH / 2) - 10, graph_2_height = 275;
let graph_3_width = MAX_WIDTH / 2, graph_3_height = 575;

let filename = "data/video_games.csv";

let svg1 = d3.select("#graph1")
    .append("svg")
    .attr("width", graph_1_width)
    .attr("height", graph_1_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let x1 = d3.scaleLinear()
    .range([0, graph_1_width - margin.left - margin.right]);

let y1 = d3.scaleBand()
    .range([0, graph_1_height - margin.top - margin.bottom])
    .padding(0.1);

let salesRef1 = svg1.append("g");

let y_axis_label1 = svg1.append("g");

svg1.append("text")
    .attr("transform", "translate("+(graph_1_width - margin.left - margin.right)/3+", "+(graph_1_height - margin.top)+")")
    .style("text_anchor", "middle")
    .text("Global Sales in millions of copies")

let y_axis_text1 = svg1.append("text")
    .attr("transform", "translate("+(-margin.left/1.5)+", "+(graph_1_height - margin.top - margin.bottom)/1.85+")")
    .style("text-anchor", "middle");

let title1 = svg1.append("text")
    .attr("transform", "translate("+(graph_1_width - margin.left - margin.right)/2+", "+(-10)+")")
    .style("text-anchor", "middle")
    .style("font-size", 15);

let svg2 = d3.select("#graph2")
    .append("svg")
    .attr("width", graph_2_width)
    .attr("height", graph_2_height)
    .append("g")
    .attr("transform", "translate("+margin.left+","+margin.top*4+")");

let title2 = svg2.append("text")
    .attr("transform", "translate("+0+", "+(-graph_2_height/2)+")")
    .style("text-anchor", "middle")
    .style("font-size", 15);

let svg3 = d3.select("#graph3")
    .append("svg")
    .attr("width", graph_3_width)
    .attr("height", graph_3_height)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let x3 = d3.scaleLinear()
    .range([0, graph_3_width - margin.left - margin.right]);

let y3 = d3.scaleBand()
    .range([0, graph_3_height - margin.top - margin.bottom])
    .padding(0.1);

let salesRef3 = svg3.append("g");

let y_axis_label3 = svg3.append("g");

svg3.append("text")
    .attr("transform", "translate("+(graph_3_width - margin.left - margin.right)/3+", "+(graph_3_height - margin.top)+")")
    .style("text_anchor", "middle")
    .text("Global Sales in millions of copies")

let y_axis_text3 = svg3.append("text")
    .attr("transform", "translate("+(-margin.left/2)+", "+(graph_3_height - margin.top - margin.bottom)/2+")")
    .style("text-anchor", "middle");

let title3 = svg3.append("text")
    .attr("transform", "translate("+(graph_3_width - margin.left - margin.right)/2+", "+0+")")
    .style("text-anchor", "middle")
    .style("font-size", 15);

let radius2 = Math.min(graph_2_width, graph_2_height) / (2.5);

let tooltip = d3.select("body").select("#graph1").append("div")
    .attr("class", "toolTip")
    .style("display", "none")

function setData1(year, attr){
    d3.csv(filename).then(function(data){
        data = cleanData1(data, year, NUM_EXAMPLES1)  

        x1.domain([0, d3.max(data, function(d){return d["Global_Sales"]})]);

        y1.domain(data.map(function(d){return d[attr]}));

        y_axis_label1.call(d3.axisLeft(y1).tickSize(0).tickPadding(10));

        let bars1 = svg1.selectAll("rect").data(data);

        let color = d3.scaleOrdinal()
            .domain(data.map(function(d) {return d[attr]}))
            .range(d3.quantize(d3.interpolateHcl("#FFC588", "#FFC588"), NUM_EXAMPLES1));

        bars1.enter()
            .append("rect")
            .on("mouseover", function(d){
                tooltip.style("display", "inline")})
            .on("mousemove", function(d){tooltip.html("Game: "+d[attr])})
            .on("mouseout", function(d){tooltip.style("display", "none")})
            .merge(bars1)
            .transition()
            .duration(1000)
            .attr("fill", function(d) { return color(d[attr]) })
            .attr("x", x1(0))
            .attr("y", function(d) {return y1(d[attr])})
            .attr("width", function(d){return x1(d["Global_Sales"])})
            .attr("height",  y1.bandwidth())

        let sales = salesRef1.selectAll("text").data(data);

        sales.enter()
            .append("text")
            .merge(sales)
            .transition()
            .duration(1000)
            .attr("x", function(d) {return x1(d.Global_Sales)+7})
            .attr("y", function(d) {return y1(d[attr])+y1.bandwidth()/1.2})
            .style("text-anchor", "start")
            .text(function(d){return d.Global_Sales});

        });

        y_axis_text1.text(attr);
        title1.text("Top 10 best selling games of all time");
        //NOTE: Switched to all time for this question but only edited the code cleandata function as to not disrupt the rest
        //of the code
}

function setData2(region, attr){
    d3.csv(filename).then(function(data){
        svg2.selectAll("path").remove();
        data = cleanData2(data, region);
        var pie2 = d3.pie().value(function(d){return d.value})
        var pie2data = pie2(d3.entries(data))
        
        var arc = d3.arc().innerRadius(radius2/2).outerRadius(radius2)

        var arcs2 = svg2.selectAll("arc").data(pie2data)

        let color = d3.scaleOrdinal()
            .domain(data)
            .range(d3.quantize(d3.interpolateHcl("#FD7777", "#88FFD8"), 12));
        

        arcs2.enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", function(d){return color(d.data.key)})
            .merge(arcs2)
            .transition()
            .duration(1000)
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 1)

        arcs2.enter().append("text")
            .text(function(d){return d.data.key})
            .attr("transform", function(d){return "translate("+arc.centroid(d)+")"})
            .style("text-anchor", "middle")
            .style("font-size", 10)
    })
    title2.text(region+" by game genre")
}

function setData3(genre, attr){
    d3.csv(filename).then(function(data){
        data = cleanData3(data, genre, NUM_EXAMPLES3)  

        x3.domain([0, data[0][1]]);
        y3.domain(data.map(function(d){return d[0]}));
        
        y_axis_label3.call(d3.axisLeft(y3).tickSize(0).tickPadding(10));

        let bars3 = svg3.selectAll("rect").data(data);

        let color = d3.scaleOrdinal()
            .domain(data.map(function(d) {return d[0]}))
            .range(d3.quantize(d3.interpolateHcl("#FFC588", "#FFC588"), NUM_EXAMPLES3));

        bars3.enter()
            .append("rect")
            .merge(bars3)
            .transition()
            .duration(1000)
            .attr("fill", function(d) {return color(d[0])})
            .attr("x", x3(0))
            .attr("y", function(d) {return y3(d[0])})
            .attr("width", function(d){return x3(d[1])})
            .attr("height",  y3.bandwidth());

        let sales = salesRef3.selectAll("text").data(data);

        sales.enter()
            .append("text")
            .merge(sales)
            .transition()
            .duration(1000)
            .attr("x", function(d) {return x3(d[1])+7})
            .attr("y", function(d) {return y3(d[0])+y3.bandwidth()/2})
            .style("text-anchor", "start")
            .text(function(d){return Math.round(d[1]*10)/10.0});
        });
        y_axis_text3.text(attr);
        title3.text("Top 10 "+genre+" genre publishers based on total global all-time sales");
}

function cleanData1(data, year, numExamples){
    return data.slice(0, numExamples)
}

function cleanData2(data, region, attr){
    var genres = []
    for(var i = 0; i<data.length; i++){
        if(!genres.includes(data[i].Genre)){
            genres.push(data[i].Genre);
        }
    }
    inputs2 = {}
    for(var j = 0; j<genres.length; j++){
        inputs2[genres[j]] = 0;
    }
    for(var k = 0; k<data.length; k++){
        inputs2[data[k].Genre] = inputs2[data[k].Genre] + parseFloat(data[k][region])
    }
    return inputs2;
}

function cleanData3(data, genre, numExamples){
    var publishers = []
    for(var i = 0; i<data.length; i++){
        if(!publishers.includes(data[i].Publisher)){
            publishers.push(data[i].Publisher);
        }
    }
    var publishersales = {}
    for(var j = 0; j<publishers.length; j++){
        publishersales[publishers[j]] = 0;
    }
    for(var k = 0; k<data.length; k++){
        if(data[k]["Genre"] == genre){
            publishersales[data[k].Publisher] = publishersales[data[k].Publisher] + parseFloat(data[k]["Global_Sales"])
        }
    }
    resultarray = []
    for(var l = 0; l<publishers.length; l++){
        resultarray.push([publishers[l], publishersales[publishers[l]]])
    }
    resultarray = resultarray.sort(function(a1, a2){return a2[1]-a1[1]})
    resultarray = resultarray.slice(0, numExamples)
    return resultarray;
}

setData1(2006, "Name");
setData2("NA_Sales", "Genre");
setData3("Sports", "Publisher")