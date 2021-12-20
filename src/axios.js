import axios from "axios";

const db = axios.create({
  baseURL: "https://backend-yuzi.herokuapp.com/recipes",
  //baseURL: "http://localhost:3000/recipes",
});

export { db };
