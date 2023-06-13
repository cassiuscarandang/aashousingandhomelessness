// Data from our Survey CSV
const dataUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQHDPfOGu2VPqApARI9h-tgQrhFjxyrs83mz5dpl3UE_tb8qhotj47wU17Hnch5D66MeejMCfaC3_VK/pub?output=csv"

// Starting Map Options 
let mapOptions = {'center': [34.02420334343204, -118.27631488157236],'zoom':10}

// define the leaflet map
const map = L.map('the_map').setView(mapOptions.center, mapOptions.zoom);

// Bringing in and Adding our Basemap
let Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 16
});

Esri_WorldGrayCanvas.addTo(map);

// Our feature groups derived from the survey location data
let oncampus = L.featureGroup();
let offcampus = L.featureGroup();
let offcampusgrad = L.featureGroup();
let commuter = L.featureGroup();
let unhoused = L.featureGroup();
let other = L.featureGroup();

// Labeling our Layers
let layers = {
    "On Campus Student <svg height='10' width='10'><circle cx='5' cy='5' r='4' stroke='black' stroke-width='1' fill='red' /></svg>": oncampus,
    "Off Campus Student (Living in Westwood) <svg height='10' width='10'><circle cx='5' cy='5' r='4' stroke='black' stroke-width='1' fill='blue' /></svg>": offcampus,
    "Off Campus Graduate Student <svg height='10' width='10'><circle cx='5' cy='5' r='4' stroke='black' stroke-width='1' fill='yellow' /></svg>": offcampusgrad,
    "Off Campus Commuter Student <svg height='10' width='10'><circle cx='5' cy='5' r='4' stroke='black' stroke-width='1' fill='green' /></svg>": commuter,
    "Homeless/Unhoused Student <svg height='10' width='10'><circle cx='5' cy='5' r='4' stroke='black' stroke-width='1' fill='purple' /></svg>": unhoused,
}


// Circle Options
let circleOptions = {
    radius: 6,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
}

// Add Marker Function that Adds Markers and Adds Information About the Markers to Summary Divs
function addMarker(data){

  let surveydataproperties =  {
    "location": data['Where do you currently live?'],
    "experiences": data['What are your experiences with housing insecurity and affordability at UCLA?'],
    "difficulties": data['Please share difficulties you’ve had searching for off-campus housing, if any.'],
    "studentlife": data['Does housing insecurity or unaffordability affect your day-to-day student life? If so, how?'],
    "resources": data['Please describe any resources that you have used to assist with housing difficulties and/or housing affordability.'],
  }

  let markerobj = Object.assign(circleOptions, surveydataproperties)

  let surveyresponses = `<h3>What is your current living situation?</h3>
                <p>${surveydataproperties.location}</p> 
                <h3>What are your experiences with housing insecurity and affordability at UCLA?</h3>
                <p>${surveydataproperties.experiences}</p>
                <h3>Please share difficulties you’ve had searching for off-campus housing, if any.</h3>
                <p>${surveydataproperties.difficulties}</p>
                <h3>Does housing insecurity/expensive housing affect your day-to-day student life? If so, how?</h3>
                <p>${surveydataproperties.studentlife}</p>
                <h3>Please describe any resources that you have used to assist with housing difficulties and/or housing affordability.</h3>
                <p>${surveydataproperties.resources}</p>`;

  if (surveydataproperties.location === "On-Campus Housing (Dorms)") {
    circleOptions.fillColor = "red";
    oncampus.addLayer(
      L.circleMarker([data.lat, data.lng], markerobj)
        .bindPopup(surveyresponses)
    );
  createButtons(data.lat, data.lng, surveydataproperties.experiences, oncampus, 'divOnCampusHousingStudents');
}

  else if(surveydataproperties.location == "Off-Campus Housing (Living in Westwood)"){
    circleOptions.fillColor = "blue"
    offcampus.addLayer(
      L.circleMarker([data.lat,data.lng],markerobj)
        .bindPopup(surveyresponses)
  );
  createButtons(data.lat, data.lng, surveydataproperties.experiences, offcampus, 'divOffCampusHousingStudents');
}

  else if(surveydataproperties.location == "Off-Campus Graduate Housing (Living in Westwood/Palms)"){
    circleOptions.fillColor = "yellow"
    offcampusgrad.addLayer(
      L.circleMarker([data.lat,data.lng],markerobj)
       .bindPopup(surveyresponses)
  );
  createButtons(data.lat, data.lng, surveydataproperties.experiences, offcampusgrad, 'divOffCampusGraduateHousingStudents');
}

  else if(surveydataproperties.location == "Off-Campus Commuter (Living outside Westwood)"){
    circleOptions.fillColor = "green"
    commuter.addLayer(
      L.circleMarker([data.lat,data.lng],markerobj)
      .bindPopup(surveyresponses)
  );
  createButtons(data.lat, data.lng, surveydataproperties.experiences, commuter, 'divCommuterStudents');
}

  else if(surveydataproperties.location == "Currently Unhoused/Homeless"){
    circleOptions.fillColor = "purple"
    unhoused.addLayer(
      L.circleMarker([data.lat,data.lng],markerobj)
       .bindPopup(surveyresponses)
  );
  createButtons(data.lat, data.lng, surveydataproperties.experiences, unhoused, 'divUnhousedStudents');
}
    return data
}

