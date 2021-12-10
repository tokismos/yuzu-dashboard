import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { MultiSelect } from "react-multi-select-component";
import DropZone from "./components/DropZone";

function App() {
  const ref = useRef();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedMaterial, setSelectedMaterial] = useState([]);
  const [difficulty, setDifficulty] = useState();
  const [image, setImage] = useState({ imagePreview: "" });

  const handleSubmit = (event) => {
    console.log(ref.current.files[0]);
    event.preventDefault();
  };
  const onImageChange = (event) => {
    console.log("hjeeloo");
    // if (event.target.files && event.target.files[0]) {
    //   let reader = new FileReader();
    //   let file = event.target.files[0];
    //   reader.onloadend = () => {
    //     setImage({
    //       imagePreview: reader.result,
    //       file: file,
    //     });
    //   };
    //   reader.readAsDataURL(file);
    // }
    setImage(URL.createObjectURL(event.target.files[0]));
    console.log(event.target);
  };
  const customValueRenderer = (selected, _options) => {
    return selected.length
      ? selected.map(({ label }) => "✔️ " + label)
      : "😶 No Items Selected";
  };
  const handleChange = (event) => {
    setDifficulty(event.target.value);
  };
  const optionsCategorie = [
    { label: "viande ", value: "Viande" },
    { label: "poisson ", value: "Poisson" },
    { label: "Vegetarien ", value: "vegetarien" },
    { label: "sansGluten ", value: "SansGluten" },
  ];
  const optionsMateriel = [
    { label: "four ", value: "Four" },
    { label: "microOnde ", value: "Micro-Onde" },
    { label: "mixeur ", value: "Mixeur" },
    { label: "robotCuisseur ", value: "Robot Cuisseur" },
    { label: "friteuse ", value: "Friteuse" },
  ];

  return (
    <div className="App" onSubmit={handleSubmit}>
      <form className="container">
        <div className="leftContainer"></div>
        <div className="middleContainer">
          <div className="imageComponent">
            <DropZone />
          </div>

          <input
            type="text"
            className="inputName input"
            placeholder="Nom de la recette"
          />
          <div className="nbrComponent">
            <input
              type="text"
              className="nbrInput input"
              placeholder="Nbr. Personne"
            />
            <input
              type="text"
              className="nbrInput input"
              placeholder="T. Cuisson"
            />
            <input
              type="text"
              className="nbrInput input"
              placeholder="T. Preparation"
            />
          </div>
          <div className="infoComponent">
            <div className="categorie ">
              <label style={{ marginRight: 20 }}>Difficulté :</label>
              <select
                style={{ flex: 1, fontSize: 20, height: "120%" }}
                value={difficulty}
                onChange={handleChange}
              >
                <option value="facile">Facile</option>
                <option value="moyenne">Moyenne</option>
                <option value="difficile">Difficile</option>
              </select>
            </div>
            <div className="categorie ">
              <label style={{ marginRight: 20 }}>Categorie :</label>
              <MultiSelect
                className="multiInput"
                options={optionsCategorie}
                labelledBy="Select"
                value={selectedOptions}
                onChange={setSelectedOptions}
                hasSelectAll={false}
                shouldToggleOnHover
                valueRenderer={customValueRenderer}
                disableSearch
              />
            </div>
            <div className="categorie ">
              <label style={{ marginRight: 20 }}>Materiel :</label>
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
          </div>
        </div>
        <div className="rightContainer">
          <label>hji</label>
        </div>
        <button className="submitButton" type="submit">
          hi
        </button>
      </form>
    </div>
  );
}

export default App;
