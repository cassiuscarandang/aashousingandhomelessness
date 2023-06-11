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

function createButtons2(title,link) {
  const newButton = document.createElement("button2"); // adds a new button
  newButton.id = "button2" + title; // gives the button a unique id
  newButton.innerHTML = title; // gives the button a title
  newButton.addEventListener('click', function() {
      window.location.href = link; // redirects to the specified link
  });
  const spaceForButtons = document.getElementById('placeforlinks');
  spaceForButtons.appendChild(newButton); // this adds the button to our page.
}

createButtons2('Home', 'index.html')
createButtons2('About', 'about.html')
createButtons2('📝Take the survey', 'https://docs.google.com/forms/d/e/1FAIpQLSdGrrsNrr9J_-RFIV31-eeoifLHyiB021avZqhm97z7wIM-Dw/viewform')

function createButtons(lat,lng,title,zoom){
    const newButton = document.createElement("button"); // adds a new button
    newButton.id = "button"+title; // gives the button a unique id
    newButton.innerHTML = title; // gives the button a title
    newButton.setAttribute("lat",lat); // sets the latitude 
    newButton.setAttribute("lng",lng); // sets the longitude 
    newButton.addEventListener('click', function(){
        map.flyTo([lat,lng],zoom); //this is the flyTo from Leaflet
    })
    const spaceForButtons = document.getElementById('placeForButtons')
    spaceForButtons.appendChild(newButton);//this adds the button to our page.
}

createButtons(0,0,'test',8)
createButtons(34.02420334343204, -118.27631488157236, 'Westwood', 14)

function loadData(url){
    Papa.parse(url, {
        header: true,
        download: true,
        complete: results => processData(results)
    })
}

function processData(results){
    console.log(results);
    var pieData = results.data.map(data => data['Have you ever experienced housing insecurity and/or unaffordability as a UCLA student?']); // Replace 'columnName' with the actual column name
    var barData = results.data.map(data => data['Where do you currently live?']); // Replace 'columnName' with the actual column name
    var wrd_rsp = results.data.map(data => data['Please describe any resources that you have used to assist with housing difficulties and/or housing affordability.']);
    var values = wrd_rsp.filter(response => response !== undefined);
    const concatenatedValues = values.join(" ");
    console.log(concatenatedValues)
    var frequencies = {};
      pieData.forEach(response => {
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

  var counts = {};
  barData.forEach(response => {
      if (counts.hasOwnProperty(response)) {
          counts[response]++;
    } else {
          counts[response] = 1;
    }
});
var data3 = Object.keys(counts).map(key => ({
key: key,
value: counts[key]
}));

    console.log(data2)
    console.log(data3)
    piechart(data2, 450, 450, 40)
    barplot(data3)
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
      var percentage = ((d.value / d3.sum(data, function(d) { return d.value; })) * 100).toFixed(0);
  
      // Show pop-up with label and percentage
      d3.select("#chart1")
        .append("div")
        .attr("class", "tooltip")
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 10) + "px")
        .text(percentage + "%" + " of people answered " + d.data.key);
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

// Bar Plot - Chart 2

function barplot(data) {
  var margin = { top: 30, right: 30, bottom: 60, left: 30 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // Determine the highest value in the data
  var maxValue = d3.max(data, function (d) {
    return d.value;
  });

  // Set the y-axis domain based on the highest value
  var y = d3.scaleLinear().domain([0, maxValue]).range([height, 0]);

  // append the svg object to the body of the page
  var svg = d3
    .select("#chart2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // sort data
  data.sort(function (b, a) {
    return a.Value - b.Value;
  });

  // X axis
  var x = d3
    .scaleBand()
    .range([0, width])
    .domain(data.map(function (d) {
      return d.key;
    }))
    .padding(0.2);
  var xAxis = svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Wrap x-axis labels
  xAxis
    .selectAll(".tick text")
    .call(wrapText, x.bandwidth());

  // Y axis
  svg.append("g").call(d3.axisLeft(y));

  // Bars
  svg
    .selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return x(d.key);
    })
    .attr("y", function (d) {
      return y(d.value);
    })
    .attr("width", x.bandwidth())
    .attr("height", function (d) {
      return height - y(d.value);
    })
    .attr("fill", "#69b3a2");
}

// Helper function to wrap text within a specified width
function wrapText(text, width) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // Adjust as needed
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy") || 0),
      tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");

    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));

      if (tspan.node().getComputedTextLength() > width && line.length > 1) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
  });
}

