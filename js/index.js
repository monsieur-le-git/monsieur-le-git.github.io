// ------ STATE VARIABLES ------

let SCENEID = 0;

// ----- GLOBAL VARIABLES ----

const MAXSCENE = 4;
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
};

sceneParams[2] = {...sceneParams[1]};
sceneParams[2].textPanel_HTML = '<h3>Afghanistan = Least Happy</h3><p>Afghanistan is a nation in crisis.</p><p>The country has been in the grip of war and political turmoil for the past two decades.</p>';

sceneParams[3] = {...sceneParams[1]};
sceneParams[3].textPanel_HTML = '<h3>Australia = Very Happy</h3><p>Australia has enjoyed high, stable happiness in recent decades.</p><p>There appears to be a gradual downward trend.</p>';

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


// ****************************************
// ------ FUNCTIONS: INITIALISATION ------

async function init()
// This function called when the HTML body finishes loading.
// It initialises by reading the data, creating DOM objects, charts.
// Then it displays the first scene. 
{
  createLegendBar();
  createChartOne();
  createChartTwo();

  displayScene(1);

  // document.addEventListener("onload", celebrateLoad())
}

function createLegendBar(){

}

async function createChartOne(){
  // This function only called once, during init.

  // Read in the data for chartOne
  const data1 = await d3.csv('../data/data_chartOne.csv')
  // console.log("Dataset load complete")  
  // const dataset = await d3.csv('../data/basic-test.csv')

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
    .domain([0, d3.max(data1, function(d) { return +d.Finland; })])
    .range([ height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette
  const color = d3.scaleOrdinal()
    .range(['#e41a1c','#377eb8'])  // Change to match number of countries

  // Draw line for Finland
  svg.append("path")
      .datum(data1)
      .transition()
      .duration(1000)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 1.5)
      .attr("d", d3.line()
          .x(function(d) { return x(d.Year); })
          .y(function(d) { return y(d.Finland); })
        )
}

async function createChartTwo(){
  // This function only called once, during init.

  // Read in the data for chartTwo
  // const data2 = await d3.csv('../data/chartTwo.csv')
  const dataset = await d3.csv('../data/basic-test.csv')
  // console.log("Dataset load complete")

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
      .attr("transform", `translate(${margin.left},${margin.top})`);

  // group the data by country (because we want one line per country
  const dataset_by_country = d3.group(dataset, d => d.country); 

  // Add X axis (year)
  const x = d3.scaleLinear()
    .domain(d3.extent(dataset, function(d) { return d.year; }))
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).ticks(5));  // TODO: Amend to number of years

  // Add Y axis (indicator valoue)
  const y = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) { return +d.ladder; })])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // color palette
  const color = d3.scaleOrdinal()
    .range(['#e41a1c','#377eb8'])  // Change to match number of countries

  // Draw the line
  svg.selectAll(".line")
      .data(dataset_by_country)
      .join("path")
        .transition()
        .duration(1000)
        .attr("fill", "none")
        .attr("stroke", function(d){ return color(d[0]) })
        .attr("stroke-width", 1.5)
        .attr("d", function(d){
          return d3.line()
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(+d.ladder); })
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