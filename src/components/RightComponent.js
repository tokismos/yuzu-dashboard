import React, { useEffect, useRef, useState } from "react";
import Loader from "react-loader-spinner";
import {signOut} from "firebase/auth"
import { auth } from "../firebase"

export default function RightComponent({
  form,
  setForm,
  onClick,
  modifying,
  setDisabled,
  disabled,
  loading,
  setLoading,
  setMsg,
  msg,
}) {
  const [ingredients, setIngredients] = useState([
    { ingredient: "", quantity: "", unite: "" },
  ]);
  const InputComponent = ({ index, setIngredients, ingredients }) => {
    const [ingredient, setIngredient] = useState(form.ingredients[index].name);
    const [quantity, setQuantity] = useState(form.ingredients[index].quantity);
    const [unite, setUnite] = useState(form.ingredients[index].unite);
    //To change the object of just the same index
    useEffect(() => {
      const tmp = { ...form };
      tmp.ingredients[index] = { name: ingredient, quantity, unite };
    }, [ingredient, quantity, unite]);

    const remove = () => {
      let newArray = form.ingredients.filter((item, i) => {
        console.log("INDEX", index, i, item);
        return index != i;
      });

      console.log(JSON.stringify(newArray));
      const tmp = { ...form };
      tmp.ingredients = newArray;
      setForm(tmp);
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
            defaultValue={form.ingredients[index].name}
            onChange={(e) => setIngredient(e.target.value)}
            type="text"
            style={{ ...styles.input, width: "60%" }}
          />
          <input
            placeholder={`Qtité`}
            defaultValue={form.ingredients[index].quantity}
            onChange={(e) => setQuantity(e.target.value)}
            type="text"
            style={{ ...styles.input, width: "15%" }}
          />
          <select
            style={{ width: "15%", fontSize: 20 }}
            defaultValue={form.ingredients[index].unite}
            onChange={(e) => setUnite(e.target.value)}
          >
            <option value="g">g</option>
            <option value="c à s">c à s</option>
            <option value="ml">Ml</option>
            <option value="l">L</option>
            <option value="c à c">c à c</option>
            <option value="pincée">Pincée</option>
            <option value="unite">Unite</option>
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

  const ref = useRef(null);
  const handleClick = () => {
    const tmp = { ...form };
    tmp.ingredients = [
      ...tmp.ingredients,
      { name: "", quantity: "", unite: "g" },
    ];
    setForm(tmp);
    ref.current.scrollIntoView({ block: "center" });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <div ref={ref} style={{ flex: 1, overflowY: "scroll" }}>
          {form.ingredients.map((item, index) => {
            return (
              <InputComponent
                item={item}
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
              marginLeft: 20,
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
            flexDirection: "column",
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
              console.log("HOOHOO", form);
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
            {!!modifying ? "Modifier Recette " : " Ajouter La recette"}
          </button>

        </div>



      </div>

      <button

        onClick={async () => {
          await signOut(auth)
   
        }}
        style={{
          marginTop:30,
          backgroundColor: "red",
          width: "100%",
          height: 70,
          fontSize: 20,
          flexDirection: "row",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >

        Se déconnecter
      </button>

    </>
  );
}

const styles = {
  input: {
    fontSize: 20,
    width: "100%",
    height: "50px",
  },
};
