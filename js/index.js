// ------ STATE VARIABLES ------

let SCENEID = 0;

// ----- GLOBAL VARIABLES ----

const MAXSCENE = 4;
let DATA2 = {}; // Needs to be global because it's read during init(), but used repeatedly elsewhere.
let DATA2_BY_COUNTRY = {};   // Needs to be global because it's read during init(), but used repeatedly elsewhere.
let COLOUR_COUNTRY = d3.scaleOrdinal().range(['red','blue','green'])  // Change to match number of countries

// const CANVAS_HEIGHT = '500px'
// const CANVAS_WIDTH = '1000px'

// ****************************************
// ------ SCENE PARAMETER DEFINITION ------

// These define only the DIFFERENCES between scenes
// The index of sceneParams corresponds to the SCENEID that should be looked up
// E.g.: sceneParams[2].chartOne_color     will hold the color chartOne should have in Scene 2.

const sceneParams = [];

sceneParams[1] = {
  textPanel_displaymode : 'inline-block',
  textPanel_HTML : '<h3>Finland = Most Happy</h3><p>Finland has enjoyed consistently high happiness since 2008.</p><p>There appears to be a slight upwards trend.</p>',

  textPanel_height : '100%',
  chartOne_height : '100%',
  legendBar_height : '100%',

  textPanel_width : '40%',
  chartOne_width : '40%',

  chartTwo_displayMode : 'none',

  finTrace_strokeWidth : 10,
  afgTrace_strokeWidth : 1.5,
  ausTrace_strokeWidth : 1.5,

  afgTrace_visibility : 'hidden',
  ausTrace_visibility : 'hidden',
};

// Define all the other scenes as a copy of Scene 1, then differences.

sceneParams[2] = {...sceneParams[1]};
sceneParams[2].textPanel_HTML = '<h3>Afghanistan = Least Happy</h3><p>Afghanistan is a nation in crisis.</p><p>The country has been in the grip of war and political turmoil for the past two decades.</p>';
sceneParams[2].finTrace_strokeWidth = 1.5;
sceneParams[2].afgTrace_strokeWidth = 10;
sceneParams[2].afgTrace_visibility = 'visible';

sceneParams[3] = {...sceneParams[1]};
sceneParams[3].textPanel_HTML = '<h3>Australia = Very Happy</h3><p>Australia has enjoyed high, stable happiness in recent decades.</p><p>There appears to be a gradual downward trend.</p>';
sceneParams[3].finTrace_strokeWidth = 1.5;
sceneParams[3].ausTrace_strokeWidth = 10;
sceneParams[3].afgTrace_visibility = 'visible';
sceneParams[3].ausTrace_visibility = 'visible';

sceneParams[4] = {...sceneParams[1]};
sceneParams[4].textPanel_displaymode = 'block';
sceneParams[4].textPanel_HTML = '<h3>Explore: How do other wellbeing indicators compare?</h3><p>Select a wellbeing indicator from the pulldown menu above the chart on the right. </p>';
//
sceneParams[4].textPanel_height = '15%';
sceneParams[4].chartOne_height = '85%';
sceneParams[4].legendBar_height = '85%';
//
sceneParams[4].textPanel_width = '100%';
sceneParams[4].chartOne_width = '40%';
sceneParams[4].chartTwo_displayMode = 'inline-block';
//
sceneParams[4].finTrace_strokeWidth = 1.5;
sceneParams[4].afgTrace_strokeWidth = 1.5;
sceneParams[4].ausTrace_strokeWidth = 1.5;
//
sceneParams[4].afgTrace_visibility = 'visible';
sceneParams[4].ausTrace_visibility = 'visible';


// ****************************************
// ------ FUNCTIONS: INITIALISATION ------

async function init()
// This function called when the HTML body finishes loading.
// It initialises by reading the data, creating DOM objects, charts.
// Then it displays the first scene. 
{

  // Read in the data for chartTwo
  DATA2 = await d3.csv('../data/data_chartTwo.csv');
  // group the data by country (because we want one line per country)
  DATA2_BY_COUNTRY = d3.group(DATA2, d => d.country); 
  

  await createLegendBar();
  await createChartOne();
  await createChartTwo();

  await displayScene(1);

  // document.addEventListener("onload", celebrateLoad())
  
  obj=document.getElementById("indicatorExplanationHoverBox")
  obj.addEventListener("mouseover", displayIndicatorExplanation);
  obj.addEventListener("mouseout", hideIndicatorExplanation); 
}

function createLegendBar(){
  // This function only called once, during init.

  const lbar = d3.select('#legendBar')

  lbar.append('div')
    .attr()

}