// Function to create our reset button
function resetButton(title) {
  const newButton = document.createElement("button"); // adds a new button
  newButton.id = "button" + title.replace(/\s/g, ''); // gives the button a unique id
  console.log(newButton.id);
  newButton.innerHTML = title; // gives the button a title
  newButton.addEventListener('click', function () {
    location.reload(); // reloads the webpage to reset the map
  });
  const spaceForButtons = document.getElementById('placeForButtons');
  spaceForButtons.appendChild(newButton); // this adds the button to our buttonbar.
}

// Function to create our buttons by housing situation
function liveButtons(lat, lng, title, zoom, featureGroup) {
  const newButton = document.createElement("button"); // adds a new button
  newButton.id = "button" + title.replace(/\s/g, ''); // gives the button a unique id
  console.log(newButton.id);
  newButton.innerHTML = title; // gives the button a title
  newButton.addEventListener('click', function () {
    const panelDiv = document.getElementById('panel');
    panelDiv.style.display = 'none'; // hide the initial introductory panel
    map.flyTo([lat, lng], zoom); // this is the flyTo from Leaflet

    // Show the corresponding div and hide the others
    const contentDivs = document.getElementsByClassName('content-div');
    for (const div of contentDivs) {
      if (div.id === "div" + title.replace(/\s/g, '')) {
        div.style.display = 'block';
      } else {
        div.style.display = 'none';
      }
    }

    // Show the specified feature group and hide the others
    for (const layer in layers) {
      if (layers.hasOwnProperty(layer)) {
        if (layers[layer] === featureGroup) {
          map.addLayer(featureGroup);
        } else {
          map.removeLayer(layers[layer]);
        }
      }
    }

    // Remove the inactive-button class from all buttons
    const buttons = document.getElementsByTagName("button");
    for (const button of buttons) {
      button.classList.remove("inactive-button");
    }

    // Gray out the inactive buttons
    for (const button of buttons) {
      if (button !== newButton && !button.classList.contains("exclude-from-gray")
    ) {button.classList.add("inactive-button");
      }
    }
  });

  const spaceForButtons = document.getElementById('placeForButtons');
  spaceForButtons.appendChild(newButton); // this adds the button to our page.
}

// Creating our button bar buttons

resetButton('Reset Map')
liveButtons(34.07022254726645, -118.44680044184324, "On Campus Housing Students", 15, oncampus);
liveButtons(34.07022254726645, -118.44680044184324, "Off Campus Housing Students", 14, offcampus);
liveButtons(34.07022254726645, -118.44680044184324, "Off Campus Graduate Housing Students", 14, offcampusgrad);
liveButtons(34.02420334343204, -118.27631488157236, "Commuter Students", 10, commuter);
liveButtons(34.02420334343204, -118.27631488157236, "Unhoused Students", 10, unhoused);

// This createButtons function creates buttons on the users' responses
function createButtons(lat, lng, title, group, dividee) {
  const newButton2 = document.createElement("button");
  newButton2.id = "button" + title;
  newButton2.innerHTML = title;
  newButton2.setAttribute("lat", lat);
  newButton2.setAttribute("lng", lng);
  newButton2.classList.add("exclude-from-gray");
  newButton2.addEventListener('click', function () {
    let markers = group.getLayers(); // Get all the markers in the oncampus feature group
    console.log(markers)
    markers.forEach(marker => {
      if (marker.getLatLng().lat === parseFloat(lat) && marker.getLatLng().lng === parseFloat(lng)) {
        marker.openPopup(); // Open the popup for the corresponding marker
      }
    });
  });
  const ForButtons = document.getElementById(dividee);
  ForButtons.appendChild(newButton2);
  const paragraphElement = ForButtons.querySelector('p');
  ForButtons.insertBefore(newButton2, paragraphElement.nextSibling);
}

// Function to parse our CSV Data
function loadData(url){
    Papa.parse(url, {
        header: true,
        download: true,
        complete: results => processData(results)
    })
}

