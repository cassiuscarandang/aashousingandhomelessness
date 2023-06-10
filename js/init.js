// declare variables
let mapOptions = {'center': [34.0709,-118.444],'zoom':5}

let oncampus = L.featureGroup();
let offcampus = L.featureGroup();
let offcampusgrad = L.featureGroup();
let commuter = L.featureGroup();
let unhoused = L.featureGroup();
let other = L.featureGroup();

let layers = {
    "On Campus Student <svg height='10' width='10'><circle cx='5' cy='5' r='4' stroke='black' stroke-width='1' fill='red' /></svg>": oncampus,
    "Off Campus Student (Living in Westwood) <svg height='10' width='10'><circle cx='5' cy='5' r='4' stroke='black' stroke-width='1' fill='blue' /></svg>": offcampus,
    "Off Campus Graduate Student <svg height='10' width='10'><circle cx='5' cy='5' r='4' stroke='black' stroke-width='1' fill='yellow' /></svg>": offcampusgrad,
    "Off Campus Commuter Student <svg height='10' width='10'><circle cx='5' cy='5' r='4' stroke='black' stroke-width='1' fill='green' /></svg>": commuter,
    "Homeless/Unhoused Student <svg height='10' width='10'><circle cx='5' cy='5' r='4' stroke='black' stroke-width='1' fill='purple' /></svg>": unhoused,
    "Other <svg height='10' width='10'><circle cx='5' cy='5' r='4' stroke='black' stroke-width='1' fill='black' /></svg>": other
}

let circleOptions = {
    radius: 4,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
}

const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQHDPfOGu2VPqApARI9h-tgQrhFjxyrs83mz5dpl3UE_tb8qhotj47wU17Hnch5D66MeejMCfaC3_VK/pub?output=csv"

// define the leaflet map
const map = L.map('the_map').setView(mapOptions.center, mapOptions.zoom);

// add layer control box
L.control.layers(null,layers, {collapsed:false}).addTo(map)

let Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
});

Esri_WorldGrayCanvas.addTo(map);

