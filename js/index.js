// ------ STATE VARIABLES ------

let SCENEID = 1;

// ----- GLOBAL VARIABLES ----

const MAXSCENE = 4;
let DATA2 = {}; // Needs to be global because it's read during init(), but used repeatedly elsewhere.
let DATA2_BY_COUNTRY = {};   // Needs to be global because it's read during init(), but used repeatedly elsewhere.
let COLOUR_COUNTRY = d3.scaleOrdinal().range(['red','blue','green']);  // One for each country
const BOX_OPACITY = 0.9; // For the boxes containing indicator explanation text

const CHART_MARGIN = {top: 60, right: 20, bottom: 30, left: 60};
const CHART_WIDTH = 410 - CHART_MARGIN.left - CHART_MARGIN.right;
const CHART_HEIGHT = 410 - CHART_MARGIN.top - CHART_MARGIN.bottom;

const INDICATOR_TEXT = {
  // The text to be displayed over Chart Two, explaining indicator metrics
  gdp : "Log GDP per capita is expressed in purchasing power parity (PPP) at constant 2017 international dollar prices.</option",
  social : 'National average of the binary responses (either 0 or 1) to the question "If you were in trouble, do you have relatives or friends you can count on to help you whenever you need them, or not?"',
  lifeexp : "Healthy life expectancies at birth are based on the data extracted from the World Health Organization’s (WHO) Global Health Observatory data repository (Last updated: 2020-12-04). The data at the source are available for the years 2000, 2010, 2015 and 2019. To match this report’s sample period, interpolation and extrapolation are used.",
  freechoice : 'National average of responses to the GWP question “Are you satisfied or dissatisfied with your freedom to choose what you do with your life?”',
  generosity : 'The residual of regressing national average of response to the question “Have you donated money to a charity in the past month?” on GDP per capita.',
  corruption : 'National average of the survey responses to two questions in the GWP: “Is corruption widespread throughout the government or not” and “Is corruption widespread within businesses or not?” The overall perception is just the average of the two 0-or-1 responses. In case the perception of government corruption is missing, we use the perception of business corruption as the overall perception.',
  posaffect : 'National average of three positive affect measures: laugh, enjoyment and doing interesting things in the Gallup World Poll. These measures are the responses to the following three questions, respectively: “Did you smile or laugh a lot yesterday?”, and “Did you experience the following feelings during A LOT OF THE DAY yesterday? How about Enjoyment?”, “Did you learn or do something interesting yesterday?”',
  negaffect : 'National average of three negative affect measures. They are worry, sadness and anger, respectively the responses to “Did you experience the following feelings during A LOT OF THE DAY yesterday? How about Worry?”, “Did you experience the following feelings during A LOT OF THE DAY yesterday? How about Sadness?”, and “Did you experience the following feelings during A LOT OF THE DAY yesterday? How about Anger?”',
}

// ****************************************
// ------ SCENE PARAMETER DEFINITION ------

// These define only the DIFFERENCES between scenes
// The index of sceneParams corresponds to the SCENEID that should be looked up
// E.g.: sceneParams[2].chartOne_color     will hold the color chartOne should have in Scene 2.

const sceneParams = [];

sceneParams[1] = {
  textPanel_displaymode : 'inline-block',
  textPanel_HTML : '<h3><br><br><br>Finland = Most Happy</h3><br><p>Finland has enjoyed consistently high happiness since 2008.</p><p>There appears to be a slight upwards trend.</p>',

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

  legendAfg_opacity : 0,
  legendAus_opacity : 0,

  annotationOpacity: 1,
  annotationLineCoords : [[270, 230], [323, 135]],
  annotationText : "Highest value: 7.89 in 2020",
  annotationText_x : 230,
  annotationText_y : 250,
};

// Define all the other scenes as a copy of Scene 1, then differences.

sceneParams[2] = {...sceneParams[1]};
sceneParams[2].textPanel_HTML = '<h3><br><br><br>Afghanistan = Least Happy</h3><br><p>Afghanistan is a nation in crisis.</p><p>The country has been in the grip of war and political turmoil for the past two decades.</p><p>Happiness has trended down sharply, with a temporary rebound in 2015-16.</p>';
sceneParams[2].finTrace_strokeWidth = 1.5;
sceneParams[2].afgTrace_strokeWidth = 10;
sceneParams[2].afgTrace_visibility = 'visible';
sceneParams[2].legendAfg_opacity = 1;
sceneParams[2].annotationText = "Brief rebound in 2015-16";
sceneParams[2].annotationText_x = 250;
sceneParams[2].annotationText_y = 180;
sceneParams[2].annotationLineCoords = [[230, 240], [260, 187]];

