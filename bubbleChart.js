d3.csv("mutualfunds.csv").then(function(data) {
    // Data preprocessing and visualization code
    // Convert string values to numbers where necessary
    data.forEach(function(d) {
        d.YTD = +d.YTD;
        d.ExpenseRatio = +d.ExpenseRatio;
        d.NetAssets = +d.NetAssets.replace(/,/g, ""); // Remove commas and convert to number
    });

    // Set up the chart dimensions
    var margin = { top: 20, right: 20, bottom: 70, left: 70 },
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // Append SVG to the body
    var svg = d3.select("#bubbleChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define scales for X and Y axes
    var x = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.ExpenseRatio; })])
        .range([0, width]);

    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.NetAssets; })])
        .range([height, 0]);

    // Define scale for bubble size
    var bubbleSize = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) { return d.YTD; })])
        .range([5, 30]); // Set range for bubble radius

    // Define color scale based on category
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // Add X-axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .attr("y", 40)
        .attr("x", width / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text("Expense Ratio");

    // Add Y-axis
    svg.append("g")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -50)
        .attr("x", -height / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "black")
        .text("Net Assets");

    // Add bubbles
    svg.selectAll("bubble")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) { return x(d.ExpenseRatio); })
        .attr("cy", function(d) { return y(d.NetAssets); })
        .attr("r", function(d) { return bubbleSize(d.YTD); })
        .style("fill", function(d) { return color(d.Category); })
        .style("opacity", 0.7)
        .style("stroke", "black");

    // Add legend
    var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
});
