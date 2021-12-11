import React, { useState } from "react";
import DropZone from "./DropZone";
import { MultiSelect } from "react-multi-select-component";

export default function MiddleComponent() {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState([]);
  const [difficulty, setDifficulty] = useState();
  const [etapesPreparation, setEtapesPreparation] = useState("");

  const customValueRenderer = (selected, _options) => {
    return selected.length
      ? selected.map(({ label }) => "✔️ " + label)
      : "😶 No Items Selected";
  };
  const handleChange = (event) => {
    setDifficulty(event.target.value);
  };
  const optionsCategorie = [
    { label: "viande ", value: "Viande" },
    { label: "poisson ", value: "Poisson" },
    { label: "Vegetarien ", value: "vegetarien" },
    { label: "sansGluten ", value: "SansGluten" },
  ];
  const optionsMateriel = [
    { label: "four ", value: "Four" },
    { label: "microOnde ", value: "Micro-Onde" },
    { label: "mixeur ", value: "Mixeur" },
    { label: "robotCuisseur ", value: "Robot Cuisseur" },
    { label: "friteuse ", value: "Friteuse" },
  ];

  return (
    <>
      <DropZone />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <input
          style={{
            width: "90%",
            height: "50px",
            fontSize: 20,
          }}
          type="text"
          placeholder="Nom de la recette"
        />
        <div
          style={{
            width: "90%",
            height: "50px",
            justifyContent: "space-between",
            display: "flex",
            marginTop: "20px",
          }}
        >
          <input
            style={{ fontSize: 20, display: "flex", width: "30%" }}
            type="text"
            placeholder="Nbr. Personne"
          />
          <input
            style={{ fontSize: 20, display: "flex", width: "30%" }}
            type="text"
            placeholder="T. Cuisson"
          />
          <input
            style={{ fontSize: 20, display: "flex", width: "30%" }}
            type="text"
            placeholder="T. Preparation"
          />
        </div>
        <div
          style={{
            width: "90%",
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div style={{ display: "flex" }}>
            <label style={{ marginRight: 20 }}>Difficulté :</label>
            <select
              style={{ flex: 1, fontSize: 20 }}
              value={difficulty}
              onChange={handleChange}
            >
              <option value="facile">Facile</option>
              <option value="moyenne">Moyenne</option>
              <option value="difficile">Difficile</option>
            </select>
          </div>
          <div style={{ display: "flex", marginTop: "20px" }}>
            <label style={{ marginRight: 20 }}>Categorie:</label>
            <MultiSelect
              className="multiInput"
              options={optionsCategorie}
              labelledBy="Select"
              value={selectedOptions}
              onChange={setSelectedOptions}
              hasSelectAll={false}
              shouldToggleOnHover
              valueRenderer={customValueRenderer}
              disableSearch
            />
          </div>
          <div
            style={{ display: "flex", flexDirection: "row", marginTop: "20px" }}
          >
            <label style={{ marginRight: 20 }}>Materiel: </label>
            <MultiSelect
              className="multiInput"
              style={{ height: "200px" }}
              options={optionsMateriel}
              labelledBy="Select"
              value={selectedMaterial}
              onChange={setSelectedMaterial}
              hasSelectAll={false}
              shouldToggleOnHover
              valueRenderer={customValueRenderer}
              disableSearch
            />
          </div>
          <textarea
            placeholder="Etapes de Préparation"
            style={{
              width: "80%",
              height: "100px",
              marginTop: "20px",
              fontSize: 20,
              padding: 20,
              alignSelf: "center",
            }}
            rows={15}
            value={etapesPreparation}
            onChange={(e) => setEtapesPreparation(e.target.value)}
          />
        </div>
      </div>
    </>
  );
}
