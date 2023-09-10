import React, { useState } from "react";
import { Row, Col } from "antd";
import SerieSelector from "../../components/serieSelector/serieSelector";
import Chart from "../../components/charts/chart";
import Page from "../../components/Page/Page";

const MainCharts = () => {
  const [serieID, setSerieID] = useState("");

  return (
    <Page>
      <Row style={{ "padding-top": "190px" }} gutter={16}>
        <Col span={4}>
          <SerieSelector serieID={serieID} setSerieID={setSerieID} />
        </Col>
        <Col span={20}>{serieID && <Chart serieID={serieID} />}</Col>
      </Row>
    </Page>
  );
};

export default MainCharts;
