import { initializeApp } from "firebase/app";
import { getDatabase, ref as dbRef, get, child } from 'firebase/database';
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDp2NnsdP0i01XwJMmSynmmSrC_R23MUiQ",
  authDomain: "yuzu-5720e.firebaseapp.com",
  databaseURL: "https://yuzu-5720e-default-rtdb.firebaseio.com",
  projectId: "yuzu-5720e",
  storageBucket: "yuzu-5720e.appspot.com",
  messagingSenderId: "246034960415",
  appId: "1:246034960415:web:c4aa304ce2a2bc379bc52a",
  measurementId: "G-N0G4M012VE",
};
console.log("firevbase initialid");
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
let downloadUrlImage;
let downloadUrlVideo;

const getRecipeRating = async () => {
  try {
    const refDatabase = dbRef(getDatabase())
    const snapshot = await get(child(refDatabase, '/rate'))

    if (snapshot.exists()) {
      /**
       * @name recipesRates
       * @type {{ recipeID_1: number, recipeID_2: number, recipeID_n: number }}
       *
       * is an object with all recipes rate, order by recipes key
       *
       * {
       *     recipe_1: 3,
       *     recipe_2: 4
       * }
       */
      const recipesRates = Object.entries(snapshot.val()).reduce((acc, val) => {
        const rates = Object.values(val[1]);
        const sum = rates.reduce((toSum, newRate) => toSum + newRate.rate, 0);

        acc[val[0]] = sum / rates.length;
        return acc;
      }, {});

      const ratedLen = Object.keys(recipesRates).length;
      const average = Object.values(recipesRates).reduce((sum, val) => sum + val, 0) / ratedLen;

      return { average, recipesRates, ratedLen  };
    }
  } catch (e) {
    console.error(e)
  }
}

const addImage = async (name, imageURL, videoURL) => {
  let i;
  const uploadVideoPromise = new Promise((resolve, reject) => {
    if (videoURL) {
      const videoRef = ref(storage, `recettes/${videoURL.name}`);

      uploadBytes(videoRef, videoURL).then((snapshot) => {
        console.log("Uploaded a blob or file!", snapshot);
        getDownloadURL(videoRef)
          .then((downloadURL) => {
            console.log("download", downloadURL);
            downloadUrlVideo = downloadURL;
            resolve(downloadURL);
          })
          .catch((e) => reject("ER"));
      });
    } else {
      resolve();
    }
  });

  const uploadImgPromise = new Promise((resolve, reject) => {
    if (imageURL) {
      const imagesRef = ref(storage, `recettes/${name}`);

      uploadBytes(imagesRef, imageURL).then((snapshot) => {
        console.log("Uploaded a blob or file!", snapshot);
        getDownloadURL(imagesRef)
          .then((downloadURL) => {
            console.log("download", downloadURL);
            downloadUrlImage = downloadURL;
            resolve(downloadURL);
          })
          .catch((e) => reject("ER"));
      });
    } else {
      resolve();
    }
  });
  return new Promise(function (resolve, reject) {
    // let uploadVideoPromise = resolve();

    // console.log("kayn", videoURL);

    Promise.all([uploadImgPromise, uploadVideoPromise]).then((values) => {
      console.log("chbk", values);
      resolve(values);
    });
    console.log("imageURL0", downloadUrlImage);
  });
};

export { addImage, getRecipeRating };
