import React, { useState, useContext } from "react";

import SerieSelector from "../../components/serieSelector/serieSelector";
import Chart from "../../components/charts/chart";

const MainCharts = () => {
  const [serieID, setSerieID] = useState("");

  return (
    <div className="row">
      <div className="col-2">
        <SerieSelector serieID={serieID} setSerieID={setSerieID} />
      </div>
      <div
        className="col-8"
        style={{ display: serieID !== "" ? "block" : "none" }}
      >
        <Chart serieID={serieID} />
      </div>
    </div>
  );
};

export default MainCharts;
