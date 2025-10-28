import React from "react";
import { logout } from "../action/UserActions";

const LogoutButton = () => {
  return (
    <form
      action={async () => {
        "use server";
        await logout();
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  );
};

export default LogoutButton;
