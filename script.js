(function () {
    function makeTimeNum(strArg) {
        let splitStr = strArg.split(":");
        let noColon = splitStr[0] + splitStr[1];
        let newNum = noColon * 1;
        console.log("newNum :", newNum);
        return newNum;
    }

    fetch(
        "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
    )
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            data.forEach((d) => {
                d.Time = makeTimeNum(d.Time);
            });
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

        const xScale = d3
            .scaleLinear()
            .domain([d3.min(data, (d) => d.Year), d3.max(data, (d) => d.Year)])
            .range([padding, w - padding]);

        const yScale = d3
            .scaleLinear()
            .domain([d3.min(data, (d) => d.Time), d3.max(data, (d) => d.Time)])
            .range([h - padding, padding]);

        const tooltip = d3
            .select("body")
            .append("div")
            .style("z-index", "10")
            .attr("id", "tooltip")
            .attr("visibility", "hidden")
            .text("probe");

        const legend = d3
            .select("body")
            .append("div")
            .attr("id", "legend")
            .html("I'm legend");

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
            .on("mouseover", function (e) {
                tooltip
                    .style("left", d3.event.pageX + "px")
                    .style("top", d3.event.pageY - 30 + "px")
                    .style("transform", "translateX(100px)")
                    .style("visibility", "visible")
                    .attr("data-year", this.getAttribute("data-xvalue"))
                    .html(`${this.getAttribute("data-xvalue")}`);
            })
            .on("mouseout", () => {
                tooltip.style("visibility", "hidden");
            });

        function makeTimeFormat(x) {
            let numString = x.toString();
            let timeOutput =
                numString[0] + numString[1] + ":" + numString[2] + numString[3];
            console.log("timeOutput", timeOutput);
            return timeOutput;
        }

        makeTimeFormat(5543);
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
        const yAxis = d3.axisLeft(yScale).tickFormat((x) => makeTimeFormat(x));

        svg.append("g")
            .attr("transform", `translate(0, ${h - padding})`)
            .attr("id", "x-axis")
            .call(xAxis);

        svg.append("g")
            .attr("transform", `translate(${padding}, 0)`)
            .attr("id", "y-axis")
            .call(yAxis);
    }
})();
