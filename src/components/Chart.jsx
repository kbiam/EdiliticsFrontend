import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import './Chart.css';
import Tooltip from './Tooltip';

const Chart = ({ data, chartType, theme }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();
  const [tooltipData, setTooltipData] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: 800,
    height: 500,
    margin: { top: 50, right: 50, bottom: 50, left: 60 }
  });

  // Update dimensions on window resize
  useEffect(() => {
    const handleResize = () => {
      const containerWidth = svgRef.current.parentNode.clientWidth;
      setDimensions({
        ...dimensions,
        width: containerWidth > 600 ? containerWidth : 600
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!data || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = dimensions.width - dimensions.margin.left - dimensions.margin.right;
    const height = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${dimensions.margin.left},${dimensions.margin.top})`);

    switch (chartType) {
      case 'bar':
        createBarChart(g, data, width, height, theme);
        break;
      case 'line':
        createLineChart(g, data, width, height, theme);
        break;
      case 'pie':
        createPieChart(g, data, width, height, theme);
        break;
      default:
        createBarChart(g, data, width, height, theme);
    }
  }, [data, dimensions, chartType, theme]);

  const createBarChart = (g, data, width, height, theme) => {

    const sortedData = [...data].sort((a, b) => d3.ascending(a.value, b.value));

    const x = d3.scaleBand()
      .domain(sortedData.map(d => d.name))
      .range([0, width])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(sortedData, d => d.value) * 1.1])
      .range([height, 0]);

    const color = d3.scaleOrdinal()
      .domain(sortedData.map(d => d.category))
      .range(theme === 'dark' ? d3.schemeSet2 : d3.schemeSet1);

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "12px")
      .style("fill", theme === 'dark' ? "#ddd" : "#333");

    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", theme === 'dark' ? "#ddd" : "#333");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .text("Value")
      .style("fill", theme === 'dark' ? "#ddd" : "#333");

    const bars = g.selectAll(".bar")
      .data(sortedData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.name))
      .attr("width", x.bandwidth())
      .attr("y", height)
      .attr("height", 0)
      .attr("fill", d => color(d.category))
      .on("mouseover", function(event, d) {
        d3.select(this).attr("opacity", 0.8);
        setTooltipData({
          name: d.name,
          value: d.value,
          category: d.category,
          x: event.pageX,
          y: event.pageY
        });
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 1);
        setTooltipData(null);
      });

    // Add bar transition
    bars.transition()
      .duration(800)
      .attr("y", d => y(d.value))
      .attr("height", d => height - y(d.value));

    // Add data labels
    g.selectAll(".label")
      .data(sortedData)
      .enter()
      .append("text")
      .attr("class", "label")
      .attr("x", d => x(d.name) + x.bandwidth() / 2)
      .attr("y", d => y(d.value) - 5)
      .attr("text-anchor", "middle")
      .text(d => d.value)
      .style("font-size", "12px")
      .style("fill", theme === 'dark' ? "#ddd" : "#333")
      .style("opacity", 0)
      .transition()
      .duration(1000)
      .style("opacity", 1);

    const legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data([...new Set(sortedData.map(d => d.category))])
      .enter().append("g")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", color);

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(d => d)
      .style("fill", theme === 'dark' ? "#ddd" : "#333");
  };

  const createLineChart = (g, data, width, height, theme) => {
    const sortedData = [...data].sort((a, b) => d3.ascending(a.date, b.date));

    const x = d3.scaleTime()
      .domain(d3.extent(sortedData, d => new Date(d.date)))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(sortedData, d => d.value) * 1.1])
      .range([height, 0]);

    const color = d3.scaleOrdinal()
      .domain([...new Set(sortedData.map(d => d.category))])
      .range(theme === 'dark' ? d3.schemeSet2 : d3.schemeSet1);

    const categories = Array.from(
      d3.group(sortedData, d => d.category),
      ([key, values]) => ({ key, values })
    );

    g.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .style("text-anchor", "end")
      .style("font-size", "12px")
      .style("fill", theme === 'dark' ? "#ddd" : "#333");

    g.append("g")
      .call(d3.axisLeft(y))
      .selectAll("text")
      .style("font-size", "12px")
      .style("fill", theme === 'dark' ? "#ddd" : "#333");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -40)
      .attr("x", -height / 2)
      .attr("text-anchor", "middle")
      .text("Value")
      .style("fill", theme === 'dark' ? "#ddd" : "#333");

    const line = d3.line()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    categories.forEach(category => {
      const path = g.append("path")
        .datum(category.values)
        .attr("fill", "none")
        .attr("stroke", color(category.key))
        .attr("stroke-width", 2)
        .attr("d", line);

      const totalLength = path.node().getTotalLength();

      path.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .attr("stroke-dashoffset", 0);
    });

    g.selectAll(".dot")
      .data(sortedData)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", d => x(new Date(d.date)))
      .attr("cy", d => y(d.value))
      .attr("r", 5)
      .attr("fill", d => color(d.category))
      .on("mouseover", function(event, d) {
        d3.select(this).attr("r", 8);
        setTooltipData({
          name: d.name,
          value: d.value,
          category: d.category,
          date: d.date,
          x: event.pageX,
          y: event.pageY
        });
      })
      .on("mouseout", function() {
        d3.select(this).attr("r", 5);
        setTooltipData(null);
      });

    const legend = g.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data([...new Set(sortedData.map(d => d.category))])
      .enter().append("g")
      .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", color);

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(d => d)
      .style("fill", theme === 'dark' ? "#ddd" : "#333");
  };

  const createPieChart = (g, data, width, height, theme) => {
    const aggregatedData = Array.from(
      d3.rollup(
        data,
        v => d3.sum(v, d => d.value),
        d => d.category
      ),
      ([key, value]) => ({ name: key, value })
    );

    const radius = Math.min(width, height) / 2;

    const pie = d3.pie()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius * 0.8);

  const outerArc = d3.arc()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

  const color = d3.scaleOrdinal()
    .domain(aggregatedData.map(d => d.name))
    .range(theme === 'dark' ? d3.schemeSet2 : d3.schemeSet1);

  const pieG = g.append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  const path = pieG.selectAll("path")
    .data(pie(aggregatedData))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", d => color(d.data.name))
    .attr("stroke", theme === 'dark' ? "#222" : "#fff")
    .style("stroke-width", "2px")
    .style("opacity", 0.7)
    .on("mouseover", function(event, d) {
      d3.select(this).style("opacity", 1);
      setTooltipData({
        name: d.data.name,
        value: d.data.value,
        percentage: (d.data.value / d3.sum(aggregatedData, d => d.value) * 100).toFixed(1),
        x: event.pageX,
        y: event.pageY
      });
    })
    .on("mouseout", function() {
      d3.select(this).style("opacity", 0.7);
      setTooltipData(null);
    });

  const text = pieG.selectAll("text")
    .data(pie(aggregatedData))
    .enter()
    .append("text")
    .attr("transform", d => {
      const pos = outerArc.centroid(d);
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      pos[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
      return `translate(${pos})`;
    })
    .attr("dy", ".35em")
    .style("text-anchor", d => {
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      return midangle < Math.PI ? "start" : "end";
    })
    .text(d => d.data.name)
    .style("fill", theme === 'dark' ? "#ddd" : "#333")
    .style("font-size", "12px");

  pieG.selectAll("polyline")
    .data(pie(aggregatedData))
    .enter()
    .append("polyline")
    .attr("points", d => {
      const pos = outerArc.centroid(d);
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      pos[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
      return [arc.centroid(d), outerArc.centroid(d), pos];
    })
    .style("fill", "none")
    .style("stroke", theme === 'dark' ? "#ddd" : "#333")
    .style("stroke-width", "1px");

  path.transition()
    .duration(1000)
    .attrTween("d", function(d) {
      const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
      return function(t) {
        return arc(interpolate(t));
      };
    });

  const legend = g.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
    .selectAll("g")
    .data(aggregatedData)
    .enter().append("g")
    .attr("transform", (d, i) => `translate(${width - 80},${i * 20 - height / 2 + 20})`);

  legend.append("rect")
    .attr("x", 0)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", d => color(d.name));

  legend.append("text")
    .attr("x", -5)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(d => d.name)
    .style("fill", theme === 'dark' ? "#ddd" : "#333");
};

useEffect(() => {
  if (chartType !== 'pie' && data.length > 0) {
    const svg = d3.select(svgRef.current);
    const g = svg.select("g");
    
    const zoom = d3.zoom()
      .scaleExtent([0.5, 5])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    
    svg.call(zoom);
    
    return () => {
      svg.on(".zoom", null);
    };
  }
}, [chartType, data]);

return (
  <div className="chart-wrapper">
    <svg
      ref={svgRef}
      width={dimensions.width}
      height={dimensions.height}
      className={`chart ${theme}`}
    />
    {tooltipData && <Tooltip data={tooltipData} />}
  </div>
);
};

export default Chart;