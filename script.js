(function () {
    fetch(
        "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
    )
        .then((res) => res.json())
        .then((myArr) => makeChart(myArr));

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
    }
})();
