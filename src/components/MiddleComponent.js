import React, { useEffect, useState } from "react";
import DropZone from "./DropZone";
import { MultiSelect } from "react-multi-select-component";

export default function MiddleComponent({ form, setForm }) {
  const [selectedCategorie, setSelectedCategorie] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState([]);

  const customValueRenderer = (selected, _options) => {
    return selected.length
      ? selected.map(({ label }) => "✔️ " + label)
      : "😶 No Items Selected";
  };

  const optionsCategorie = [
    { label: "viande", value: "Viande" },
    { label: "poisson", value: "Poisson" },
    { label: "Vegetarien", value: "vegetarien" },
    { label: "sansGluten", value: "SansGluten" },
  ];
  const optionsMateriel = [
    { label: "four ", value: "Four" },
    { label: "microOnde ", value: "Micro-Onde" },
    { label: "mixeur ", value: "Mixeur" },
    { label: "robotCuisseur ", value: "Robot Cuisseur" },
    { label: "friteuse ", value: "Friteuse" },
  ];

  //When we choose the cat or mat we rerender to change form state in App.js
  useEffect(() => {
    const selectedCategorieLabel = selectedCategorie.map((item) => item.label);
    const selectedMaterialLabel = selectedMaterial.map((item) => item.label);
    const tmp = { ...form };

    tmp.category = selectedCategorieLabel;
    tmp.material = selectedMaterialLabel;
    setForm(tmp);
  }, [selectedCategorie, selectedMaterial]);

  return (
    <>
      <DropZone form={form} setForm={setForm} />
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
          onChange={(e) => {
            const tmp = { ...form };
            tmp.name = e.target.value;
            setForm(tmp);
          }}
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
            defaultValue={form.nbrPersonne}
            onChange={(e) => {
              const tmp = { ...form };
              tmp.nbrPersonne = e.target.value;
              setForm(tmp);
            }}
          />
          <input
            style={{ fontSize: 20, display: "flex", width: "30%" }}
            type="text"
            placeholder="T. Cuisson"
            defaultValue={form.tempsCuisson}
            onChange={(e) => {
              const tmp = { ...form };
              tmp.tempsCuisson = e.target.value;
              setForm(tmp);
            }}
          />
          <input
            style={{ fontSize: 20, display: "flex", width: "30%" }}
            type="text"
            placeholder="T. Preparation"
            defaultValue={form.tempsPreparation}
            onChange={(e) => {
              const tmp = { ...form };
              tmp.tempsPreparation = e.target.value;
              setForm(tmp);
            }}
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
              value={form.difficulty}
              onChange={(e) => {
                const tmp = { ...form };
                tmp.difficulty = e.target.value;
                setForm(tmp);
              }}
            >
              <option value="facile">Facile</option>
              <option value="moyenne">Moyenne</option>
              <option value="difficile">Difficile</option>
            </select>
          </div>
          <div style={{ display: "flex", marginTop: "20px", width: "100%" }}>
            <label style={{ marginRight: 20 }}>Categorie:</label>
            <MultiSelect
              className="multiInput"
              options={optionsCategorie}
              labelledBy="Select"
              value={selectedCategorie}
              onChange={setSelectedCategorie}
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
            value={form.steps}
            onChange={(e) => {
              const tmp = { ...form };
              tmp.steps = e.target.value;
              setForm(tmp);
            }}
          />
        </div>
      </div>
    </>
  );
}
