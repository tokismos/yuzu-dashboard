import React from "react";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

import "./Login.css";

require("dotenv").config();

const Login = ({ setToken }) => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  const handleGoogleSubmit = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      const email = error.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.error({ errorCode, errorMessage, email, credential });
    }
  };

  return (
    <div className="login-wrapper">
      <h1>Please Log In</h1>
      <button onClick={handleGoogleSubmit}>Google Submit</button>
    </div>
  );
};

export default Login;
