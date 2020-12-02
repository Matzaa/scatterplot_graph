(function () {
    function makeDateObj(strArg) {
        let splitStr = strArg.split(":");
        let dateObj = new Date(
            `January 1, 1970 00:${splitStr[0]}:${splitStr[1]}`
        );
        return dateObj;
    }

    fetch(
        "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
    )
        .then((res) => res.json())
        .then((data) => {
            data.forEach((d) => {
                d.Time = makeDateObj(d.Time);
            });
            console.log("data: ", data);
            makeChart(data);
        });

    function makeChart(data) {
        const h = 500;
        const w = 1000;
        const padding = 100;

        const svg = d3
            .select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .style("background-color", "pink");

        // scale

        const xScale = d3
            .scaleLinear()
            .domain([
                d3.min(data, (d) => d.Year - 1),
                d3.max(data, (d) => d.Year + 1),
            ])
            .range([padding, w - padding]);

        const yScale = d3
            .scaleTime()
            .domain([d3.min(data, (d) => d.Time), d3.max(data, (d) => d.Time)])
            .range([h - padding, padding]);

        // tooltip

        const tooltip = d3
            .select("body")
            .append("div")
            .style("z-index", "10")
            .attr("id", "tooltip")
            .attr("visibility", "hidden")
            .text("probe");

        // legend

        const legend = svg
            .append("g")
            .attr("id", "legend")
            .attr("transform", `translate(${w * 0.72}, ${padding + 5})`);

        legend
            .append("circle")
            .attr("r", 10)
            .attr("fill", "rgb(255, 123, 123)");
        legend
            .append("circle")
            .attr("r", 10)
            .attr("fill", "gray")
            .attr("transform", `translate(0, 30)`);
        legend
            .append("text")
            .text("No doping allegations")
            .attr("transform", `translate(15, 5)`);
        legend
            .append("text")
            .text("With doping allegations")
            .attr("transform", `translate(15, 35)`);

        // graph

        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("r", 5)
            .attr("data-xvalue", (d, i) => d.Year)
            .attr("data-yvalue", (d) => d.Time)
            .attr("cx", (d, i) => xScale(d.Year))
            .attr("cy", (d) => h - yScale(d.Time))
            .attr("fill", (d) => {
                if (d.Doping === "") {
                    return "rgb(255, 123, 123)";
                } else {
                    return "gray";
                }
            })
            .on("mouseover", function (e) {
                tooltip
                    .style("left", e.pageX + "px")
                    .style("top", e.pageY - 30 + "px")
                    .style("transform", "translateX(100px)")
                    .style("visibility", "visible")
                    .attr("data-year", this.getAttribute("data-xvalue"))
                    .html(`${this.getAttribute("data-xvalue")}`);
            })
            .on("mouseout", () => {
                tooltip.style("visibility", "hidden");
            });

        // axis

        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
        const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

        svg.append("g")
            .attr("transform", `translate(0, ${h - padding})`)
            .attr("id", "x-axis")
            .call(xAxis);

        svg.append("g")
            .attr("transform", `translate(${padding}, 0)`)
            .attr("id", "y-axis")
            .call(yAxis);

        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -260)
            .attr("y", 40)
            .text("Time in Minutes")
            .attr("class", "text");

        svg.append("text")
            .attr("x", w / 2 - padding / 2)
            .attr("y", h - padding / 2)
            .text("YEARS")
            .attr("class", "text");
    }
})();