sceneParams[3] = {...sceneParams[1]};
sceneParams[3].textPanel_HTML = '<h3><br><br><br>Australia = Very Happy</h3><br><p>Australia has enjoyed high, stable happiness in recent decades.</p><p>There appears to be a gradual downward trend.</p>';
sceneParams[3].finTrace_strokeWidth = 1.5;
sceneParams[3].ausTrace_strokeWidth = 10;
sceneParams[3].afgTrace_visibility = 'visible';
sceneParams[3].ausTrace_visibility = 'visible';
sceneParams[3].legendAfg_opacity = 1;
sceneParams[3].legendAus_opacity = 1;
sceneParams[3].annotationText = "Lowest value: 7.03 in 2023";
sceneParams[3].annotationText_x = 270;
sceneParams[3].annotationText_y = 230;
sceneParams[3].annotationLineCoords = [[340, 210], [385, 165]];

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
sceneParams[4].legendAfg_opacity = 1;
sceneParams[4].legendAus_opacity = 1;
//
sceneParams[4].annotationOpacity = 0;
sceneParams[4].annotationText_x = 270;
sceneParams[4].annotationText_y = 230;
sceneParams[4].annotationLineCoords = [[340, 210], [385, 165]];

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
  await createAnnotation();

  await displayScene(1);

  // document.addEventListener("onload", celebrateLoad())
  
  obj=document.getElementById("indicatorExplanationHoverBox")
  obj.addEventListener("mouseenter", displayIndicatorExplanation);
  obj.addEventListener("mouseleave", hideIndicatorExplanation); 
}

function createLegendBar(){
  // This function only called once, during init.

  const svg = d3.select('#legend').append('svg')

  svg.style('position','absolute')

  svg.append("circle")
    .attr('class','legendFin')
    .attr("cx",30)
    .attr("cy",8)
    .attr("r", 6)
    .style("fill", "green");

    svg.append("circle")
    .attr('class','legendAfg')
    .attr("cx","10%")
    .attr("cy","50%")
    .attr("r", 6)
    .style("fill", "red");

    svg.append("circle")
    .attr('class','legendAus')
    .attr("cx","10%")
    .attr("cy","95%")
    .attr("r", 6)
    .style("fill", "blue");
    
}

async function createChartOne(){
  // This function only called once, during init.

  // Read in the data for chartOne
  const data1 = await d3.csv('../data/data_chartOne.csv')

  // Append svg object to chart
  const svg = d3.select("#chartOne")
    .append("svg")
      .attr("width", CHART_WIDTH + CHART_MARGIN.left + CHART_MARGIN.right)
      .attr("height", CHART_HEIGHT + CHART_MARGIN.top + CHART_MARGIN.bottom)
    .append("g")
      .attr("transform", `translate(${CHART_MARGIN.left},${CHART_MARGIN.top})`);

  // group data by country (because we want one line per country)

  // Add X axis (year)
  const x = d3.scaleLinear()
    .domain(d3.extent(data1, function(d) { return d.Year;}))
    .range([ 0, CHART_WIDTH ]);
  svg.append("g")
    .attr("transform", `translate(0, ${CHART_HEIGHT})`)
    .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d")));  // TODO: Amend to number of years
  

  // Add Y axis (indicator value)
  const y = d3.scaleLinear()
    .domain([0, 10])
    .range([ CHART_HEIGHT, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

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

  // Append svg object
  const svg = d3.select("#chartTwo")
    .append("svg")
      .attr("width", CHART_WIDTH + CHART_MARGIN.left + CHART_MARGIN.right)
      .attr("height", CHART_HEIGHT + CHART_MARGIN.top + CHART_MARGIN.bottom)
    .append("g")
      .attr("id","chartTwo_plotArea")
      .attr("transform", `translate(${CHART_MARGIN.left},${CHART_MARGIN.top})`);
  
  // Add X axis (year)
  const x = d3.scaleLinear()
    .domain(d3.extent(DATA2, function(d) { return d.year; }))
    .range([ 0, CHART_WIDTH ]);
  svg.append("g")
    .attr("transform", `translate(0, ${CHART_HEIGHT})`)
    .attr("id","chartTwo_xAxis")
    .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d")));  // TODO: Amend to number of years

  // Add Y axis (indicator value)
  const y = d3.scaleLinear()
    .domain([d3.min(DATA2, function(d) { return +d.gdp; }), d3.max(DATA2, function(d) { return +d.gdp; })])
    .range([ CHART_HEIGHT, 0 ]);
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
        });

  // Update the indicator explanation text for the hover box
  d3.select('#wellbeingExplanation')
    .html(INDICATOR_TEXT.gdp);
}