async function createChartOne(){
  // This function only called once, during init.

  // Read in the data for chartOne
  const data1 = await d3.csv('../data/data_chartOne.csv')
  // const data1 = [{Year : 2008, Finland : 2},{Year : 2010, Finland : 5},{Year : 2012, Finland : 6}];
  // console.log("Dataset load complete")  
  // console.log(data1)

  // Set dimensions and margins of plot
  const margin = {top: 100, right: 30, bottom: 30, left: 60},
      width = 360 - margin.left - margin.right,
      height = 410 - margin.top - margin.bottom;

  // Append svg object to page body (only put a div object in)
  const svg = d3.select("#chartOne")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  // group the data by country (because we want one line per country

  // Add X axis (year)
  const x = d3.scaleLinear()
    .domain(d3.extent(data1, function(d) { return d.Year;}))
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5));  // TODO: Amend to number of years

  // Add Y axis (indicator value)
  const y = d3.scaleLinear()
    .domain([0, 10])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette
  // const color = d3.scaleOrdinal()
  //   .range(['#e41a1c','#377eb8'])  // Change to match number of countries

  // Draw line for Finland
  svg.append("path")
    .datum(data1)
    .attr("id","finTrace")
    .transition()
    .duration(1000)
    .attr("fill", "none")
    .attr("stroke", "green")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
        .x(function(d) { return x(d.Year); })
        .y(function(d) { return y(d.Finland); })
      );

  // Draw line for Afghanistan
  svg.append("path")
    .datum(data1)
    .attr("id","afgTrace")
    .transition()
    .duration(1000)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1)
    .attr("d", d3.line()
        .x(function(d) { return x(d.Year); })
        .y(function(d) { return y(d.Afghanistan); })
      );

    // Draw line for Australia
    svg.append("path")
    .datum(data1)
    .attr("id","ausTrace")
    .transition()
    .duration(1000)
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
        .x(function(d) { return x(d.Year); })
        .y(function(d) { return y(d.Australia); })
      );
}

async function createChartTwo(){
  // This function is called only once, during init.
  // To update the chart, a separate function is used, which selects instead of appends.
  // (This allows for neat transitions!)

  // Set dimensions and margins of plot
  const margin = {top: 100, right: 30, bottom: 30, left: 60},
      width = 360 - margin.left - margin.right,
      height = 410 - margin.top - margin.bottom;

  // Append svg object to page body (only put a div object in)
  const svg = d3.select("#chartTwo")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("id","chartTwo_plotArea")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
  // Add X axis (year)
  const x = d3.scaleLinear()
    .domain(d3.extent(DATA2, function(d) { return d.year; }))
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .attr("id","chartTwo_xAxis")
    .call(d3.axisBottom(x).ticks(5));  // TODO: Amend to number of years

  // Add Y axis (indicator value)
  const y = d3.scaleLinear()
    .domain([d3.min(DATA2, function(d) { return +d.gdp; }), d3.max(DATA2, function(d) { return +d.gdp; })])
    .range([ height, 0 ]);
  svg.append("g")
    .attr("id","chartTwo_yAxis")
    .call(d3.axisLeft(y));
  
  // Draw the line
  svg.selectAll(".line")
      .data(DATA2_BY_COUNTRY)
      .join("path")
        .transition()
        .duration(1000)
        .attr("fill", "none")
        .attr("stroke", function(d){ return COLOUR_COUNTRY(d[0]) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(+d.gdp); })
            (d[1])
        })

}


// ****************************************
// ------ FUNCTIONS: SCENE TRANSITIONS ------

function requestScene(requestedScene){
  // This function gets triggered by a button press on the nav bar.
  // Its purpose is to set the requested Scene ID to a (valid) number, 
  // and then request the scene to be displayed. 

  let newSceneId = -1;  // This will hold the scene ID of the scene to display next.

  // Determine which number scene is actually being requested
  if (requestedScene=='nextScene') {newSceneId = SCENEID + 1;}
  else if (requestedScene=='prevScene') {newSceneId = SCENEID - 1;}
  else {newSceneId = requestedScene;}

  // Cap the new Scene Id to within valid range
  if (newSceneId < 1) {newSceneId=1;}
  if (newSceneId > MAXSCENE) {newSceneId=MAXSCENE;}

  // Display the new Scene
  if (newSceneId != SCENEID) {
    displayScene(newSceneId);
  }
}