// Processing and filtering the results 
function processData(results) {
  console.log(results);
  var filteredData = results.data.filter(data => data['Have you ever experienced housing insecurity and/or unaffordability as a UCLA student?'] !== 'No'); // Making sure we only get the UCLA housing insecure community
  var barData = filteredData.map(data => data['Where do you currently live?']); // This is what our bar shart wil be about
  var counts = {}; // Count the number of each response
  barData.forEach(response => {
      if (counts.hasOwnProperty(response)) {
          counts[response]++;
      } else {
          counts[response] = 1;
      }
  });
  // Create an object with the x variable and the count of each response
  var data3 = Object.keys(counts).map(key => ({
      key: key,
      value: counts[key]
  }));
  console.log(data3);
  // The order we want our bar chart to be in
  const customSortOrder = ['On-Campus Housing (Dorms)', 'Off-Campus Housing (Living in Westwood)', 'Off-Campus Graduate Housing (Living in Westwood/Palms)', 'Off-Campus Commuter (Living outside Westwood)', 'Currently Unhoused/Homeless'];
  
  // This puts our data in the order above so it sorts the bar chart (code we got online)
  data3.sort((a, b) => {
  const indexA = customSortOrder.indexOf(a.key);
  const indexB = customSortOrder.indexOf(b.key);

  if (indexA < indexB) {
    return -1; 
  } else if (indexA > indexB) {
    return 1; 
  }

  return 0; 
});

// Add a marker for each relevant data point
  filteredData.forEach(data => {
      console.log(data);
      addMarker(data);
  });
    barplot(data3) // creates the bar chart of our data
    oncampus.addTo(map) // add our layers after markers have been made
    offcampus.addTo(map) // add our layers after markers have been made  
    offcampusgrad.addTo(map) // add our layers after markers have been made
    commuter.addTo(map) // add our layers after markers have been made 
    unhoused.addTo(map) // add our layers after markers have been made
    other.addTo(map) // add our layers after markers have been made 
    let allLayers = L.featureGroup([oncampus,offcampus,offcampusgrad,commuter,unhoused,other]);
    map.fitBounds(allLayers.getBounds());
}

// Load in our CSV
loadData(dataUrl)


// Bar Plot
function barplot(data) {
  var margin = { top: 30, right: 30, bottom: 60, left: 30 },
    width = 460 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

  // Determine the highest value in the data
  var maxValue = d3.max(data, function (d) {
    return d.value;
  });

  // Set the y-axis domain based on the highest value
  var y = d3.scaleLinear().domain([0, maxValue]).range([height, 0]);

  // Appends the svg object to the body of the page
  var svg = d3
    .select("#chart2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

 // The Bars
 var bars = svg
    .selectAll("mybar")
    .data(data, function(d) {
    return d.key; // Use the 'key' property as the data identifier
 })
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
    .attr("fill", function (d) {
   // Set color based on the value in the data
    if (d.key === 'On-Campus Housing (Dorms)') {
        return "red";
   } else if (d.key === 'Off-Campus Housing (Living in Westwood)') {
        return "blue";
   } else if (d.key === 'Off-Campus Graduate Housing (Living in Westwood/Palms)') {
        return "yellow";
   } else if (d.key === 'Off-Campus Commuter (Living outside Westwood)') {
        return "green";
   } else if (d.key === 'Currently Unhoused/Homeless') {
        return "purple";
   } else {
        return "black";
   }
 })
 .attr("stroke", "black") // Adding black outline
 .attr("stroke-width", 1); // Adjusting the thickness

// Event listener for click
bars.on("click", function (d) {
  // If I click on the bar that is On Campus, then press the corresponding button
  if (d.key === "On-Campus Housing (Dorms)") {
    const buttonId = '#buttonOnCampusHousingStudents';
    const button = document.querySelector(buttonId);
    console.log(button);
    if (button) {
      button.click(); 
    }
  // If I click on the bar that is Off Campus, then press the corresponding button
  } else if (d.key === 'Off-Campus Housing (Living in Westwood)') {
    const buttonId = '#buttonOffCampusHousingStudents';
    const button = document.querySelector(buttonId);
    console.log(button);
    if (button) {
      button.click(); // Trigger click event on the button
    }
  // If I click on the bar that is Off Campus Grad Student, then press the corresponding button
  } else if (d.key === 'Off-Campus Graduate Housing (Living in Westwood/Palms)') {
    const buttonId = '#buttonOffCampusGraduateHousingStudents';
    const button = document.querySelector(buttonId);
    console.log(button);
    if (button) {
      button.click(); // Trigger click event on the button
    }
  }
  // If I click on the bar that is Commuter, then press the corresponding button
    else if (d.key === 'Off-Campus Commuter (Living outside Westwood)') {
    const buttonId = '#buttonCommuterStudents';
    const button = document.querySelector(buttonId);
    console.log(button);
    if (button) {
      button.click(); // Trigger click event on the button
    }
  }
  // If I click on the bar that is Unhoused, then press the corresponding button
    else if (d.key === 'Currently Unhoused/Homeless') {
    const buttonId = '#buttonUnhousedStudents';
    const button = document.querySelector(buttonId);
    console.log(button);
    if (button) {
      button.click(); // Trigger click event on the button
    }
  }
  console.log("Clicked bar:", d.key);
});

// Helper function to wrap text within a specified width
function wrapText(text, width) {
  text.each(function () {
    var text = d3.select(this),
      words = text.text().split(/\s+/).reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1,
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
}}
