import axios from "axios";

const db = axios.create({
  baseURL: "https://backend-yuzi.herokuapp.com/recipes",
  // baseURL: "https://2f07-142-184-84-68.ngrok.io/recipes",
});

export { db };
