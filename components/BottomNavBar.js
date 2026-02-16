import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function BottomNavBar({ active, navigation }) {
  const tabs = [
    { key: "Dashboard", icon: "speedometer", screen: "Dashboard" },
    // { key: "Eco", icon: "leaf", screen: "DrivingMode" },
    { key: "Map", icon: "map", screen: "GPS" },
    { key: "Alerts", icon: "alert-circle", screen: "Alerts" },
    { key: "More", icon: "menu", screen: "Profile" },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((t) => {
        const isActive = active === t.key;

        return (
          <TouchableOpacity
            key={t.key}
            style={styles.item}
            onPress={() => navigation.navigate(t.screen)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={t.icon}
              size={22}
              color={isActive ? "#35E1A1" : "#6C7A99"} // 🌿 Eco ใช้เขียว
            />
            <Text style={[styles.label, isActive && styles.active]}>
              {t.key}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#0E1627",
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 14,
  },
  item: {
    alignItems: "center",
    minWidth: 60,
  },
  label: {
    color: "#6C7A99",
    fontSize: 12,
    marginTop: 4,
  },
  active: {
    color: "#4DB6FF",
    fontWeight: "600",
  },
});
