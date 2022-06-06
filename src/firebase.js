import { initializeApp } from "firebase/app";
import { getDatabase, ref as dbRef, get, child } from 'firebase/database';
import { getStorage, ref, listAll, getDownloadURL, uploadBytes } from "firebase/storage";
import Resizer from 'react-image-file-resizer';
import { pushThumbnail } from './axios';

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
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
let downloadUrlImage;
let downloadUrlVideo;

const THUMB_MAX = 216;
const ORIG_MAX = 1980;

const resizeImage = (img, max) => new Promise(resolve => {
  Resizer.imageFileResizer(
      img,
      max,
      max,
      "jpeg",
      100,
      0,
      (uri) => resolve(uri),
      "base64"
  )
});

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

const dataURLtoFile = (dataurl, filename) => {

  const arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]);
  let n = bstr.length,
      u8arr = new Uint8Array(n);

  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, {type:mime});
}


const addImage = async (name, imageURL, videoURL) => {
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



  const uploadImgPromise = new Promise(async (resolve, reject) => {
    if (imageURL) {
      const imageData = await resizeImage(imageURL, ORIG_MAX);
      const image = dataURLtoFile(imageData, name);
      const imagesRef = ref(storage, `recettes/${name}`);

      const thumbData = await resizeImage(imageURL, THUMB_MAX);
      const thumb = dataURLtoFile(thumbData, `${name}_thumb`);
      const thumbRef = ref(storage, `recettes/${name}_thumb`);

      uploadBytes(imagesRef, image).then((snapshot) => {
        console.log("Uploaded a blob or file!", snapshot);
        getDownloadURL(imagesRef)
          .then(async (downloadURL) => {
            console.log("download", downloadURL);
            downloadUrlImage = downloadURL;

            uploadBytes(thumbRef, thumb)
                .then(snapshot => {
                  getDownloadURL(thumbRef)
                      .then(async (thumbDownloadURL) => {
                        resolve({ downloadURL, thumbDownloadURL });

                      })
                })
          })
          .catch((e) => reject("ER"));
      });
    } else {
      resolve();
    }
  });


  return new Promise(function (resolve, reject) {
    Promise.all([uploadImgPromise, uploadVideoPromise]).then((values) => {
      resolve(values);
    });
  });
};

const createThumbnail = async (imageURL, name, item) => {
  try {
    if (!imageURL) return;
    // const response = await fetch(imageURL).then(r => r.blob()).catch(console.error)
    // const file = new File([response], `myImage-${new Date()}.png`, {type: "image/png"})
    // const thumbData = await resizeImage(file, THUMB_MAX)
    // if (!thumbData) return
    //
    //
    // const thumb = dataURLtoFile(thumbData, `${name}_thumb`);
    // console.log({ name, thumb })
    // const thumbRef = ref(storage, `recettes/${name}_thumb`);

    // uploadBytes(thumbRef, thumb)
    //     .then(snapshot => {
    //       getDownloadURL(thumbRef)
    //           .then(async (thumbDownloadURL) => {
    //             await pushThumbnail(thumbDownloadURL, name, item)
    await pushThumbnail("https://firebasestorage.googleapis.com/v0/b/yuzu-5720e.appspot.com/o/recettes%2FCarpaccio%20de%20champignons%20et%20radis%20daikon%20avec%20sa%20vinaigrette%20asiatique%20?alt=media&token=8229b080-e917-4fbd-83cd-face32ad9af3", name, item)
    //       })
        // })

    // const thumbData = await resizeImage(response.data, THUMB_MAX);
    // console.log({ thumbData });
  } catch (e) {
    console.error(e);
  }

}

export { addImage, createThumbnail, getRecipeRating };
