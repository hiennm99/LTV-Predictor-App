
import { OktaAuth } from "@okta/okta-auth-js";

const oktaAuth = new OktaAuth({
  clientId: window._env_?.VITE_OKTA_CLIENT_ID || import.meta.env.VITE_OKTA_CLIENT_ID,
  issuer: window._env_?.VITE_OKTA_ISSUER || import.meta.env.VITE_OKTA_ISSUER,
  redirectUri: "http://ec2-23-23-79-187.compute-1.amazonaws.com:3003/login/callback",
  scopes: ["openid", "profile", "email"],
  pkce: false,
  tokenManager: {
    autoRenew: true,
    expireEarlySeconds: 30,
  },
});

export default oktaAuth;