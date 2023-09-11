import React, { useEffect, useState } from "react";
import { Table, Button } from "antd";
import api from "../../utils/api";
import styles from "./serieSelector.module.css";

export default function SerieList({ setSerieID, setTopicID }) {
  const [series, setSeries] = useState([]);
  const [selectedSerie, setSelectedSerie] = useState(null);

  useEffect(() => {
    getSeries();
  }, []);

  async function getSeries() {
    try {
      const response = await api.get("/series");
      setSeries(response.data.series);
    } catch (err) {
      console.error("Error fetching series:", err);
    }
  }

  const columns = [
    {
      title: "Tracked series",
      dataIndex: "nombre",
      key: "nombre",
      render: (text, record) => (
        <Button
          className={`btnn_list ${
            record._id === selectedSerie ? styles.selected : ""
          }`}
          onClick={() => selectSerie(record._id, record.relatedTopic)}
        >
          {text}
        </Button>
      ),
    },
  ];

  function selectSerie(id, relatedTopic) {
    setTopicID(relatedTopic)
    setSerieID(id);
    setSelectedSerie(id);
  }

  return (
    <div>
      <Table
        dataSource={series}
        columns={columns}
        pagination={false}
        rowKey="_id"
      />
    </div>
  );
}
