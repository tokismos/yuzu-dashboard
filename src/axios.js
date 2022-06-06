import axios from "axios";
import FormData from 'form-data';

require('dotenv').config();

const db = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/recipes`
});

const generateThumbnail = async (imageURL, name) => {
  console.log({imageURL, name})
  await db.post('/image', { imageURL, name }).then(console.log)
      .catch(console.error);
}

const pushThumbnail = async (thumbURL, name, item) => {
  console.log('Pushing ', name)
  await db.post('/thumb', { thumbURL, name, item }).then(console.log)
}
export { db, generateThumbnail, pushThumbnail };
