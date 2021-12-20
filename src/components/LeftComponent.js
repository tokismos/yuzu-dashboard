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

    let tmp = "";
    recipe.steps.map((item) => {
      tmp = tmp + item + "\n\n\n";
    });

    setForm({
      ...recipe,
      category: arrCategory,
      material: arrMaterial,
      steps: tmp,
    });
  };

  const tempModify = async () => {
    setModifying(2); // 2 to tell that we are modifiying from the temp Modify
    let nbrPersonne;

    let ingredients;
    let tempsCuisson;
    let tempsPreparation;
    let tempsAttente;
    let nom_recette;
    console.log("this is the recipe clicked", recipe);
    const tmpIngredient = recipe.ingredient.replace(/\'/g, "").split(",");
    ingredients = tmpIngredient.map((item) => {
      return {
        name: item,
        unite: "g",
      };
    });
    const tmpName = recipe.nom_recette.replace(/\-/g, " ");
    nom_recette = tmpName.charAt(0).toUpperCase() + tmpName.slice(1);

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
    tempsCuisson = newTemps[1];
    tempsAttente = newTemps[2];
    console.log("this is recupe", recipe);

    // to show the informations in the page
    setForm({
      _id: recipe._id,
      website: recipe.lien_recette,
      number: recipe.nom_figures,
      name: nom_recette,
      tempsPreparation: tempsPreparation,
      tempsCuisson: tempsCuisson,
      tempsAttente: tempsAttente.length == 4 ? "" : tempsAttente,
      nbrPersonne: nbrPersonne,
      difficulty: "Facile",
      category: [],
      material: [],
      steps: [""],
      ingredients: ingredients,
    });
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
          {recipe.nom_recette || recipe?.name}
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
        <button onClick={recipe.nom_figures ? tempModify : modify}>
          Modifier
        </button>
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
        <label
          style={{ fontSize: 20, fontWeight: "bold", textAlign: "center" }}
        >
          {recipe.garder_recette}
        </label>
      </div>
    </div>
  );
}
