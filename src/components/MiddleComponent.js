import React, { useEffect, useState } from "react";
import DropZone from "./DropZone";
import { MultiSelect } from "react-multi-select-component";

export default function MiddleComponent({ form, setForm }) {
  const customValueRenderer = (selected, _options) => {
    return selected.length
      ? selected.map(({ label }) => "✔️ " + label)
      : "😶 No Items Selected";
  };

  const optionsRegime = [
    { label: "viande", value: "viande" },
    { label: "poisson", value: "poisson" },
    { label: "vegetarien", value: "vegetarien" },
    { label: "sansGluten", value: "sansGluten" },
    { label: "vegan", value: "vegan" },
  ];

  const optionCategory = [
      { label: "Petit dej & brunch", value: "breakfast" },
      { label: "Apéritif", value: "aperitif" },
      { label: "Entrées", value: "starters" },
      { label: "Plats principaux", value: "main" },
      { label: "Dessert", value: "dessert" },
      { label: "Boisson & Cocktail", value: "drinks" },
      { label: "Snacks", value: "snacks" },
  ]

  const optionsMateriel = [
    { label: "Four", value: "Four" },
    { label: "Micro-Ondes", value: "Micro-Ondes" },
    { label: "Mixeur", value: "Mixeur" },
    { label: "Robot cuiseur", value: "Robot cuiseur" },
    { label: "Friteuse", value: "Friteuse" },
    {
      label: "Batteur électrique ou fouet",
      value: "Batteur électrique ou fouet",
    },
  ];

  return (
    <>
      <DropZone form={form} setForm={setForm} />
      {typeof form.videoURL !== "object" && (
        <a href={form.videoURL} target="_blank">
          {form.videoURL ? "Lien video" : ""}
        </a>
      )}
      <DropZone form={form} setForm={setForm} video />
      <div style={{ alignSelf: "center" }}>
        {form.website && (
          <a href={form?.website} target="_blank">
            Open website
          </a>
        )}
        <label style={{ fontWeight: "bold", fontSize: 20, margin: 20 }}>
          -{form?.number}
        </label>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <div style={{ display: "flex", width: "100%" }}>
          <input
            style={{
              width: "90%",
              height: "50px",
              fontSize: 20,
            }}
            value={form.name}
            type="text"
            placeholder="Nom de la recette"
            onChange={(e) => {
              const tmp = { ...form };
              tmp.name = e.target.value;
              setForm(tmp);
            }}
          />
          <input
            style={{
              width: "40%",
              height: "50px",
              fontSize: 20,
            }}
            value={form.chefName}
            type="text"
            placeholder="Nom du chef"
            onChange={(e) => {
              const tmp = { ...form };
              tmp.chefName = e.target.value;
              setForm(tmp);
            }}
          />
        </div>
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
            style={{ fontSize: 20, display: "flex", width: "23%" }}
            type="text"
            placeholder="Nbr. Personne"
            defaultValue={form.nbrPersonne}
            value={form.nbrPersonne}
            onChange={(e) => {
              const tmp = { ...form };
              tmp.nbrPersonne = e.target.value;
              setForm(tmp);
            }}
          />
          <input
            style={{ fontSize: 20, display: "flex", width: "23%" }}
            type="text"
            placeholder="T. Preparation"
            value={form?.tempsPreparation}
            defaultValue={form?.tempsPreparation}
            onChange={(e) => {
              const tmp = { ...form };
              tmp.tempsPreparation = e.target.value;
              setForm(tmp);
            }}
          />
          <input
            style={{ fontSize: 20, display: "flex", width: "23%" }}
            type="text"
            placeholder="T. Cuisson"
            defaultValue={form?.tempsCuisson}
            value={form?.tempsCuisson}
            onChange={(e) => {
              const tmp = { ...form };
              tmp.tempsCuisson = e.target.value;
              setForm(tmp);
            }}
          />

          <input
            style={{ fontSize: 20, display: "flex", width: "23%" }}
            type="text"
            placeholder="T. Attente"
            value={form?.tempsAttente}
            defaultValue={form?.tempsAttente}
            onChange={(e) => {
              const tmp = { ...form };
              tmp.tempsAttente = e.target.value;
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
              <option value="Facile">Facile</option>
              <option value="Moyenne">Moyenne</option>
              <option value="Difficile">Difficile</option>
            </select>
          </div>
          <div style={{ display: "flex", marginTop: "20px", width: "100%" }}>
            <label style={{ marginRight: 20 }}>Regime:</label>
            <MultiSelect
              className="multiInput"
              options={optionsRegime}
              labelledBy="Select"
              value={form?.regime}
              onChange={(item) => {
                setForm({ ...form, regime: item });
              }}
              hasSelectAll={false}
              shouldToggleOnHover
              valueRenderer={customValueRenderer}
              disableSearch
            />
          </div>
            <div style={{ display: "flex", marginTop: "20px", width: "100%" }}>
                <label style={{ marginRight: 20 }}>Catégories:</label>
                <MultiSelect
                    className="multiInput"
                    options={optionCategory}
                    labelledBy="Select"
                    value={form?.category}
                    onChange={item => {
                        setForm({ ...form, category: item })
                    }}
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
              value={form?.material}
              onChange={(item) => {
                setForm({ ...form, material: item });
              }}
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
