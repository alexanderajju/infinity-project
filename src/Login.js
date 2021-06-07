import { Button } from "@material-ui/core";
import { auth, provider } from "./firebase";
import React from "react";

import "./login.css";

function Login() {
  const signIn = () => {
    auth.signInWithPopup(provider).catch((err) => alert(err.message));
  };

  return (
    <div className="login">
      {/* hello
      <Button style={{ color: "red" }} onClick={signIn}>
        Sign In
      </Button> */}
      <form className="box">
        <h1>Login</h1>

        <input
          type="text"
          name="username"
          placeholder="User Name"
          autoComplete="off"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="off"
        />

        <Button className="submit" style={{ color: "white" }}>
          Login
        </Button>
        <img
          onClick={signIn}
          src="data:image/png;base64,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"
          alt="Google"
          srcset=""
        />
      </form>
    </div>
  );
}

export default Login;
