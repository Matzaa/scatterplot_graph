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

    // d3.json(
    //     "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
    // )
    //     .then((data) => console.log("data from d3json", data))
    //     .catch((err) => console.log(err));

    function makeChart(data) {
        const h = 500;
        const w = 1000;
        const padding = 100;

        // var minutes = data.map((item) => {
        //     let splitTime = item.Time.split(":");
        //     let timeNumFormat = splitTime[0] + splitTime[1];
        //     return timeNumFormat;
        // });
        console.log("data in cy ", data);

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

        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", 5)
            .attr("cx", (d, i) => xScale(d.Year))
            .attr("cy", (d) => h - yScale(d.Time));

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
            .attr("transform", `translate(0, ${h - padding})`)
            .call(xAxis);

        svg.append("g")
            .attr("transform", `translate(${padding}, 0)`)
            .call(yAxis);
    }
})();
