// Set up the chart dimensions
const width = 800;
const height = 600; // Adjusted height for the bar chart
const padding = 60; // Increased padding for better visualization

// Load your CSV data (replace with your actual data file)
d3.csv("mutualfunds.csv").then((data) => {
  // Group data by the "Category" column
  const groupedData = d3.group(data, (d) => d.Category);

  // Calculate average values for each category and time period
  const categoryAverages = Array.from(groupedData, ([category, values]) => ({
    Category: category,
    YTD: d3.mean(values, (d) => +d.YTD),
    MO3: d3.mean(values, (d) => +d.MO3),
    YR1: d3.mean(values, (d) => +d.YR1),
    YR3: d3.mean(values, (d) => +d.YR3),
    YR5: d3.mean(values, (d) => +d.YR5),
    YR10: d3.mean(values, (d) => +d.YR10),
  }));

  // Define colors for each time period
  const timePeriodColors = {
    YTD: "#e12729", //Red
    MO3: "#238ad4", //Blue
    YR1: "#f8cc1b", //Yellow
    YR3: "#72b043", //Green
    YR5: "#f37324", //Orange
    YR10: "#A569BD", //Lavender
  };

  // Create the SVG element inside the div with ID "barChart"
  const svg = d3.select("#barChart")
    .append("svg") // Create the SVG element
    .attr("width", width)
    .attr("height", height);

  // Create X and Y scales
  const x = d3.scaleBand()
    .domain(categoryAverages.map((d) => d.Category))
    .range([padding, width - padding])
    .padding([0.2]);

  const y = d3.scaleLinear()
    .domain([
      d3.min(categoryAverages, (d) => d3.min([d.YTD, d.MO3, d.YR1, d.YR3, d.YR5, d.YR10])),
      d3.max(categoryAverages, (d) => d3.max([d.YTD, d.MO3, d.YR1, d.YR3, d.YR5, d.YR10]))
    ])
    .nice()
    .range([height - padding, padding]);

  // Add grid lines (behind bars)
  svg.append("g")
    .attr("class", "grid")
    .attr("transform", `translate(${padding},0)`)
    .call(d3.axisLeft(y).tickSize(-width + 2 * padding).tickFormat(""))
    .selectAll("line")
    .attr("stroke", (d) => (d === 0) ? "black" : "gainsboro"); // Set zero line color to black
  
  // Create grouped bars for each time period
  const timePeriods = Object.keys(timePeriodColors);
  timePeriods.forEach((timePeriod, i) => {
    svg.selectAll(".bar-" + timePeriod)
      .data(categoryAverages)
      .enter()
      .append("rect")
      .attr("class", "bar-" + timePeriod)
      .attr("x", (d) => x(d.Category) + x.bandwidth() * (i / timePeriods.length))
      .attr("y", (d) => (d[timePeriod] >= 0) ? y(d[timePeriod]) : y(0))
      .attr("width", x.bandwidth() / timePeriods.length)
      .attr("height", (d) => Math.abs(y(d[timePeriod]) - y(0)))
      .attr("fill", timePeriodColors[timePeriod])
      .on("mouseover", function (event, d) {
        // Show value, category, and type on hover
        const value = d[timePeriod].toFixed(2); // Format value to 2 decimal places
        const category = d.Category;
        const type = timePeriod;
        const xPosition = width / 2; // Position tooltip in the middle
        const yPosition = padding; // Position tooltip at the top
        svg.append("text")
          .attr("class", "bar-label")
          .attr("x", xPosition)
          .attr("y", yPosition -5)
          .text(`${category} (${type}): ${value}`)
          .style("fill", "black")
          .style("font-size", "12px")
          .style("text-anchor", "middle");
      })
      .on("mouseout", function () {
        // Remove label when not hovering
        svg.selectAll(".bar-label").remove();
      });
  });

  // Add X and Y axes
  svg.append("g")
    .attr("transform", `translate(0,${height - padding})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .attr("transform", `translate(${padding},0)`)
    .call(d3.axisLeft(y));

  // Add legend
  const legend = svg.append("g")
    .attr("transform", `translate(${width - padding}, ${padding})`);

  Object.entries(timePeriodColors).forEach(([timePeriod, color], i) => {
    legend.append("rect")
      .attr("x", 0)
      .attr("y", i * 20)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", color);

    legend.append("text")
      .attr("x", 20)
      .attr("y", i * 20 + 12)
      .text(timePeriod);
  });

  // Set the text color to black
  d3.selectAll("text").style("fill", "black");
});
