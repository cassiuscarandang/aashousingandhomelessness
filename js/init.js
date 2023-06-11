// declare variables
let mapOptions = {'center': [34.02420334343204, -118.27631488157236],'zoom':10}

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
   let survresponses = `<h2>What is your current living situation?</h2>
                <p>${data['Where do you currently live?']}</p> 
                <h2>What are your experiences with housing insecurity and affordability at UCLA?</h2>
                <p>${data['What are your experiences with housing insecurity and affordability at UCLA?']}</p>
                <h2>Please share any difficulties you’ve had searching for off-campus housing, if any.</h2>
                <p>${data['Please share any difficulties you’ve had searching for off-campus housing, if any.']}</p>
                <h2>Does housing insecurity/expensive housing affect your day-to-day student life? If so, how?</h2>
                <p>${data['Does housing insecurity/expensive housing affect your day-to-day student life? If so, how?']}</p>
                <h2>Please describe any resources that you have used to assist with housing difficulties and/or housing affordability.</h2>
                <p>${data['Please describe any resources that you have used to assist with housing difficulties and/or housing affordability.']}</p>`
    if(data['Where do you currently live?'] == "On-Campus Housing (Dorms)"){
        circleOptions.fillColor = "red"
        oncampus.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).on('mouseover', function(){
          const markerDataPanel = document.getElementById('survdata');
          markerDataPanel.innerHTML = survresponses;
  }));
        }
    else if(data['Where do you currently live?'] == "Off-Campus Housing (Living in Westwood)"){
        circleOptions.fillColor = "blue"
        offcampus.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).on('mouseover', function(){
          const markerDataPanel = document.getElementById('survdata');
          markerDataPanel.innerHTML = survresponses;
  }));
        }
    else if(data['Where do you currently live?'] == "Off-Campus Graduate Housing (Living in Westwood/Palms)"){
        circleOptions.fillColor = "yellow"
        offcampusgrad.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).on('mouseover', function(){
          const markerDataPanel = document.getElementById('survdata');
          markerDataPanel.innerHTML = survresponses;
  }));
        }
    else if(data['Where do you currently live?'] == "Off-Campus Commuter (Living outside Westwood)"){
        circleOptions.fillColor = "green"
        commuter.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).on('mouseover', function(){
          const markerDataPanel = document.getElementById('survdata');
          markerDataPanel.innerHTML = survresponses;
  }));
        }
    else if(data['Where do you currently live?'] == "Currently Unhoused/Homeless"){
        circleOptions.fillColor = "purple"
        unhoused.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).on('mouseover', function(){
          const markerDataPanel = document.getElementById('survdata');
          markerDataPanel.innerHTML = survresponses;
  }));
        }
    else{
        circleOptions.fillColor = "black"
        other.addLayer(L.circleMarker([data.lat,data.lng],circleOptions).on('mouseover', function(){
          const markerDataPanel = document.getElementById('survdata');
          markerDataPanel.innerHTML = survresponses;
  }));
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
    console.log(results);
    var columnData = results.data.map(data => data['Have you ever experienced housing insecurity and/or unaffordability as a UCLA student?']); // Replace 'columnName' with the actual column name
  
      var frequencies = {};
      columnData.forEach(response => {
          if (frequencies.hasOwnProperty(response)) {
              frequencies[response]++;
        } else {
              frequencies[response] = 1;
        }
  });
    var data2 = Object.keys(frequencies).map(key => ({
    key: key,
    value: frequencies[key]
  }));
    console.log(data2)
    piechart(data2, 450, 450, 40)
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


// Pie Chart - Chart 1

function piechart(data, width, height, margin) {
  var radius = Math.min(width, height) / 2 - margin;
  var svg2 = d3.select("#chart1")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var color = d3.scaleOrdinal()
    .domain(data.map(d => d.key))
    .range(d3.schemeSet2);

  var pie = d3.pie()
    .value(function(d) { return d.value; });

  var data_ready = pie(data);

  var arcGenerator = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

  var slices = svg2.selectAll('mySlices')
    .data(data_ready)
    .enter()
    .append('path')
    .attr('d', arcGenerator)
    .attr('fill', function(d) { return color(d.data.key); })
    .attr("stroke", "black")
    .style("stroke-width", "2px")
    .style("opacity", 0.7);

  var labels = svg2.selectAll('mySlices')
    .data(data_ready)
    .enter()
    .append('text')
    .text(function(d) { return d.data.key; })
    .attr("transform", function(d) { return "translate(" + arcGenerator.centroid(d) + ")"; })
    .style("text-anchor", "middle")
    .style("font-size", 17);

    slices.on("pointerover", function(d) {
      d3.select(this)
        .style("opacity", 1.0);
  
      // Calculate percentage
      var percentage = ((d.data.value / d3.sum(data, function(d) { return d.value; })) * 100).toFixed(0);
  
      // Show pop-up with label and percentage
      d3.select("#chart1")
        .append("div")
        .attr("class", "tooltip")
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 10) + "px")
        .text(percentage + "%" + " of respondents answered " + d.data.key);
    })
    .on("pointerout", function(d) {
      d3.select(this)
        .style("opacity", 0.7);
  
      // Remove the pop-up
      d3.select(".tooltip").remove();
    })
    .on("click", function(d) {
      console.log("Clicked on group:", d.data.key);
    });
}

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