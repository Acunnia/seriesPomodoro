import React, { useState, useEffect, Component } from "react";
import { useParams } from "react-router";
import Plot from "../../../node_modules/react-plotly.js/react-plotly";
import api from "../../utils/api";
import { useRef } from "react";

export default function Chart({ serieID }) {
  const [avgViews, setAvgViews] = useState([]);
  const [data, setData] = useState([]);
  const [mapedData, setMapedData] = useState([]);
  const params = useParams();
  const chartRef = useRef(null);

  useEffect(() => {
    if (serieID) {
      fetchData();
    }

    return;
  }, [serieID]);

  async function fetchData() {
    const id = serieID;
    const response = await api.get(`/tracks/${id.toString()}`);
    console.log(response.data);

    const plotData = response.data.reduce((acc, cur) => {
      if (!acc[cur.streamer]) {
        acc[cur.streamer] = { time: [], views: [] };
      }
      acc[cur.streamer].time.push(cur.time);
      acc[cur.streamer].views.push(cur.views);
      return acc;
    }, {});

    const groupedData = response.data.reduce((acc, item) => {
      if (!acc[item.streamer]) {
        acc[item.streamer] = {
          streamer: item.streamer,
          views: [],
        };
      }
      acc[item.streamer].views.push(item.views);
      return acc;
    }, {});

    const avgViewsByStreamer = Object.values(groupedData).map((item) => {
      item.viewsAvg = item.views.reduce((a, b) => a + b, 0) / item.views.length;
      return item;
    });

    const plotDataTransformed = Object.keys(plotData).map((streamer) => {
      return {
        name: streamer,
        x: plotData[streamer].time,
        y: plotData[streamer].views,
        type: "scatter",
        mode: "lines+markers",
      };
    });

    setMapedData(plotData);
    setAvgViews(avgViewsByStreamer);
    setData(plotDataTransformed);
  }

  return (
    <div>
      <h1>Graficos </h1>
      <div ref={chartRef}>
        <Plot
          data={data}
          useResizeHandler={true}
          style={{ width: "100%", height: "33%" }}
          layout={{
            title: "Views por streamer",
            xaxis: {
              title: "Tiempo",
              type: "date",
            },
            yaxis: {
              title: "Vistas",
            },
            autosize: true,
            displayModeBar: false,
            responsive: true,
            plot_bgcolor: "#212529",
            paper_bgcolor: "#212529",
            font: {
              color: "white",
            },
          }}
        />

        <Plot
          data={[
            {
              y: avgViews.map((d) => d.streamer),
              x: avgViews.map((d) => d.viewsAvg),
              type: "bar",
              orientation: "h",
              hoverInfo: "x+y",
            },
          ]}
          style={{ width: "100%", height: "33%" }}
          layout={{
            title: "Avg Views by streamer",
            xaxis: {
              title: "Avg Views",
              tickformat: ".4s",
            },
            yaxis: {
              title: "Streamer",
              autorange: "reversed",
            },
            autosize: true,
            responsive: true,
            plot_bgcolor: "#212529",
            paper_bgcolor: "#212529",
            font: {
              color: "white",
            },
          }}
        />
      </div>
    </div>
  );
}
