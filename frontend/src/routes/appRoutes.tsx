import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoutes from "./privateRoutes";
import Details from "../pages/Dashboard/Detail";
import Overview from "../pages/Dashboard/Overview";
import OktaLogin from "../components/Authentication/Okta/Login";
import { LoginCallback } from "@okta/okta-react";

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<OktaLogin />} />
            <Route path="/login/callback" element={<LoginCallback />} />

            <Route
                path="/dashboard"
                element={
                    <PrivateRoutes>
                        <Overview />
                    </PrivateRoutes>
                }
            />
            <Route
                path="/dashboard/overview"
                element={
                    <PrivateRoutes>
                        <Overview />
                    </PrivateRoutes>
                }
            />
            <Route
                path="/dashboard/game/details"
                element={
                    <PrivateRoutes>
                        <Details />
                    </PrivateRoutes>
                }
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default AppRoutes;
