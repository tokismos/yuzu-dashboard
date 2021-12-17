import React from "react";
import { useEffect } from "react/cjs/react.development";

export default function LeftComponent({ recipe, setForm }) {
  return (
    <div
      style={{
        backgroundColor: "white",
        height: "15vh",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <div>
        <img
          src={recipe?.imgURL}
          style={{
            height: "10vh",
            width: "15wh",

            objectFit: "contain",
          }}
          alt="preview"
        />
      </div>
      <div style={{ width: "60%", justifyContent: "center", display: "flex" }}>
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
      <div>
        <button
          onClick={() => {
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
          }}
        >
          Modifier
        </button>
      </div>
    </div>
  );
}
