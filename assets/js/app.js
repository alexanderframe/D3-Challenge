(async function(){
  // Create svg area and chart dimensions 
  const 
      svgWidth = 1000
      svgHeight = 600
      margin = {
          top: 20,
          right: 20,
          bottom: 40,
          left: 17
        }
        width = svgWidth - margin.left - margin.right
        height = svgHeight - margin.top - margin.bottom;

  // Create an SVG wrapper, append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  const svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr('class', 'chart');


// Append an SVG group
  const chartGroup = svg.append("g")
        .attr('transform', 'translate(47, 0)')


// Retrieve data from the CSV file and execute everything below
  const demoData = await d3.csv('/assets/data/data.csv');


  // parse data
  demoData.forEach(function(data) {
    data.smokes = parseFloat(data.smokes);
    data.poverty = parseFloat(data.poverty);
  });


  // Create x and y scales
  const xLinearScale = d3.scaleLinear()
    .domain([d3.min(demoData, d => d.poverty)*0.95, 
      d3.max(demoData, d => d.poverty)*1.05]) 
    .range([0, width]);

  const yLinearScale = d3.scaleLinear()
    .domain([d3.min(demoData, d => d.smokes)*.95, d3.max(demoData, d => d.smokes)*1.1])
    .range([height, 0]);


  // Create initial axis functions
  const bottomAxis = d3.axisBottom(xLinearScale);
  const leftAxis = d3.axisLeft(yLinearScale);
  
  // Append x axis
  const xAxis = chartGroup.append('g')
      .classed('x-axis', true)
      .attr('transform', `translate(0, ${height})`)
      .call(bottomAxis);

  // Append y axis
  const yAxis = chartGroup.append('g')
      .classed('y-axis', true)
      .call(leftAxis);


  // Create Axes Labels
  chartGroup.append('text')
    .attr("transform", `translate(${width / 2}, ${height + 20})`)
    .attr('y', 20)
    .attr('value', 'poverty')
    .classed('aText', true)
    .text('In Poverty (%)');

  chartGroup.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', 0-(height/2))
    .attr('y', -30)
    .attr('value', 'smoke_percent')
    .classed('aText', true)
    .text('Smokes (%)');


  // Create circle group
  const circleGroup = chartGroup.selectAll('circle')
      .data(demoData)
      .enter()
      .append('circle')
      .attr('cx', d => xLinearScale(d.poverty))
      .attr('cy', d => yLinearScale(d.smokes))
      .attr('r', '13')
      .classed('stateCircle', true)
      .attr('opacity', '0.85')
  
  // Add text to circles
  const textGroup = chartGroup.selectAll('.stateText')
      .data(demoData)
      .enter()
      .append('text')
      .classed('stateText', true)
      .attr('x', d => xLinearScale(d.poverty))
      .attr('y', d => yLinearScale(d.smokes) + 2.5)
      .text(d => d.abbr)


  // Tooltips (make sure to add tooltip cdn source into html)
  const toolTip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([80, 65])
      .html(function(d) {
        return (`${d.state}<br>In Poverty (%): ${d.poverty}<br>Smokes (%): ${d.smokes}`);
      });

  // Add tooltip to chart
  chartGroup.call(toolTip);

  // Display tooltip on mouse-over
  circleGroup.on('mouseover', function(data) {
    toolTip.show(data, this)
    d3.select(this)
      .classed('stateCircle', false)
      .classed('hoverCircle', true)
      .attr('stroke', 'black');
  });

    // Hide tooltip on mouse-out
  circleGroup.on('mouseout', function(data, index) {
    toolTip.hide(data)
    d3.select(this)
      .classed('hoverCircle', false)
      .classed('stateCircle', true)
      .attr('opacity', '0.85');
  });
})()      
