import { useEffect, useState } from "react";
import "./App.css";

import MiddleComponent from "./components/MiddleComponent";
import RightComponent from "./components/RightComponent";
import { db } from "./axios";
import { addImage } from "./firebase";
import LeftComponent from "./components/LeftComponent";
function App() {
  const [form, setForm] = useState({
    difficulty: "facile",
    category: [],
    material: [],
    ingredients: [],
  });
  const [recipes, setRecipes] = useState(["ss", "s"]);
  const [modifying, setModifying] = useState(false);
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
  };
  const handleSubmit = (setLoading, setMsg, setDisabled) => {
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
        setForm(tmp);
        setLoading(false);
        setMsg("UPLOAD SUCCESSFUL");
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
          backgroundColor: "green",
          height: "100%",
          overflowY: "scroll",
        }}
      >
        {recipes.map((item) => {
          return (
            <LeftComponent
              recipe={item}
              setForm={setForm}
              setModifying={setModifying}
            />
          );
        })}
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