function addMarker(data){
    if(data['Where do you currently live?'] == "On-Campus Housing (Dorms)"){
        circleOptions.fillColor = "red"
        oncampus.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>On Campus Student</h2>`))
        createButtons(data.lat,data.lng,data['What are your experiences with housing insecurity and affordability at UCLA?'])
        }
    else if(data['Where do you currently live?'] == "Off-Campus Housing (Living in Westwood)"){
        circleOptions.fillColor = "blue"
        offcampus.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>On Campus Student</h2>`))
        createButtons(data.lat,data.lng,data['What are your experiences with housing insecurity and affordability at UCLA?'])
        }
    else if(data['Where do you currently live?'] == "Off-Campus Graduate Housing (Living in Westwood/Palms)"){
        circleOptions.fillColor = "yellow"
        offcampusgrad.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>On Campus Student</h2>`))
        createButtons(data.lat,data.lng,data['What are your experiences with housing insecurity and affordability at UCLA?'])
        }
    else if(data['Where do you currently live?'] == "Off-Campus Commuter (Living outside Westwood)"){
        circleOptions.fillColor = "green"
        commuter.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>On Campus Student</h2>`))
        createButtons(data.lat,data.lng,data['What are your experiences with housing insecurity and affordability at UCLA?'])
        }
    else if(data['Where do you currently live?'] == "Currently Unhoused/Homeless"){
        circleOptions.fillColor = "purple"
        unhoused.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>On Campus Student</h2>`))
        createButtons(data.lat,data.lng,data['What are your experiences with housing insecurity and affordability at UCLA?'])
        }
    else{
        circleOptions.fillColor = "black"
        other.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).bindPopup(`<h2>Off Campus Student</h2>`))
        createButtons(data.lat,data.lng,data['What are your experiences with housing insecurity and affordability at UCLA?'])
    }
    return data
}

function createButtons(lat,lng,title){
    const newButton = document.createElement("button"); // adds a new button
    newButton.id = "button"+title; // gives the button a unique id
    newButton.innerHTML = title; // gives the button a title
    newButton.setAttribute("lat",lat); // sets the latitude 
    newButton.setAttribute("lng",lng); // sets the longitude 
    newButton.addEventListener('click', function(){
        map.flyTo([lat,lng]); //this is the flyTo from Leaflet
    })
    const spaceForButtons = document.getElementById('placeForButtons')
    spaceForButtons.appendChild(newButton);//this adds the button to our page.
}

function loadData(url){
    Papa.parse(url, {
        header: true,
        download: true,
        complete: results => processData(results)
    })
}

function processData(results){
    console.log(results)
    results.data.forEach(data => {
        console.log(data)
        addMarker(data)
    })
    oncampus.addTo(map) // add our layers after markers have been made
    offcampus.addTo(map) // add our layers after markers have been made  
    offcampusgrad.addTo(map) // add our layers after markers have been made
    commuter.addTo(map) // add our layers after markers have been made 
    unhoused.addTo(map) // add our layers after markers have been made
    other.addTo(map) // add our layers after markers have been made 
    let allLayers = L.featureGroup([oncampus,offcampus,offcampusgrad,commuter,unhoused,other]);
    map.fitBounds(allLayers.getBounds());
}

loadData(dataUrl)

// Scatter Plot - Chart 1
// Set Dimensions
const xSize = 500; 
const ySize = 500;
const margin = 40;
const xMax = xSize - margin*2;
const yMax = ySize - margin*2;

// Create Random Points
const numPoints = 100;
const data = [];
for (let i = 0; i < numPoints; i++) {
  data.push([Math.random() * xMax, Math.random() * yMax]);
}

// Append SVG Object to the Page
const svg = d3.select("#myPlot")
  .append("svg")
  .append("g")
  .attr("transform","translate(" + margin + "," + margin + ")");

// X Axis
const x = d3.scaleLinear()
  .domain([0, 500])
  .range([0, xMax]);

svg.append("g")
  .attr("transform", "translate(0," + yMax + ")")
  .call(d3.axisBottom(x));

// Y Axis
const y = d3.scaleLinear()
  .domain([0, 500])
  .range([ yMax, 0]);

svg.append("g")
  .call(d3.axisLeft(y));

// Dots
svg.append('g')
  .selectAll("dot")
  .data(data).enter()
  .append("circle")
  .attr("cx", function (d) { return d[0] } )
  .attr("cy", function (d) { return d[1] } )
  .attr("r", 3)
  .style("fill", "Red");


// Pie Chart - Chart 2

// set the dimensions and margins of the graph
var width = 450
    height = 450
    margin2 = 40

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin2

// append the svg object to the div called 'my_dataviz'
var svg2 = d3.select("#chart2")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Create dummy data
var data2 = {a: 9, b: 20, c:30, d:8, e:12}

// set the color scale
var color = d3.scaleOrdinal()
  .domain(data2)
  .range(d3.schemeSet2);

// Compute the position of each group on the pie:
var pie = d3.pie()
  .value(function(d) {return d.value; })
var data_ready = pie(d3.entries(data2))
// Now I know that group A goes from 0 degrees to x degrees and so on.

// shape helper to build arcs:
var arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(radius)

// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg2
  .selectAll('mySlices')
  .data(data_ready)
  .enter()
  .append('path')
    .attr('d', arcGenerator)
    .attr('fill', function(d){ return(color(d.data.key)) })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)

// Now add the annotation. Use the centroid method to get the best coordinates
svg2
  .selectAll('mySlices')
  .data(data_ready)
  .enter()
  .append('text')
  .text(function(d){ return "grp " + d.data.key})
  .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")";  })
  .style("text-anchor", "middle")
  .style("font-size", 17)

  // Word Cloud

  function createWordCloud(words) {
    d3.select("#chart3")
      .append("svg")
      .attr("width", 500)
      .attr("height", 500)
      .append("g")
      .attr("transform", "translate(250,250)")
      .selectAll("text")
      .data(words)
      .enter()
      .append("text")
      .style("font-size", function(d) { return d.size + "px"; })
      .style("fill", function(d, i) { return d3.schemeCategory10[i % 10]; })
      .attr("text-anchor", "middle")
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });
  }

  var words = [
    { text: "Hello", size: 20, x: 0, y: 0, rotate: 0 },
    { text: "World", size: 30, x: 50, y: 50, rotate: 45 },
    // Add more word objects as needed
  ];
  
  createWordCloud(words);