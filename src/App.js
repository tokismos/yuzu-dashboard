import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { MultiSelect } from "react-multi-select-component";
import DropZone from "./components/DropZone";
import MiddleComponent from "./components/MiddleComponent";
import RightComponent from "./components/RightComponent";
function App() {
  const ref = useRef(null);

  const handleSubmit = (event) => {
    console.log(ref.current.files[0]);
    event.preventDefault();
  };
  useEffect(() => {
    ref.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [ref]);
  return (
    <div
      style={{
        flexDirection: "row",
        display: "flex",
        height: "100vh",
      }}
    >
      <div style={{ width: "25%", backgroundColor: "green" }}>
        <label>hi</label>
      </div>
      <div style={{ width: "50%", margin: 20 }}>
        <MiddleComponent />
      </div>
      <div
        style={{
          width: "25%",
          height: "100%",
        }}
      >
        <RightComponent />
      </div>
    </div>
  );
}

export default App;
