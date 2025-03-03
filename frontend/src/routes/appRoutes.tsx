import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoutes from "./privateRoutes";
import SignIn from "../components/Authentication/SignIn";
import Details from "../pages/Dashboard/Detail";
import Overview from "../pages/Dashboard/Overview";

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path="" element={<SignIn />} />
            <Route path="/auth/signin" element={<SignIn />} />
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
        </Routes>
        
    );
};

export default AppRoutes;