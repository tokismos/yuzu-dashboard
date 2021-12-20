import React from "react";
import { useEffect } from "react/cjs/react.development";
import { db } from "../axios";

export default function LeftComponent({
  recipe,
  setForm,
  setModifying,
  setRecipes,
}) {
  const modify = () => {
    setModifying(true);
    let arrCategory = [];
    let arrMaterial = [];
    //to show the values in the MultiSelect
    recipe?.category?.map((item) =>
      arrCategory.push({ label: item, value: item })
    );
    recipe?.material?.map((item) =>
      arrMaterial.push({ label: item, value: item })
    );
    // ---
    console.log("¡steps", recipe.steps);

    let test = "";
    recipe.steps.map((item) => {
      test = test + item + "\n\n\n";
    });
    console.log("erfae ", test);

    setForm({
      ...recipe,
      category: arrCategory,
      material: arrMaterial,
      steps: test,
    });

    console.log("reciiipes0d", recipe);
  };

  const tempModify = () => {
    let nbrPersonne;

    let ingredients;
    let tempsCuisson;
    let tempsPreparation;
    let tempsAttente;
    console.log("this is the recipe clicked", recipe);
    ingredients = recipe.ingredient.replace(/\'/g, "").split(",");
    console.log("newa", recipe);
    if (recipe.nombre_personne) {
      nbrPersonne = recipe?.nombre_personne?.match(/\d/g);
      nbrPersonne = nbrPersonne.join("");
      console.log("new", nbrPersonne);
    } else {
      console.log("nb personne not found");
    }
    let newTemps = recipe.temps_preparation_attente_cuisson
      .replace(/\'/g, "")

      .split(",")
      .map((i) => i.match(/\d/g)?.join(""));
    tempsPreparation = newTemps[0];
    tempsAttente = newTemps[1];
    tempsCuisson = newTemps[2];
    console.log("t", tempsPreparation, tempsAttente, tempsCuisson);
    console.log(newTemps);
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        height: "10vh",
        display: "flex",
        width: "90%",
        flexDirection: "row",
        alignItems: "center",
        margin: 10,
        justifyContent: "space-between",
        padding: 10,
      }}
    >
      <div>
        <img
          src={recipe?.imgURL}
          style={{
            height: "80px",
            width: "80px",

            objectFit: "contain",
          }}
          alt="preview"
        />
      </div>
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          flex: 1,
        }}
      >
        <label
          style={{
            fontWeight: "bold",
            textAlign: "center",
            display: "flex",
          }}
        >
          {recipe?.name}
        </label>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "50px",
          justifyContent: "space-between",
        }}
      >
        <button onClick={() => modify()}>Modifier</button>
        <button
          style={{ backgroundColor: "red", color: "white" }}
          onClick={async () => {
            if (
              window.confirm("Est tu sur de vouloir supprimer cette recette")
            ) {
              // Save it!
              await db.delete(`/${recipe._id}`);
              setRecipes((p) => p.filter((i) => i._id != recipe._id));
              console.log("deleted");
            } else {
              // Do nothing!
              console.log("Thing was not saved to the database.");
            }
          }}
        >
          delete
        </button>
      </div>
    </div>
  );
}
