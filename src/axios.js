import axios from "axios";

const db = axios.create({
  baseURL: "https://backend-yuzi.herokuapp.com/recipes",
});

export { db };
