import React from "react";
import { auth, AuthComponent, uiConfig } from "../firebaseResources/resources";

// AuthDisplay Component
export const AuthDisplay = () => {
  return (
    <AuthComponent
      id="firebaseui-auth-container"
      uiConfig={uiConfig}
      firebaseAuth={auth}
    />
  );
};
