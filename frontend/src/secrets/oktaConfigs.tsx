
import { OktaAuth } from "@okta/okta-auth-js";

const oktaAuth = new OktaAuth({
  clientId: window._env_?.VITE_OKTA_CLIENT_ID || import.meta.env.VITE_OKTA_CLIENT_ID,
  issuer: window._env_?.VITE_OKTA_ISSUER || import.meta.env.VITE_OKTA_ISSUER,
  redirectUri: window._env_?.VITE_OKTA_REDIRECT_URI || import.meta.env.VITE_OKTA_REDIRECT_URI,
  scopes: ["openid", "profile", "email"],
  pkce: false,
  tokenManager: {
    autoRenew: true,
    expireEarlySeconds: 30,
  },
});

export default oktaAuth;