import React, { useEffect, useState } from "react";

const InputComponent = ({ index, setIngredients, ingredients }) => {
  const [ingredient, setIngredient] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unite, setUnite] = useState("");
  //To change the object of just the same index
  useEffect(() => {
    ingredients[index] = { ingredient, quantity, unite };
    setIngredients([...ingredients]);
  }, [ingredient, quantity, unite]);
  const remove = () => {
    let newArray = ingredients.filter((item, i) => {
      return index != i;
    });

    console.log(JSON.stringify(newArray));
    setIngredients([...newArray]);
  };
  return (
    <div>
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
          value={ingredients[index].quantity}
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
          <option value="kilo">kg</option>
        </select>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginRight: 20,
        }}
      >
        <a href="#" onClick={remove} tabIndex="-1">
          Delete
        </a>
      </div>
    </div>
  );
};

export default function RightComponent() {
  const [ingredients, setIngredients] = useState([""]);
  const handleClick = () => {
    setIngredients((p) => [...p, ""]);
  };
  useEffect(() => {
    console.log(JSON.stringify(ingredients));
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
      <div style={{ backgroundColor: "red", flex: 1, overflowY: "scroll" }}>
        {ingredients.map((item, index) => {
          return (
            <InputComponent
              index={index}
              setIngredients={setIngredients}
              ingredients={ingredients}
            />
          );
        })}

        <button onClick={handleClick}>ADD</button>
      </div>
      <div style={{ backgroundColor: "yellow", height: "10%" }}>
        <button>ADDDDDD</button>
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
