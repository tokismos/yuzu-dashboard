import React, { useEffect, useRef, useState } from "react";
import Loader from "react-loader-spinner";

const InputComponent = ({ index, setIngredients, ingredients }) => {
  const [ingredient, setIngredient] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unite, setUnite] = useState("gramme");
  //To change the object of just the same index
  useEffect(() => {
    ingredients[index] = { name: ingredient, quantity, unite };
    setIngredients([...ingredients]);
  }, [ingredient, quantity, unite]);

  const remove = () => {
    let newArray = ingredients.filter((item, i) => {
      console.log("INDEX", index, i, item);
      return index != i;
    });

    console.log(JSON.stringify(newArray));
    setIngredients([...newArray]);
  };
  return (
    <div key={index}>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <input
          placeholder={`Ingredient N: ${index + 1}`}
          value={ingredients[index].ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          type="text"
          style={{ ...styles.input, width: "60%" }}
        />
        <input
          placeholder={`Qtité`}
          defaultValue={ingredients[index].quantity}
          onChange={(e) => setQuantity(e.target.value)}
          type="text"
          style={{ ...styles.input, width: "15%" }}
        />
        <select
          style={{ width: "15%", fontSize: 20 }}
          value={ingredients[index].unite}
          onChange={(e) => setUnite(e.target.value)}
        >
          <option value="gramme">g</option>
          <option value="cuillere">c à s</option>
          <option value="ml">Ml</option>
          <option value="l">L</option>
          <option value="cac">c à c</option>
          <option value="pincee">Pincée</option>
        </select>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: 20,
          marginBottom: 10,
        }}
      >
        <a href="#" onClick={remove} tabIndex="-1">
          Delete
        </a>
      </div>
    </div>
  );
};

export default function RightComponent({ form, setForm, onClick }) {
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [ingredients, setIngredients] = useState([
    { ingredient: "", quantity: "", unite: "" },
  ]);
  const ref = useRef(null);
  const handleClick = () => {
    setIngredients((p) => [...p, ""]);
    ref.current.scrollIntoView({ block: "center" });
  };

  useEffect(() => {
    console.log("this is FORM", Object.keys(form).length);
    if (Object.keys(form).length == 10) {
      //number of keys in the form
      setDisabled(false);
    }
  }, [form]);
  useEffect(() => {
    const tmp = { ...form };
    tmp.ingredients = [...ingredients];
    setForm(tmp);
  }, [ingredients]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div ref={ref} style={{ flex: 1, overflowY: "scroll" }}>
        {ingredients.map((item, index) => {
          return (
            <InputComponent
              key={index}
              index={index}
              setIngredients={setIngredients}
              ingredients={ingredients}
            />
          );
        })}

        <button
          style={{
            backgroundColor: "black",
            color: "white",
            height: "50px",
            width: "50px",
          }}
          onClick={() => {
            handleClick();
          }}
        >
          ADD
        </button>
      </div>
      <label style={{ alignSelf: "center", display: "flex" }}>{msg}</label>
      <div
        style={{
          height: "10%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          disabled={disabled}
          onClick={() => {
            setMsg("");
            setLoading(true);
            setDisabled(true);
            onClick(setLoading, setMsg, setDisabled);
          }}
          style={{
            backgroundColor: disabled ? "gray" : "orange",
            width: "90%",
            height: "90%",
            fontSize: 20,
            flexDirection: "row",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loading && (
            <Loader
              type="Puff"
              color="white"
              height={30}
              width={30}
              //3 secs
            />
          )}
          Ajouter La recette
        </button>
      </div>
    </div>
  );
}

const styles = {
  input: {
    fontSize: 20,
    width: "100%",
    height: "50px",
  },
};
