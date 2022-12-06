import axios from "axios";
import FormData from 'form-data';
import { getAuth } from 'firebase/auth';




require('dotenv').config();

const db = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/recipes`
});

const generateThumbnail = async (imageURL, name) => {
  console.log({imageURL, name})
  const auth = getAuth();
  const user = auth.currentUser;
  await db.post('/image', { imageURL, name,  authId:user.uid }).then(console.log)
      .catch(console.error)
}

const pushThumbnail = async (thumbURL, item) => {
  const auth = getAuth();
  const user = auth.currentUser;
  await db.post('/thumb', { thumbURL, item, authId:user.uid}).then(console.log)
}

const getAllRecipes = async () => {
  return await db.get('/all')
}

// Utilisé pour compresser toutes images des recettes actuelles

// const editImg = async (_id, newImg) => {
//   console.log(_id, 'id')
//   console.log(newImg, 'NEWimg')
//   return await db.post("/editImg", {_id, newImg})
// }

export { db, generateThumbnail, pushThumbnail, getAllRecipes};