async function displayScene(sceneId){
  // This function always gets called by 'requestScene()' after a button press. 
  // Its purpose is to display the new Scene.
  SCENEID = sceneId;

  // Nav bar: Enable all buttons, then disable specific ones for this scene
  document.getElementById('buttonPrev').disabled=false;
  document.getElementById('button1').disabled=false;
  document.getElementById('button2').disabled=false;
  document.getElementById('button3').disabled=false;
  document.getElementById('button4').disabled=false;
  document.getElementById('buttonNext').disabled=false;
  // For some reason I can't get bulk-enabling to work!
  //d3.selectAll('button').attr('disabled','false');
  // document.querySelector('#button1').disabled=false;
  // document.getElementsByTagName('button').setAttribute('disabled', 'false');
  d3.select('#button'+SCENEID).attr('disabled','true');
  if (SCENEID==1) {document.getElementById('buttonPrev').disabled=true;}
  if (SCENEID==MAXSCENE) {document.getElementById('buttonNext').disabled=true;}

  // Display textPanel
  curSel = d3.select('#textPanel');
  curSel.html("");
  curSel.style('height',sceneParams[SCENEID].textPanel_height)

  curSel
  .style('display',sceneParams[SCENEID].textPanel_displaymode)
  .style('width',sceneParams[SCENEID].textPanel_width);

  curSel.html(sceneParams[SCENEID].textPanel_HTML);

  // Display chartOne
  curSel = d3.select('#chartOne');
  curSel.style('height',sceneParams[SCENEID].chartOne_height)
  curSel.style('width',sceneParams[SCENEID].chartOne_width)

  // Adjust chartOne country trace thickness
  d3.select('#finTrace').transition().duration(1000)
    .attr('stroke-width', sceneParams[SCENEID].finTrace_strokeWidth);
  d3.select('#afgTrace').transition().duration(1000)
    .attr('stroke-width', sceneParams[SCENEID].afgTrace_strokeWidth)
    .attr('visibility', sceneParams[SCENEID].afgTrace_visibility);
  d3.select('#ausTrace').transition().duration(1000)
    .attr('stroke-width', sceneParams[SCENEID].ausTrace_strokeWidth)
    .attr('visibility', sceneParams[SCENEID].ausTrace_visibility);

  // Display legendBar
  curSel = d3.select('#legendBar');
  curSel.style('height',sceneParams[SCENEID].legendBar_height)
  curSel.style('width',sceneParams[SCENEID].legendBar_width)

  // Display (or hide!) chartTwo
  curSel = d3.select('#chartTwo');
  curSel.style('display',sceneParams[SCENEID].chartTwo_displayMode)

}


// ****************************************
// ------ FUNCTIONS: EVENT HANDLING ------
// These functions only get called once, by init() 


function displayIndicatorExplanation(){
  // console.log('hey');
  d3.select("#ladderExplanation")
  .style('visibility','visible');

  d3.select("#wellbeingExplanation")
  .style('visibility','visible');
}

function hideIndicatorExplanation(){
  // console.log('hey');
  d3.select("#ladderExplanation")
  .style('visibility','hidden');

  d3.select("#wellbeingExplanation")
  .style('visibility','hidden');

}

function updateChartTwo(){
  // d3.select('#chartTwo').style('background-color', 'red');
  // console.log('yep')
  let selectedOption = d3.select('#wellbeingIndicator').property('value');
  // console.log(selectedOption)

  // Set dimensions and margins of plot
  const margin = {top: 100, right: 30, bottom: 30, left: 60},
  width = 360 - margin.left - margin.right,
  height = 410 - margin.top - margin.bottom;

  const svg = d3.select("#chartTwo_plotArea")

  // Remove old lines
  svg.selectAll('path').remove()

  // Redefine X axis (year) - not for updating on graph, but required for line plotting
  const x = d3.scaleLinear()
    .domain(d3.extent(DATA2, function(d) { return d.year; }))
    .range([ 0, width ]);
  svg.select("#chartTwo_xAxis")
    .call(d3.axisBottom(x).ticks(5));  // TODO: Amend to number of years

  // Update Y-axis
  const y = d3.scaleLinear()
    .domain([d3.min(DATA2, function(d) { return +d[selectedOption]; }), d3.max(DATA2, function(d) { return +d[selectedOption]; })])
    .range([ height, 0 ]);
  svg.select("#chartTwo_yAxis")
    .transition()
    .duration(1000)
    .call(d3.axisLeft(y));


  // Update line paths
  svg.selectAll(".line")
  .data(DATA2_BY_COUNTRY)
  .join("path")
    .transition()
    .duration(1000)
    .attr("fill", "none")
    .attr("stroke", function(d){ return COLOUR_COUNTRY(d[0]) })
    .attr("stroke-width", 1.5)
    .attr("d", function(d){
      return d3.line()
        .x(function(d) { return x(d.year); })
        .y(function(d) { return y(+d[selectedOption]); })
        (d[1])
    })

}