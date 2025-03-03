import React from 'react';
import DefaultLayout from './layout/DefaultLayout';
import AppRoutes from './routes/appRoutes';
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "915902946640-pqt8tumdf4os14eg9f493ue201rp7t8u.apps.googleusercontent.com";


function App() {
  return (
    <React.Fragment>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <DefaultLayout>
        <AppRoutes />
      </DefaultLayout>
      </GoogleOAuthProvider>
    </React.Fragment>
  )
}

export default App;
