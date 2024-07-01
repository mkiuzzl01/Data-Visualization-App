import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import PropTypes from "prop-types";

const EndYearChart = ({ endYear }) => {
  const svgRef = useRef();
  const tooltipRef = useRef();

  useEffect(() => {
    if (!Array.isArray(endYear)) {
      console.error("endYear is not an array");
      return;
    }

    const width = 1280;
    const height = 600;
    const marginTop = 20;
    const marginRight = 80;
    const marginBottom = 40;
    const marginLeft = 80;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Create the SVG container.
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    const attributes = ["intensity", "likelihood", "relevance"];
    const color = d3.scaleOrdinal().domain(attributes).range(d3.schemeCategory10);

    const x = d3.scaleBand()
      .domain(endYear.map(d => d.end_year))
      .range([marginLeft, width - marginRight])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(endYear, d => Math.max(d.intensity, d.likelihood, d.relevance, d.topic))])
      .nice()
      .range([height - marginBottom, marginTop]);

    // Append the bars for each attribute.
    svg.append("g")
      .selectAll("g")
      .data(endYear)
      .join("g")
      .attr("transform", d => `translate(${x(d.end_year)},0)`)
      .selectAll("rect")
      .data(d => attributes.map(attr => ({ key: attr, value: d[attr], data: d })))
      .join("rect")
      .attr("x", (d, i) => x.bandwidth() / attributes.length * i)
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth() / attributes.length)
      .attr("height", d => y(0) - y(d.value))
      .attr("fill", d => color(d.key))
      .on("mouseover", function(event, d) {
        d3.select(this).attr("fill", "orange");
        d3.select(tooltipRef.current)
          .style("display", "block")
          .html(`
            <strong>${d.key.toUpperCase()}</strong><br>
            Value: ${d.value}<br>
            Year: ${d.data?.end_year}<br>
            Country: ${d.data?.country}<br>
            Topics: ${d.data?.topic}<br>
            Region: ${d.data?.region}<br>
            City: ${d.data?.city}
          `)
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function(event, d) {
        d3.select(this).attr("fill", color(d.key));
        d3.select(tooltipRef.current).style("display", "none");
      });

    // Append the horizontal axis.
    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .call(g => g.selectAll(".domain").remove());

    // Append the vertical axis.
    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(null, "s"))
      .call(g => g.selectAll(".domain").remove());

    // Add legend
    const legend = svg.append("g")
      .attr("transform", `translate(${width - marginRight - 10}, ${marginTop})`)
      .selectAll("g")
      .data(attributes)
      .join("g")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legend.append("rect")
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", color);

    legend.append("text")
      .attr("x", 20)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(d => d);
      
  }, [endYear]);

  return (
    <div style={{ position: "relative" }}>
      <svg ref={svgRef}></svg>
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          backgroundColor: "white",
          padding: "5px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          display: "none",
          pointerEvents: "none",
        }}
      ></div>
    </div>
  );
};

EndYearChart.propTypes = {
  endYear: PropTypes.arrayOf(
    PropTypes.shape({
      end_year: PropTypes.number.isRequired,
      intensity: PropTypes.number.isRequired,
      likelihood: PropTypes.number.isRequired,
      relevance: PropTypes.number.isRequired,
      year: PropTypes.number.isRequired,
      country: PropTypes.string.isRequired,
      topics: PropTypes.string.isRequired,
      region: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired
    })
  ).isRequired,
};

export default EndYearChart;
