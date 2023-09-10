import React, { useEffect, useState } from "react";
import api from "../../utils/api";

const Serie = (props) => (
  <tr className={"list-item"}>
    <td className={"item_cell"}>
      <button
        className={"btnn_list"}
        onClick={() => {
          props.selectedSerie(props.serie._id);
        }}
      >
        {props.serie.nombre}
      </button>
    </td>
  </tr>
);

export default function SerieList({ setSerieID }) {
  const [series, setSeries] = useState([]);

  useEffect(() => {
    getSeries();
    return;
  }, [series.length]);

  async function getSeries() {
    try {
      api.get("/series").then((result) => {
        console.log(result.data);
        setSeries(result.data.series);
      });
    } catch (err) {}
  }

  function selectSerie(id) {
    setSerieID(id);
  }

  function serieList() {
    return series.map((serie) => {
      return (
        <Serie
          serie={serie}
          selectedSerie={() => selectSerie(serie._id)}
          key={serie._id}
        />
      );
    });
  }

  // This following section will display the table with the records of individuals.
  return (
    <div>
      <h3>Serie List</h3>
      <table className="table table-striped" style={{ marginTop: 5 }}>
        <thead>
          <tr>
            <th></th>
          </tr>
        </thead>
        <tbody>{serieList()}</tbody>
      </table>
    </div>
  );
}
