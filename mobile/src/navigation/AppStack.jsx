import React from "react";
import { View } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomDrawer from "../components/CustomDrawer";
import { COLORS } from "../constants";
import { useAuth } from "../stateManagement/contexts";

import {
  Categories,
  Profile,
  Notifications,
  Orders,
  Settings,
} from "../screens";
import { NotificationBadge } from "../components/notifications";

import BottomTabNavigation from "./BottomTabNavigation";
import FarmerStack from "./FarmerStack";
import ApplicationTracking from "../screens/deliveryAgent/ApplicationTracking";
import AccountActivation from "../screens/AccountActivation";
import DeliveryAgentDashboard from "../screens/deliveryAgent/DeliveryAgentDashboard";

const Drawer = createDrawerNavigator();

const AppStack = () => {
  const { user } = useAuth();

  console.log("\n\nuser: ", user);

  // Determine initial route based on user role
  const getInitialRouteName = () => {
    if (user?.role === "pending_delivery_agent" || user?.role === "pending_farmer") {
      return "ApplicationTracking";
    }
    if (user?.role === "approved_delivery_agent" || user?.role === "approved_farmer") {
      return "AccountActivation";
    }
    return "Home";
  };

  return (
    <Drawer.Navigator
      initialRouteName={getInitialRouteName()}
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: COLORS.primary,
        drawerActiveTintColor: COLORS.lightWhite,
        drawerInactiveTintColor: COLORS.black,
        drawerLabelStyle: {
          marginLeft: 5,
          fontFamily: "medium",
          fontSize: 15,
        },
        drawerStyle: {
          width: "70%",
        },
      }}
    >
      <Drawer.Screen
        name="Home"
        component={BottomTabNavigation}
        options={{
          drawerIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Categories"
        component={Categories}
        options={{
          drawerIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "folder" : "folder-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={Profile}
        options={{
          drawerIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={Notifications}
        options={{
          drawerIcon: ({ color, focused }) => (
            <View style={{ position: 'relative' }}>
              <Ionicons
                name={focused ? "notifications" : "notifications-outline"}
                size={22}
                color={color}
              />
              <NotificationBadge />
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="Orders"
        component={Orders}
        options={{
          drawerIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "bag" : "bag-outline"}
              size={22}
              color={color}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={22} color={color} />
          ),
        }}
              />

        {/* Application Tracking for Pending Users */}
        {(user?.role === "pending_delivery_agent" || user?.role === "pending_farmer") && (
          <Drawer.Screen
            name="ApplicationTracking"
            component={ApplicationTracking}
            options={{
              drawerIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? "document-text" : "document-text-outline"}
                  size={22}
                  color={color}
                />
              ),
            }}
          />
        )}

        {/* Account Activation for Approved Users */}
        {(user?.role === "approved_delivery_agent" || user?.role === "approved_farmer") && (
          <Drawer.Screen
            name="AccountActivation"
            component={AccountActivation}
            options={{
              drawerIcon: ({ color, focused }) => (
                <Ionicons
                  name={focused ? "checkmark-circle" : "checkmark-circle-outline"}
                  size={22}
                  color={color}
                />
              ),
            }}
          />
        )}

      {/* Farmer */}
      {user?.role === "farmer" && (
        <Drawer.Screen
          name="My Shop"
          component={FarmerStack}
          options={{
            drawerIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "leaf" : "leaf-outline"}
                size={22}
                color={color}
              />
            ),
          }}
        />
      )}

      {/* Delivery Agent */}
      {user?.role === "delivery_agent" && (
        <Drawer.Screen
          name="Delivery Dashboard"
          component={DeliveryAgentDashboard}
          options={{
            drawerIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "bicycle" : "bicycle-outline"}
                size={22}
                color={color}
              />
            ),
          }}
        />
      )}
    </Drawer.Navigator>
  );
};

export default AppStack;
