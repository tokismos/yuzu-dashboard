import axios from "axios";
import FormData from "form-data";
import { getAuth } from "firebase/auth";

import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";

import { storage, getAuthToken } from "./firebase";

require("dotenv").config();

const db = axios.create({
  // baseURL: `${process.env.REACT_APP_API_URL}/recipes`,
  baseURL: `https://yuzustagingapi.herokuapp.com/recipes`,
});

const generateThumbnail = async (imageURL, name) => {
  console.log({ imageURL, name });
  const idToken = await getAuthToken();
  await db
    .post(`/image/${idToken}`, { imageURL, name })
    .then(console.log)
    .catch(console.error);
};

const pushThumbnail = async (thumbURL, item) => {
  const idToken = await getAuthToken();
  await db.post(`/thumb/${idToken}`, { thumbURL, item }).then(console.log);
};

const getAllRecipes = async () => {
  console.log(
    await new Promise((resolve, reject) => {
      resolve("OK");
    })
  );

  return await db.get("/all");
};

const getRecipeRatings = async () => {
  const idToken = await getAuthToken();
  return await db.get(`ratings/${idToken}`);
};

// Utilisé pour compresser toutes images des recettes actuelles

// const editImg = async (_id, newImg) => {
//   console.log(_id, 'id')
//   console.log(newImg, 'NEWimg')
//   return await db.post("/editImg", {_id, newImg})
// }

export {
  db,
  generateThumbnail,
  pushThumbnail,
  getAllRecipes,
  getRecipeRatings,
};
