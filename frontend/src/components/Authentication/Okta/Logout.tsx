import React from "react";
import { useOktaAuth } from "@okta/okta-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout as logoutAction } from "../../../redux/slices/UserSlice"; // Đổi tên import

const OktaLogout = () => {
  const { oktaAuth } = useOktaAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await oktaAuth.signOut();
    dispatch(logoutAction()); // Gọi action Redux
    navigate("/login");
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default OktaLogout;
