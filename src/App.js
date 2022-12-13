import { useState, useEffect, useContext } from "react";
import "./App.css";

import Login from "./screen/Login/Login";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import useToken from './hooks/useToken';
import { db, uploadStorage, getAllRecipes } from "./axios";
import { addImage, getRecipeRating, getAuthToken, auth } from "./firebase";
import LeftComponent from "./components/LeftComponent";
import MiddleComponent from "./components/MiddleComponent";
import RightComponent from "./components/RightComponent";



function App() {



  const [averageRating, setAverageRating] = useState(0);
  const [ratedLen, setRatedLen] = useState(0);
  const [rated, setRated] = useState({});
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [form, setForm] = useState({
    difficulty: "facile",
    category: [],
    regime: [],
    material: [],
    ingredients: [{ name: "", quantity: "", unite: "g" }],
  });
  const [recipes, setRecipes] = useState([]);
  const [modifying, setModifying] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasPermission, setHasPermission] = useState(false);


  useEffect(() => {
    (async () => {
      setRecipes((await getAllRecipes()).data);
      const { average, recipesRates, ratedLen: len } = await getRecipeRating() || {};

      if (!average || !recipesRates || !len) return;

      setRatedLen(len);
      setAverageRating(average);
      setRated(recipesRates);

    })();
  }, []);

  useEffect(() => {

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {


      if (currentUser)
        currentUser.getIdTokenResult().then((idTokenResult) => {
          if (!!idTokenResult.claims.admin) setHasPermission(true)
          else setHasPermission(false)

        })
      else setHasPermission(false)

    })

    return () => {
      unsubscribeAuth();
    }

  }, []);

  //Modifier la recette
  const modifyRecipe = async (setLoading, setMsg, setDisabled) => {
    //Transform the value of steps to an array

    const tmp = { ...form };
    tmp.category = form?.category?.map((item) => item.label) ?? [];
    tmp.regime = form?.regime?.map((item) => item.label) ?? [];
    tmp.material = form?.material?.map((item) => item.label) ?? [];
    tmp.tempsTotal =
      +form?.tempsAttente + +form?.tempsCuisson + +form?.tempsPreparation;

    const stepsToArray = form.steps?.split(/\r?\n/);
    const stepsWithoutSpace = stepsToArray?.filter(
      //detect the white spaces in a line
      (item) => item.trim().length !== 0
    );
    tmp.steps = stepsWithoutSpace;

    //Detect if we drop a picture the form.imgURL will be an object of a file,We change the image if it exists
    if (typeof form.imgURL === "object") {


      await addImage(form.name, tmp.imgURL, tmp.videoURL)
        .then(async (url) => {
          console.log("ARoy", url);
          tmp.imgURL = url;
          tmp.thumbURL = url;
          // tmp.videoURL = url[1];
        })
        .catch((e) => {
          setMsg("THERE IS AN ERROR", e);
        });
    }
    if (typeof form.videoURL === "object") {
      await addImage(form.name, false, tmp.videoURL)
        .then(async (url) => {
          tmp.videoURL = url[1];
        })
        .catch((e) => {
          setMsg("THERE IS AN ERROR", e);
        });
    }
    //2 means we are modifying the scrapped db



    if (modifying == 2) {
      try {
        const idToken = await getAuthToken()
        await db.post(`/add/${idToken}`, tmp);
        await db.delete(`/${form._id}/${idToken}`);
        setLoading(false);
        setMsg("Modified successfuly");
      } catch (e) {
        setLoading(false);
        setDisabled(false);
        setMsg("Error: ");
        alert(e.response.data.error.message);
      }
    } else {
      try {
        const idToken = await getAuthToken()
        const result = await db.patch(`/modify/${idToken}`, { ...tmp });
        console.log(result)
        setMsg("UPLOAD SUCCESSFUL");
      } catch (e) {

        console.log(e)
        alert("Erreur");
      }
      setLoading(false);
      setDisabled(false);
    }
    setRecipes((await getAllRecipes()).data);
  };
  const resetAll = () => {
    setForm({
      steps: [],
      name: "",
      chefName: "",
      nbrPersonne: "",
      tempsAttente: "",
      tempsPreparation: "",
      tempsCuisson: "",
      imgURL: "",
      difficulty: "Facile",
      category: [],
      regime: [],
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
    console.log("ORF", tmp);
    addImage(form.name, tmp.imgURL, tmp.videoURL)
      .then(async (url) => {
        console.log("ohio", url);
        tmp.imgURL = url[0]?.downloadURL;
        tmp.thumbURL = url[0]?.thumbDownloadURL;
        if (url[1]) {
          tmp.videoURL = url[1];
        }
        tmp.steps = stepsWithoutSpace;
        tmp.category = form.category.map((item) => item.label);
        tmp.regime = form.regime.map((item) => item.label);
        tmp.material = form.material.map((item) => item.label);
        tmp.tempsTotal =
          +form?.tempsAttente + +form?.tempsCuisson + +form?.tempsPreparation;



        try {
          const idToken = await getAuthToken()
          const result = await db.post(`/add/${idToken}`, tmp);
          console.log(result)
          setLoading(false);
          setMsg("UPLOAD SUCCESSFUL,WAIT 5s !!!!");
          setRecipes((await getAllRecipes()).data);
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
        console.log(e)
        setLoading(false);
        setDisabled(false);
      });
  };



  if (!hasPermission) return <Login />
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
          placeholder={`chercherr une recette`}
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
        <label>Note moyenne {averageRating} ({ratedLen} / {recipes.length} recettes notées)</label>
        <div style={{ overflowY: "scroll", width: "100%", padding: 0 }}>
          {recipes
            .filter((item) => {
              if (searchTerm === "") {
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
              const recipeRate = rated[item._id];
              return (
                <LeftComponent
                  key={item.name}
                  recipe={item}
                  rate={recipeRate || NaN}
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
