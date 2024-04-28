// Load the mutual funds data asynchronously
d3.csv("mutualfunds.csv").then(function(data) {
    // Data preprocessing and visualization code
    // Convert string values to numbers where necessary
    data.forEach(function(d) {
        d.YTD = +d.YTD;
    });

    // Aggregate data by category and calculate average returns
    var categoryData = data.reduce(function(acc, curr) {
        var category = curr.Category;
        var ytd = curr.YTD;
        if (!acc[category]) {
            acc[category] = { sum: ytd, count: 1 };
        } else {
            acc[category].sum += ytd;
            acc[category].count++;
        }
        return acc;
    }, {});

    // Calculate average returns for each category
    Object.keys(categoryData).forEach(function(category) {
        categoryData[category] = categoryData[category].sum / categoryData[category].count;
    });

    // Convert aggregated data to an array of objects
    var categoryDataArray = Object.keys(categoryData).map(function(category) {
        return { key: category, value: categoryData[category] };
    });

    // Sort categories based on average returns
    categoryDataArray.sort(function(a, b) { return b.value - a.value; });

    // Set up chart dimensions
    var margin = { top: 20, right: 20, bottom: 70, left: 70 },
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // Append SVG for bar chart
    var svg = d3.select("#barChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define X and Y scales
    var x = d3.scaleBand()
        .domain(categoryDataArray.map(function(d) { return d.key; }))
        .range([0, width])
        .padding(0.1);

    // Define Y scale
    var y = d3.scaleLinear()
        .domain([
            d3.min(categoryDataArray, function(d) { return d.value; }), // Minimum YTD value
            d3.max(categoryDataArray, function(d) { return d.value; })  // Maximum YTD value
        ])
        .range([height, 0]);

    // Define gradient colors for bars
    var colorScale = d3.scaleLinear()
        .domain([0, d3.max(categoryDataArray, function(d) { return d.value; })])
        .range(["#FFEB3B", "#FF5722"]);

    // Add X-axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-90)");

    // Add Y-axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add gradient-colored bars
    svg.selectAll(".bar")
        .data(categoryDataArray)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.key); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) { return colorScale(d.value); });

    // Add title
    // Add title with adjusted position
    svg.append("text")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "20px") // Increase font size
    .style("text-decoration", "underline")
    .text("Distribution of Returns Across Categories");

});
