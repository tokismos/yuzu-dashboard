import { useEffect, useState } from "react";
import "./App.css";

import MiddleComponent from "./components/MiddleComponent";
import RightComponent from "./components/RightComponent";
import { db } from "./axios";
import { addImage } from "./firebase";
import LeftComponent from "./components/LeftComponent";
function App() {
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    difficulty: "facile",
    category: [],
    material: [],
    ingredients: [{ name: "", quantity: "", unite: "gramme" }],
  });
  const [recipes, setRecipes] = useState([]);
  const [modifying, setModifying] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const getAllRecipes = async () => {
    const result = await db.get("/");
    console.log("res", result);
    setRecipes(result.data);
  };

  useEffect(() => {
    getAllRecipes();
  }, []);
  const modifyRecipe = async (setLoading, setMsg, setDisabled) => {
    const stepsToArray = form?.steps?.split(/\r?\n/);
    const stepsWithoutSpace = stepsToArray?.filter(
      //detect the white spaces in a line
      (item) => item.trim().length != 0
    );
    const tmp = { ...form };

    tmp.steps = stepsWithoutSpace;
    tmp.category = form.category.map((item) => item.label);
    tmp.material = form.material.map((item) => item.label);
    if (typeof form.imgURL === "object") {
      await addImage(form.name, tmp.imgURL)
        .then(async (url) => {
          tmp.imgURL = url;
        })
        .catch((e) => {
          setMsg("THERE IS AN ERROR", e);
        });
    }
    await db.patch("/modify", tmp);

    setMsg("Modified successful");
    setLoading(false);
    setDisabled(false);
    getAllRecipes();
  };
  const resetAll = () => {
    setForm({
      steps: [],
      name: "",
      nbrPersonne: "",
      tempsAttente: "",
      tempsPreparation: "",
      tempsCuisson: "",
      imgURL: "",
      difficulty: "facile",
      category: [],
      material: [],
      ingredients: [{ name: "", quantity: "", unite: "gramme" }],
    });
    setMsg("");
    setLoading(false);
    setDisabled(false);
  };
  const handleSubmit = () => {
    const stepsToArray = form?.steps?.split(/\r?\n/);
    const stepsWithoutSpace = stepsToArray?.filter(
      //detect the white spaces in a line
      (item) => item.trim().length != 0
    );
    const tmp = { ...form };
    //we wait add image to storage to get url then call the post api to add to mongoDB

    addImage(form.name, tmp.imgURL)
      .then(async (url) => {
        tmp.imgURL = url;
        tmp.steps = stepsWithoutSpace;
        tmp.category = form.category.map((item) => item.label);
        tmp.material = form.material.map((item) => item.label);
        await db.post("/add", tmp);
        setLoading(false);
        setMsg("UPLOAD SUCCESSFUL");
        getAllRecipes();
      })
      .catch((e) => {
        setMsg("THERE IS AN ERROR", e);
        setLoading(false);
        setDisabled(false);
      });
  };
  useEffect(() => {
    console.log("fooorm", form);
  }, [form]);
  useEffect(() => {
    if (msg === "UPLOAD SUCCESSFUL") {
      setTimeout(() => resetAll(), 2000);
    }
  }, [msg]);
  return (
    <div
      style={{
        flexDirection: "row",
        display: "flex",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "25%",
          backgroundColor: "#d3d3d3",
          height: "100%",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          padding: 10,
        }}
      >
        <input
          placeholder={`Chercher une recette`}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          style={{
            alignSelf: "center",
            display: "flex",
            width: "90%",
            height: "10px",
            fontSize: 20,
            padding: 15,
            margin: 10,
          }}
        />
        <label>{recipes.length} recettes</label>
        <div style={{ overflowY: "scroll", width: "100%", padding: 0 }}>
          {recipes
            .filter((item) => {
              if (searchTerm == "") {
                return item;
              } else if (
                item.name.toLowerCase().includes(searchTerm.toLocaleLowerCase())
              ) {
                return item;
              }
            })
            .reverse()
            .map((item) => {
              return (
                <>
                  <LeftComponent
                    recipe={item}
                    recipes={recipes}
                    setRecipes={setRecipes}
                    setForm={setForm}
                    setModifying={setModifying}
                  />
                </>
              );
            })}
        </div>
      </div>
      <div style={{ width: "50%", margin: 20 }}>
        <MiddleComponent form={form} setForm={setForm} />
      </div>
      <div
        style={{
          width: "25%",
          height: "100%",
        }}
      >
        <RightComponent
          msg={msg}
          setMsg={setMsg}
          disabled={disabled}
          setDisabled={setDisabled}
          loading={loading}
          setLoading={setLoading}
          form={form}
          setForm={setForm}
          modifying={modifying}
          onClick={modifying ? modifyRecipe : handleSubmit}
        />
      </div>
    </div>
  );
}

export default App;
