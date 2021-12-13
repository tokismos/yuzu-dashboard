import { initializeApp } from "firebase/app";
// Follow this pattern to import other Firebase services
// import { } from 'firebase/<service>';
import {
  getStorage,
  ref,
  uploadString,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_Khzc-fgbnfetYLwwdkSiNYPuRVjbdN8",
  authDomain: "yuzu-a0d71.firebaseapp.com",
  projectId: "yuzu-a0d71",
  storageBucket: "yuzu-a0d71.appspot.com",
  messagingSenderId: "768418404122",
  appId: "1:768418404122:web:07f4cd1177316436107ea3",
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
          resolve(downloadURL);
        })
        .catch((e) => reject("ER"));
    });
    console.log("imageURL0", imageURL);
  });
};

export { addImage };
