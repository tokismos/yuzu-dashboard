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
    ingredients: [{ name: "", quantity: "", unite: "g" }],
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

  //Modifier la recette
  const modifyRecipe = async (setLoading, setMsg, setDisabled) => {
    //Transform the value of steps to an array

    const tmp = { ...form };
    console.log("fior cart", form.category);
    tmp.category = form.category.map((item) => item.label);
    tmp.material = form.material.map((item) => item.label);
    const stepsToArray = form.steps?.split(/\r?\n/);
    const stepsWithoutSpace = stepsToArray?.filter(
      //detect the white spaces in a line
      (item) => item.trim().length != 0
    );
    tmp.steps = stepsWithoutSpace;
    console.log("TNMPSD", tmp);

    //Detect if we drop a picture the form.imgURL will be an object of a file,We change the image if it exists
    if (typeof form.imgURL === "object") {
      await addImage(form.name, tmp.imgURL)
        .then(async (url) => {
          tmp.imgURL = url;
        })
        .catch((e) => {
          setMsg("THERE IS AN ERROR", e);
        });
    }
    //2 means we are modifying the scrapped db
    if (modifying == 2) {
      console.log("deleteeed from 222", form._id);

      try {
        await db.post(`/add`, tmp);
        await db.delete(`/${form._id}`);
        setLoading(false);
        setMsg("Modified successfuly");
      } catch (e) {
        setLoading(false);
        setDisabled(false);
        console.log("eeeeeeeeeeeeea", e.response.data.error.message);
        setMsg("Error: ");
        alert(e.response.data.error.message);
      }
    } else {
      console.log("this iiiiiiiis tm,p0", tmp);
      try {
        await db.patch("/modify", tmp);
        setMsg("UPLOAD SUCCESSFUL");
      } catch (e) {
        alert(e.response.data.error.message);
      }
      setLoading(false);
      setDisabled(false);
    }
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
      difficulty: "Facile",
      category: [],
      material: [],
      ingredients: [{ name: "", quantity: "", unite: "g" }],
    });
    setMsg("");
    setLoading(false);
    setDisabled(false);
  };

  //ADD THE RECIPE
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
        try {
          await db.post("/add", tmp);
          setLoading(false);
          setMsg("UPLOAD SUCCESSFUL,WAIT 5s !!!!");
          getAllRecipes();
          setTimeout(() => resetAll(), 5000);
        } catch (e) {
          setLoading(false);
          setDisabled(false);
          setMsg("Error: Not ADDED ");
          alert(e.response.data.error.message);
        }
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
                item?.name
                  ?.toLowerCase()
                  .includes(searchTerm.toLocaleLowerCase())
              ) {
                return item;
              }
            })
            .reverse()
            .map((item) => {
              return (
                <LeftComponent
                  key={item.name}
                  recipe={item}
                  setRecipes={setRecipes}
                  setForm={setForm}
                  setModifying={setModifying}
                  setDisabled={setDisabled}
                  setMsg={setMsg}
                />
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
          backgroundColor: "#d3d3d3",
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
