import React from 'react';
import DefaultLayout from './layout/DefaultLayout';
import AppRoutes from './routes/appRoutes';

import oktaAuth from './secrets/oktaConfigs';
import { Security } from "@okta/okta-react";
import { useNavigate } from "react-router-dom";

const App = () => {
  const navigate = useNavigate();

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: string) => {
    navigate(originalUri || "/");
  };

  return (
    <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
      <DefaultLayout>
        <AppRoutes />
      </DefaultLayout>
    </Security>
  );
};

export default App;
