import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthStack, AppStack } from "./navigation";
import Toast from "react-native-toast-message";
import { useAuth } from "./stateManagement/contexts";
import { Loader } from "./components";

const Main = () => {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <Loader />
        )
    }

    // Check if user needs to complete onboarding
    const needsOnboarding = user && (
        user.role === "incomplete_delivery_agent" || 
        user.role === "incomplete_farmer"
    );

    return (
        <NavigationContainer>
            {user && !needsOnboarding ? <AppStack /> : <AuthStack />}
            <Toast position="top" />
        </NavigationContainer>
    );
}
export default Main;