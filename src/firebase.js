import { initializeApp } from "firebase/app";
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';
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

const addImage = async (name, imageURL) => {
  return new Promise(function (resolve, reject) {
    const imagesRef = ref(storage, `recettes/${name}`);

    uploadBytes(imagesRef, imageURL).then((snapshot) => {
      console.log("Uploaded a blob or file!", snapshot);
      getDownloadURL(imagesRef)
        .then((downloadURL) => {
          console.log("download", downloadURL);
          resolve(downloadURL);
        })
        .catch((e) => reject("ER"));
    });
    console.log("imageURL0", imageURL);
  });
};

export { addImage };
