// Load the mutual funds data asynchronously
d3.csv("mutualfunds.csv").then(function(data) {
    // Data preprocessing and visualization code
    data.forEach(function(d) {
        d.NetAssets = +d.NetAssets.replace(/,/g, ""); // Remove commas and convert to number
        d.MgrTenure = +d.MgrTenure; // Convert MgrTenure to a numeric value
    });

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
        .value(function(d) { return d.investment; })
        .sort(null); // Disable sorting for pie slices

    // Initial chart (by category)
    var categoryData = Array.from(d3.group(data, d => d.Category), ([key, value]) => ({ category: key, investment: d3.sum(value, d => d.NetAssets), count: value.length }));
    var arcs = svg.selectAll(".arc")
        .data(pie(categoryData))
        .enter()
        .append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", function(d, i) { return color(i); })
        .on("mouseover", function(event, d) {
            var tenureData = Array.from(d3.group(data.filter(function(item) { return item.Category === d.data.category; }).filter(function(item) { return item.MgrTenure !== 0; }), d => d.MgrTenure), ([key, value]) => ({ tenure: key, investment: d3.sum(value, d => d.NetAssets) }));
            tenureData.sort((a, b) => a.tenure - b.tenure);

            svg.selectAll(".arc").remove();
            var newArcs = svg.selectAll(".arc")
                .data(pie(tenureData))
                .enter()
                .append("g")
                .attr("class", "arc");

            newArcs.append("path")
                .attr("d", arc)
                .attr("fill", function(d, i) { return color(i); });

            newArcs.append("text")
                .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                .attr("text-anchor", "middle")
                .text(function(d) { return d.data.tenure; });

            svg.select("text.chart-title").text("Manager tenure length for " + d.data.category + " funds");

            svg.select(".counter").remove();
            var count = d.data.count;
            svg.append("text")
                .attr("class", "counter")
                .attr("x", 0)
                .attr("y", 0)
                .attr("text-anchor", "middle")
                .style("font-size", "24px")
                .text("Fund count: " + count);
        })
        .on("mouseout", function(event, d) {
            svg.selectAll(".arc").remove();
            arcs = svg.selectAll(".arc")
                .data(pie(categoryData))
                .enter()
                .append("g")
                .attr("class", "arc");

            arcs.append("path")
                .attr("d", arc)
                .attr("fill", function(d, i) { return color(i); });

            arcs.append("text")
                .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                .attr("text-anchor", "middle")
                .text(function(d) { return d.data.category; });

            svg.select("text.chart-title").text("Mutual fund categories");

            svg.select(".counter").remove();
        });

    // Add label for display type
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", 0)
        .attr("y", -height / 2 + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("Mutual fund categories");

    // Add counter in the center
    var totalCount = d3.sum(categoryData, d => d.count);
    svg.append("text")
        .attr("class", "counter")
        .attr("x", 0)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text("Fund count: " + totalCount);

    // Add Category labels
    arcs.append("text")
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("text-anchor", "middle")
        .text(function(d) { return d.data.category; });

    svg.on("mouseleave", function(event) {
        svg.selectAll(".arc").remove();
        arcs = svg.selectAll(".arc")
            .data(pie(categoryData))
            .enter()
            .append("g")
            .attr("class", "arc");

        arcs.append("path")
            .attr("d", arc)
            .attr("fill", function(d, i) { return color(i); })
            .on("mouseover", function(event, d) {
                var tenureData = Array.from(d3.group(data.filter(function(item) { return item.Category === d.data.category; }).filter(function(item) { return item.MgrTenure !== 0; }), d => d.MgrTenure), ([key, value]) => ({ tenure: key, investment: d3.sum(value, d => d.NetAssets) }));
                tenureData.sort((a, b) => a.tenure - b.tenure);

                svg.selectAll(".arc").remove();

                var newArcs = svg.selectAll(".arc")
                    .data(pie(tenureData))
                    .enter()
                    .append("g")
                    .attr("class", "arc");

                newArcs.append("path")
                    .attr("d", arc)
                    .attr("fill", function(d, i) { return color(i); });

                newArcs.append("text")
                    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                    .attr("text-anchor", "middle")
                    .text(function(d) { return d.data.tenure; });

                svg.select("text.chart-title").text("Manager tenure length for " + d.data.category + " funds");

                svg.select(".counter").remove();
                var count = d.data.count;
                svg.append("text")
                    .attr("class", "counter")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("text-anchor", "middle")
                    .style("font-size", "24px")
                    .text("Fund count: " + count);
            });

        arcs.append("text")
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("text-anchor", "middle")
            .text(function(d) { return d.data.category; });

        svg.select("text.chart-title").text("Mutual fund categories");

        svg.select(".counter").remove();
        svg.append("text")
            .attr("class", "counter")
            .attr("x", 0)
            .attr("y", 0)
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .text("Fund count: " + totalCount);
    });
});