let link = 'https://api.census.gov/data/2021/pep/population?get=DENSITY_2021,POP_2021,NAME,STATE&for=region:*'
let res, region, newData, xAxis, yAxis, xAxisScale, yAxisScale, xScale, yScale, heightScale, toolTip;
let width = 600;
let height = 500;
let padding = 70;

let svg = d3.select('body')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'svg-area')

let genBar = () => {
    // svg.selectAll('rect')
    //     .data(newData)
    //     .enter()
    //     .append('rect')
    //     .attr('class', 'rect-bar')
    //     .attr('width', 50)
    //     .attr('height', item => yAxisScale(item[1]))
    //     .attr('x', (d, i) => xScale(i))
    //     .attr('y', item => yAxisScale[item[1]])

        svg.selectAll('rect')
            .data(newData)
            .enter()
            .append('rect')
            .attr('class', 'rect-bar')
            .attr('width', xScale.bandwidth())
            .attr('height', (d, i) => heightScale(d[1]))
            .attr('x', (d, i) => xScale(i))
            .attr('y', (d, i) => (height - padding) - heightScale(d[1]))
            .attr('data-val', d => d[1])
            .attr('data-region', d => d[2])
            .on('mouseover', function() {
                let val = d3.select(this);
                let targetNode = document.querySelector('.toolTip');
                toolTip.transition().style('visibility', 'visible')
                toolTip.text(val.attr('data-val'));
                targetNode.setAttribute('data-val', val.attr('data-val'));
            })
            .on('mouseout', function() {
                toolTip.transition().style('visibility', 'hidden')
            })

}
let genToolTip = () => {
     toolTip = d3.select('body')
                .append('div')
                .attr('class', 'toolTip')
                .attr('width', 'auto')
                .attr('height', 'auto')
                .style('visibility', 'hidden')
                
}
let genScales = () => {

    xScale = d3.scaleBand()
                    .domain(d3.range(newData.length))
                    .range([padding, width - padding])
                    .padding(0.2)


    yScale = d3.scaleLinear()
                    .domain([0, 150000000]) 
                    .range([height - padding, padding])

    heightScale = d3.scaleLinear()
                    .domain([0, 150000000])
                    .range([0, height - (padding * 2)])

}
let genAxis = () => {
    xAxis = d3.axisBottom(xScale).tickFormat((d, i) => newData[i][2]);
    svg.append('g')
        .call(xAxis)
        .attr("transform", "translate(0," + (height - padding) + ")")
        .style('font-size', '13px');
    
    yAxis = d3.axisLeft(yScale);
    svg.append('g')
        .call(yAxis)
        .attr("transform", "translate(" + padding + ",0)")
}

async function getData() {
    let dataSet = await fetch(link)
                    .then(response => response.json())
                    .then(data => res = data)
    console.log(res)
    newData = [res[1], res[2], res[3], res[4]];
    region = [newData[0][2], newData[1][2], newData[2][2], newData[3][2],]
    console.log(newData);
    console.log(region);
    genScales();
    genAxis();
    genBar();
    genToolTip();
} getData()