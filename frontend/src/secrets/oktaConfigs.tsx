
import { OktaAuth } from "@okta/okta-auth-js";

const oktaAuth = new OktaAuth({
  clientId: window._env_?.VITE_OKTA_CLIENT_ID || import.meta.env.VITE_OKTA_CLIENT_ID,
  issuer: window._env_?.VITE_OKTA_ISSUER || import.meta.env.VITE_OKTA_ISSUER,
  redirectUri: window._env_?.VITE_OKTA_REDIRECT_URI || `${window.location.origin}/login/callback`,
  scopes: ["openid", "profile", "email"],
  pkce: true,
  tokenManager: {
    autoRenew: true,
    expireEarlySeconds: 30,
  },
});

export default oktaAuth;