async function createAnnotation(){
  
  svg = d3.select("#chartOne").select('svg')

  // Line
  svg.append('path')
    .attr('id','annotationLine')
    .attr('d', d3.line()([[0, 0], [0, 0]]))
    .attr('stroke', 'grey')
    .attr('fill', "none")
    .attr("stroke-width", "1px");

  // Text
  svg.append('text')
    .attr('id','annotationText')
    .attr("x", 220)
    .attr("y", 220)
    .style('fill', 'grey')
    .style("text-anchor", "middle")
    .text("Placeholder");
}


// ****************************************
// ------ FUNCTIONS: SCENE TRANSITIONS ------

async function requestScene(requestedScene){
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
    await displayScene(newSceneId);
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

  curSel
    .style('height',sceneParams[SCENEID].textPanel_height)
    .style('display',sceneParams[SCENEID].textPanel_displaymode)
    .style('width',sceneParams[SCENEID].textPanel_width);

  curSel.html(sceneParams[SCENEID].textPanel_HTML);
  
  curSel
    .style('opacity',0)
    .transition()
    .duration(1000)
    .style('opacity',1);

  // Display chartOne
  curSel = d3.select('#chartOne');
  curSel.style('height',sceneParams[SCENEID].chartOne_height);
  curSel.style('width',sceneParams[SCENEID].chartOne_width);

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
  curSel.style('height',sceneParams[SCENEID].legendBar_height);
  curSel.style('width',sceneParams[SCENEID].legendBar_width);

  // Display (or hide!) individual legend entries
  d3.selectAll('.legendAfg').transition().duration(1000)
    .style('opacity',sceneParams[SCENEID].legendAfg_opacity);
  d3.selectAll('.legendAus').transition().duration(1000)
    .style('opacity',sceneParams[SCENEID].legendAus_opacity);

  // Display (or hide!) chartTwo
  curSel = d3.select('#chartTwo');
  curSel.style('display',sceneParams[SCENEID].chartTwo_displayMode);

  // Update the annotation
  curSel = d3.select('#annotationLine');
  curSel
    .transition()
    .duration(1000)
    .style('opacity',sceneParams[SCENEID].annotationOpacity)
    .attr('d', d3.line()(sceneParams[SCENEID].annotationLineCoords));

  curSel = d3.select('#annotationText');
  curSel
  .transition()
  .duration(1000)
  .style('opacity',sceneParams[SCENEID].annotationOpacity)
  .text(sceneParams[SCENEID].annotationText)
  .attr("x", sceneParams[SCENEID].annotationText_x)
  .attr("y", sceneParams[SCENEID].annotationText_y);

}


// ****************************************
// ------ FUNCTIONS: EVENT HANDLING ------
// These functions only get called once, by init() 


function displayIndicatorExplanation(){
  d3.select("#ladderExplanation")
  .transition()
  .duration(500)
  .style('opacity',BOX_OPACITY);

  d3.select("#wellbeingExplanation")
  .transition()
  .duration(500)
  .style('opacity',BOX_OPACITY);
}

function hideIndicatorExplanation(){
  d3.select("#ladderExplanation")
  .transition()
  .duration(1000)
  .style('opacity','0');

  d3.select("#wellbeingExplanation")
  .transition()
  .duration(1000)
  .style('opacity','0');

}

function updateChartTwo(){
  let selectedOption = d3.select('#wellbeingIndicator').property('value');

  const svg = d3.select("#chartTwo_plotArea")

  // Remove old lines
  svg.selectAll('path').remove()

  // Redefine X axis (year) - not for updating on graph, but required for line plotting
  const x = d3.scaleLinear()
    .domain(d3.extent(DATA2, function(d) { return d.year; }))
    .range([ 0, CHART_WIDTH ]);
  svg.select("#chartTwo_xAxis")
    .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format("d")));  // TODO: Amend to number of years

  // Update Y-axis
  const y = d3.scaleLinear()
    .domain([d3.min(DATA2, function(d) { return +d[selectedOption]; }), d3.max(DATA2, function(d) { return +d[selectedOption]; })])
    .range([ CHART_HEIGHT, 0 ]);
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
    });

  // Update the indicator explanation text for the hover box
  d3.select('#wellbeingExplanation')
    .html(INDICATOR_TEXT[selectedOption]);
  
}