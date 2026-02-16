import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../styles/myStyle";

import BottomNavBar from "../components/BottomNavBar";
import Card from "../components/Card";
import CircleGauge from "../components/CircleGauge";
import HeaderBar from "../components/HeaderBar";
import MiniCard from "../components/MiniCard";

import { getLocalUser } from "../services/sqlite-service";

export default function SmartDashboard({ navigation }) {
  const [user, setUser] = useState(null);
  const [speed, setSpeed] = useState(0);
  const [battery, setBattery] = useState(78);
  const [distance, setDistance] = useState(45);
  const [online, setOnline] = useState(true);

  // ดึงชื่อผู้ใช้จาก SQLite
  useFocusEffect(
    useCallback(() => {
      const userData = getLocalUser();
      if (userData) setUser(userData);
    }, []),
  );

  // จำลองการทำงาน
  useEffect(() => {
    const interval = setInterval(() => {
      setSpeed((prev) => {
        const next = prev + (Math.random() * 8 - 3);
        return Math.max(0, Math.min(100, Math.floor(next)));
      });
      setBattery((prev) => Math.max(0, prev - 0.02));

      // AI DTE Logic
      setDistance(Math.floor(battery * 0.6));
    }, 100);
    return () => clearInterval(interval);
  }, [battery]);

  return (
    <View style={styles.container}>
      {/* ===== HEADER ===== */}
      <HeaderBar
        title="Smart Dashboard"
        subtitle={
          user ? `Rider: ${user.fullname.split(" ")[0]}` : "Real-time • AI DTE"
        }
        showNotification
        notificationCount={2}
      />

      {/* ===== CONTENT ===== */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 160, // กันชน BottomNavBar
        }}
      >
        {/* ===== SPEED CARD ===== */}
        <Card>
          <CircleGauge
            value={speed}
            unit="km/h"
            label="Speedometer (digital)"
          />

          <View style={styles.row}>
            <MiniCard title="Battery" value={`${Math.floor(battery)}%`} />
            <MiniCard
              title="Connection"
              value={online ? "Online" : "Offline"}
              status={online ? "success" : "danger"}
            />
          </View>
        </Card>

        {/* ===== DTE ===== */}
        <Card>
          <Text style={styles.sectionTitle}>AI DTE (Distance-to-Empty)</Text>

          <Text style={styles.bigText}>วิ่งได้อีก {distance} กม.</Text>

          <Text style={styles.desc}>
            Estimated by AI from battery + speed + driving behavior
          </Text>
        </Card>

        {/* ===== COLOR INFO ===== */}
        <Card>
          <Text style={styles.info}>
            Color cue:{" "}
            <Text style={{ color: "#4DB6FF", fontWeight: "600" }}>Blue</Text> =
            Normal •{" "}
            <Text style={{ color: "#FF9F0A", fontWeight: "600" }}>Orange</Text>{" "}
            = Low battery warning
          </Text>
        </Card>

        {/* ===== ECO BUTTON (ใต้ Color cue) ===== */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={local.ecoButton}
          onPress={() => navigation.navigate("DrivingMode")}
        >
          <Ionicons name="leaf" size={26} color="#05160F" />
          <Text style={local.ecoText}>Eco Mode</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ===== BOTTOM NAV ===== */}
      <BottomNavBar active="Dashboard" navigation={navigation} />
    </View>
  );
}

/* ===== LOCAL STYLES ===== */
const local = StyleSheet.create({
  ecoButton: {
    alignSelf: "center",
    marginTop: 24,
    width: 150,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#35E1A1",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,

    shadowColor: "#35E1A1",
    shadowOpacity: 0.6,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  ecoText: {
    color: "#05160F",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
