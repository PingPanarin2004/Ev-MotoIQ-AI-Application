import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import BottomNavBar from "../components/BottomNavBar";
import Card from "../components/Card";
import HeaderBar from "../components/HeaderBar";
import { styles as myStyle } from "../styles/myStyle";

import { getCloudAlerts } from "../services/firebase-service";

/* ===== Mock Data ===== */
//ส่วนนี้ใช้ Mock ไปก่อนสำหรับการแสดงผล Real-time sensor
const STATUS_LIST = [
  {
    id: "motor",
    title: "Motor Temperature",
    value: "ปกติ • 54°C",
    status: "OK",
    color: "#35E1A1",
  },
  {
    id: "battery",
    title: "Battery Voltage",
    value: "ใกล้ต่ำ • 48.2V",
    status: "WARNING",
    color: "#F5C76A",
  },
  {
    id: "current",
    title: "Current Draw",
    value: "สูงผิดปกติ • 92A",
    status: "CRITICAL",
    color: "#FF6B6B",
  },
  {
    id: "gps",
    title: "GPS Status",
    value: "Fix • tracking enabled",
    status: "OK",
    color: "#35E1A1",
  },
];

// ฟังก์ชันช่วยแปลงวันที่จาก Firebase Timestamp
const formatDate = (timestamp) => {
  if (!timestamp) return "";
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toLocaleString("th-TH", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return new Date(timestamp).toLocaleString();
};

export default function HealthAndAlerts({ navigation }) {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const data = await getCloudAlerts();
      setAlerts(data);
    } catch (error) {
      console.log("Fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };
  return (
    <View style={myStyle.container}>
      <HeaderBar
        title="Health & Alerts"
        subtitle="Intelligent warning • vehicle health status"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#35E1A1"
          />
        }
      >
        {/* ===== Status List ===== */}
        <Card>
          <View style={local.sectionHeader}>
            <Text style={local.sectionTitle}>Status List</Text>
            <Text style={local.sectionSub}>real-time</Text>
          </View>

          {STATUS_LIST.map((item) => (
            <View
              key={item.id}
              style={[local.statusCard, { borderColor: item.color }]}
            >
              <View style={local.statusLeft}>
                <View style={[local.dot, { backgroundColor: item.color }]} />
                <View>
                  <Text style={local.statusTitle}>{item.title}</Text>
                  <Text style={local.statusValue}>{item.value}</Text>
                </View>
              </View>
              <Text style={[local.statusBadge, { color: item.color }]}>
                {item.status}
              </Text>
            </View>
          ))}
        </Card>

        {/* ===== Alert Log (Real Data) ===== */}
        <Card>
          <View style={local.sectionHeader}>
            <Text style={local.sectionTitle}>Alert Log</Text>
            <Text style={local.sectionSub}>Cloud History</Text>
          </View>

          {loading && !refreshing ? (
            <ActivityIndicator
              size="small"
              color="#35E1A1"
              style={{ marginVertical: 20 }}
            />
          ) : alerts.length === 0 ? (
            <Text
              style={{
                color: "#7C8DB5",
                textAlign: "center",
                marginVertical: 20,
              }}
            >
              No alerts history found.
            </Text>
          ) : (
            alerts.map((item, index) => {
              let badgeColor = "#7C8DB5"; // INFO (สีเทา)
              if (item.severity_level === "WARNING") badgeColor = "#F5C76A"; // สีเหลือง
              if (item.severity_level === "CRITICAL") badgeColor = "#FF6B6B"; // สีแดง

              return (
                <View
                  key={item.id || index}
                  style={[local.alertItem, { borderColor: badgeColor }]}
                >
                  <View
                    style={[
                      local.alertBadge,
                      { backgroundColor: badgeColor + "20" },
                    ]}
                  >
                    <Text style={[local.alertLevel, { color: badgeColor }]}>
                      {item.severity_level || "INFO"}
                    </Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={local.alertTitle}>
                      {item.alert_event || "System Alert"}
                    </Text>
                    <Text style={local.alertDesc}>{item.detail || "-"}</Text>
                  </View>
                </View>
              );
            })
          )}
        </Card>
      </ScrollView>

      <BottomNavBar active="Alerts" navigation={navigation} />
    </View>
  );
}

/* ===== Local Styles (เฉพาะหน้านี้) ===== */
const local = StyleSheet.create({
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  sectionSub: {
    color: "#7C8DB5",
    fontSize: 12,
  },

  /* Status */
  statusItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1E2A44",
  },
  statusLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusTitle: {
    color: "#EAF0FF",
    fontWeight: "600",
  },
  statusValue: {
    color: "#7C8DB5",
    fontSize: 12,
    marginTop: 2,
  },
  statusBadge: {
    fontWeight: "800",
    fontSize: 12,
  },

  /* Alert */
  alertItem: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: "#10182A",
  },
  alertBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  alertLevel: {
    fontWeight: "800",
    fontSize: 12,
  },
  alertTitle: {
    color: "#EAF0FF",
    fontWeight: "600",
  },
  alertDesc: {
    color: "#7C8DB5",
    fontSize: 12,
    marginTop: 2,
  },

  statusCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: "#10182A",
    marginBottom: 12,
  },
});
