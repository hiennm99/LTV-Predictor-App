
import { OktaAuth } from "@okta/okta-auth-js";

const oktaAuth = new OktaAuth({
  clientId: "0oapbmvtyyl2qb7Dv697",
  issuer: "https://login.puzzle.sg",
  redirectUri: `https://ltv.puzzle.sg/login/callback`,
  scopes: ["openid", "profile", "email"],
  pkce: true,
  tokenManager: {
    autoRenew: true,
    expireEarlySeconds: 30,
  },
});
export default oktaAuth;