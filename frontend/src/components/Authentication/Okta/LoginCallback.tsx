import { useEffect } from "react";
import { useOktaAuth } from "@okta/okta-react";
import { useNavigate } from "react-router-dom";

const LoginCallback = () => {
  const { authState } = useOktaAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (authState?.isAuthenticated) {
      navigate("/");
    }
  }, [authState, navigate]);

  return <p>Loading...</p>;
};

export default LoginCallback;
