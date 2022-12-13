import { initializeApp } from "firebase/app";
import { getDatabase, ref as dbRef, get, child } from 'firebase/database';
import { getStorage, ref, listAll, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { getAuth, getIdToken, } from "firebase/auth"
import Resizer from 'react-image-file-resizer';
import { pushThumbnail, editImg, getRecipeRatings, uploadStorage } from './axios';

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
export const storage = getStorage(app);
export const auth = getAuth(app)
let downloadUrlImage;
let downloadUrlVideo;

const THUMB_MAX = 216;
const ORIG_MAX = 1000;

const resizeImage = (img, max) => new Promise(resolve => {
  Resizer.imageFileResizer(
    img,
    max,
    max,
    "jpeg",
    92,
    0,
    (uri) => resolve(uri),
    "base64"
  )
});

const getAuthToken = () => getIdToken(auth.currentUser, true)
  .then((idToken) => {

    return idToken

  })
  .catch((error) => {
    console.log(error);
  });

const getRecipeRating = async () => {

  try {

    const result = (await getRecipeRatings()).data

    console.log(result)

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
    const recipesRates = Object.entries(result).reduce((acc, val) => {
      const rates = Object.values(val[1]);
      const sum = rates.reduce((toSum, newRate) => toSum + newRate.rate, 0);

      acc[val[0]] = sum / rates.length;
      return acc;
    }, {});

    const ratedLen = Object.keys(recipesRates).length;
    const average = Object.values(recipesRates).reduce((sum, val) => sum + val, 0) / ratedLen;

    return { average, recipesRates, ratedLen };

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

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
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
    if (!imageURL || item.thumbURL) return;
    const response = await fetch(imageURL).then(r => r.blob()).catch(console.error)

    const file = new File([response], `myImage-${new Date()}.png`, { type: "image/png" })
    const thumbData = await resizeImage(file, THUMB_MAX)
    const origData = await resizeImage(file, ORIG_MAX)

    if (!thumbData || !origData) {
      return
    }

    const orig = dataURLtoFile(origData, name);
    const origRef = ref(storage, `recettes/${name}`);

    const thumb = dataURLtoFile(thumbData, `${name}_thumb`);
    const thumbRef = ref(storage, `recettes/${name}_thumb`);

    await uploadBytes(origRef, orig)
    await uploadBytes(thumbRef, thumb)

    const thumbDownloadURL = await getDownloadURL(thumbRef);

    await pushThumbnail(thumbDownloadURL, item,)
  } catch (e) {
    console.error(e);
  }

}



// ATTENTION, getAllStorage compresse toutes les images des recettes
// actualise leur ref dans la DB

// const listRef = ref(storage, 'recettes/');

// const getAllStorage = () => {
//   listAll(listRef)
//     .then(async (res) => {

//       const allRecipes = (await getAllRecipes()).data

//       var i = 0
//       res.items.forEach(async (itemRef) => {

//         if (
//           !itemRef.name.includes("thumb") &&
//           !itemRef.name.includes("png")
//           && !itemRef.name.includes(".mov")

//         ) {
//           console.log(itemRef)


//           var oldUrl = await getDownloadURL(ref(storage, itemRef.fullPath))

//           console.log(oldUrl)


//           const response = await fetch(oldUrl).then(r => r.blob()).catch(console.error)
//           const file = new File([response], `myImage-${new Date()}.png`, { type: "image/png" })

//           const origData = await resizeImage(file, ORIG_MAX)


//           await deleteObject(ref(storage, itemRef.fullPath)).then(() =>
//             console.log("deleteOk"),
//             () => console.log("deleteError")
//           )



//           const orig = dataURLtoFile(origData, itemRef.name);
//           const origRef = ref(storage, `recettes/${itemRef.name}_compression`);
//           await uploadBytes(origRef, orig)
//           const newUrl = await getDownloadURL(ref(storage, origRef))
//           console.log(newUrl)
//           const indexToken = oldUrl.indexOf('?alt=')
//           oldUrl = oldUrl.substring(indexToken, 0)
//           console.log(oldUrl)
//           var id = ""
//           allRecipes.forEach(el=>{
//             if(el.imgURL && el.imgURL.includes(oldUrl) &&
//             !el.imgURL.includes("thumb") &&
//             !el.imgURL.includes("png") && 
//             !itemRef.name.includes(".mov")) id = el._id
//           })
//           if(id!="")
//           {
//             console.log(id)
//             const result = await editImg(id, newUrl)
//             console.log(result)
//           }




//         }

//         i++
//       });
//       console.log(i)
//     }).catch((error) => {
//       // Uh-oh, an error occurred!
//     });
// }

export { addImage, createThumbnail, getRecipeRating, getAuthToken };
