var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 60
}

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "age";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(ageData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(ageData, d => d[chosenXAxis]) * 0.8,
      d3.max(ageData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

function yScale(obesityData, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([16, d3.max(obesityData, d => d[chosenYAxis])])
      .range([height, 0]);
  
    return yLinearScale;
  }
  
// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv", function(err, healthData) {
  if (err) throw err;

  // parse data
  healthData.forEach(function(data) {
    data.age = +data.age;
    data.obesity = +data.obesity;
    data.income = +data.income;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(healthData, chosenXAxis);

  // yLinearScale function above csv import
  var yLinearScale = yScale(healthData,chosenYAxis);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // Creates the circle container to attach the data to it
  var elem = chartGroup.selectAll("g myCircleText")
    .data(healthData)

  //Create and place the "blocks" containing the circle and the text
  var elemEnter = elem.enter()

  //Create the circle for each block
  var circle = elemEnter.append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 12)
    .attr("fill", "lightblue")
    .attr("opacity", ".7");

  //Create the text for each block
  var myText= elemEnter.append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis])-7)
    .attr("y", d => yLinearScale(d[chosenYAxis])+4)
    .attr("font-family","sans-serif")
    .attr("font-size","10px")
    .attr("fill","white")
    .text(function(d){return d.abbr})

  // Create group for x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "age") 
    .classed("axis-text", true)
    .text("Age");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 1.5))
    .attr("value", "obesity")
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Obesity (Median BMI)");
})