import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";

import DrivingMode from "./screen/drivingMode";
import GpsTracking from "./screen/gpsTracking";
import HealthAndAlerts from "./screen/healthAndAlerts";
import Login from "./screen/login";
import ProfileAndPrivacy from "./screen/profileAndPrivacy";
import SmartDashboard from "./screen/smartDashboard";

import { useEffect } from "react";
import { initDB } from "./services/sqlite-service";

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    console.log("Start App");
    initDB();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Dashboard" component={SmartDashboard} />
        <Stack.Screen name="DrivingMode" component={DrivingMode} />
        <Stack.Screen name="Alerts" component={HealthAndAlerts} />
        <Stack.Screen name="GPS" component={GpsTracking} />
        <Stack.Screen name="Profile" component={ProfileAndPrivacy} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
