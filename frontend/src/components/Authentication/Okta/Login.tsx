import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOktaAuth } from "@okta/okta-react";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../../redux/store";
import { login } from "../../../redux/slices/UserSlice";

const OktaLogin = () => {
  const { oktaAuth, authState } = useOktaAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const account = useSelector((state: RootState) => state.User.user);
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      if (!authState) return; // Chặn gọi lại nếu đã fetch trước đó

      if (authState.isAuthenticated) {
        setIsProcessing(true);
        const user = await oktaAuth.getUser();
        const access_token = authState.accessToken?.accessToken;

        const reduxForm = {
          email: user?.email || "",
          token: access_token || "",
          isAuthenticated: true,
          firstName: user?.given_name || "",
          lastName: user?.family_name || "",
          picture: user?.picture ? String(user.picture) : "",
        };

        dispatch(login(reduxForm));

        if (!account.isAuthenticated) {
          setTimeout(() => {
            navigate("/dashboard/overview");
          }, 0);
        }
      } else {
        oktaAuth.signInWithRedirect();
      }
    };

    checkAuth();
  }, [authState, oktaAuth, dispatch, navigate]);

  if (!authState || !isProcessing) return <p>Loading...</p>;

  return null;
};

export default OktaLogin;
