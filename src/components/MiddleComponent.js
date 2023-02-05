import React, { useEffect } from "react";
import DropZone from "./DropZone";
import { MultiSelect } from "react-multi-select-component";

export default function MiddleComponent({ form, setForm }) {
  const customValueRenderer = (selected, _options) => {
    return selected.length
      ? selected.map(({ label }) => {
          // console.log({ label });
          return "✔️ " + label;
        })
      : "😶 No Items Selected";
  };
  const customValueRendererValue = (selected, _options) => {
    return selected.length
      ? selected.map((value) => {
          if (typeof "object") return "✔️ " + value.value;

          return "✔️ " + value;
        })
      : "😶 No Items Selected";
  };

  const optionsRegime = [
    { label: "viande", value: "viande" },
    { label: "poisson", value: "poisson" },
    { label: "vegetarien", value: "vegetarien" },
    // { label: "sansGluten", value: "sansGluten" },
    { label: "vegan", value: "vegan" },
  ];

  const optionTypePlat = [
    { label: "Petit dej & brunch", value: "breakfast" },
    { label: "Apéritif", value: "aperitif" },
    { label: "Entrées", value: "starters" },
    { label: "Plats principaux", value: "main" },
    { label: "Dessert", value: "dessert" },
    { label: "Boisson & Cocktail", value: "drinks" },
    { label: "Snacks", value: "snacks" },
  ];

  const optionsMateriel = [
    { label: "Four", value: "Four" },
    { label: "Four à micro-ondes", value: "Four à micro-ondes" },
    { label: "Mixeur", value: "Mixeur" },
    { label: "Batteur ou fouet", value: "Batteur ou fouet" },
    // { label: "Friteuse", value: "Friteuse" },
    // {
    //   label: "Batteur électrique ou fouet",
    //   value: "Batteur électrique ou fouet",
    // },
  ];
  useEffect(() => {
    console.log("form", form);
  });
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
            value={form?.name || ""}
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
            value={form?.chefName || ""}
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
          }}
        >
          <input
            style={{ fontSize: 20, display: "flex", width: "23%" }}
            type="text"
            placeholder="Nbr. Personne"
            defaultValue={form?.nbrPersonne || 0}
            value={form?.nbrPersonne || 0}
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
            value={form?.tempsPreparation || 0}
            defaultValue={form?.tempsPreparation || 0}
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
            defaultValue={form?.tempsCuisson || 0}
            value={form?.tempsCuisson || 0}
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
            value={form?.tempsAttente || 0}
            defaultValue={form?.tempsAttente || 0}
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
              value={form?.difficulty || "Facile"}
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
          <div style={{ display: "flex", marginTop: 10 }}>
            <label style={{ marginRight: 20 }}>Saison :</label>
            <select
              style={{ flex: 1, fontSize: 20 }}
              value={form?.saison || "Facile"}
              onChange={(e) => {
                const tmp = { ...form };
                tmp.saison = e.target.value;
                setForm(tmp);
              }}
            >
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>
          <div style={{ display: "flex", marginTop: "20px", width: "100%" }}>
            <label style={{ marginRight: 20 }}>Regime:</label>
            <MultiSelect
              className="multiInput"
              options={optionsRegime}
              labelledBy="Select"
              value={form?.regime || []}
              onChange={(item) => setForm({ ...form, regime: item })}
              hasSelectAll={false}
              valueRenderer={customValueRendererValue}
              disableSearch
            />
          </div>
          <div style={{ display: "flex", marginTop: "20px", width: "100%" }}>
            <label style={{ marginRight: 20 }}>Types plat:</label>
            <MultiSelect
              className="multiInput"
              options={optionTypePlat}
              labelledBy="Select"
              value={form?.typesPlat || []}
              onChange={(c) => {
                console.log(
                  "itee",
                  c.map((u) => u.value)
                );
                setForm({ ...form, typesPlat: c });
              }}
              hasSelectAll={false}
              valueRenderer={customValueRendererValue}
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
              value={form?.material || []}
              onChange={(item) => {
                setForm({ ...form, material: item });
              }}
              hasSelectAll={false}
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
            value={form?.steps || ""}
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
