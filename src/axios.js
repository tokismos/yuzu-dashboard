import axios from "axios";

require('dotenv').config();

console.log({ env: process.env })
const db = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/recipes`
});

export { db };
