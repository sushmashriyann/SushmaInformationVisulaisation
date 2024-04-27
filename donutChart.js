// Load the mutual funds data asynchronously
d3.csv("mutualfunds.csv").then(function(data) {
    // Data preprocessing and visualization code
    // Convert string values to numbers where necessary
    data.forEach(function(d) {
        d.NetAssets = +d.NetAssets.replace(/,/g, ""); // Remove commas and convert to number
    });

    // Aggregate data by category and calculate total net assets for each category
    var categoryData = Array.from(d3.group(data, d => d.Category), ([key, value]) => ({ category: key, investment: d3.sum(value, d => d.NetAssets) }));

    // Check if the data aggregation is successful
    console.log(categoryData);

    // Set up chart dimensions
    var width = 800;
    var height = 600;
    var radius = Math.min(width, height) / 2;

    // Define color scale
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // Append SVG for donut chart
    var svg = d3.select("#donutChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // Define arc generator
    var arc = d3.arc()
        .innerRadius(radius * 0.6)
        .outerRadius(radius * 0.8);

    // Define pie generator
    var pie = d3.pie()
        .value(function(d) { return d.investment; });

    // Generate arcs
    var arcs = svg.selectAll(".arc")
        .data(pie(categoryData))
        .enter()
        .append("g")
        .attr("class", "arc");

    // Draw arcs
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", function(d, i) { return color(i); });

    // Add text labels
    arcs.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("text-anchor", "middle")
        .text(function(d) {
            return d.data.category;
        });
});
