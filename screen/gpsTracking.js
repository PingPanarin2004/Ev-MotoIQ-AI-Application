import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

import BottomNavBar from "../components/BottomNavBar";
import Card from "../components/Card";
import HeaderBar from "../components/HeaderBar";
import MiniCard from "../components/MiniCard";

import { addCloudTrip } from "../services/firebase-service";
import { getLocalUser } from "../services/sqlite-service";

/* ================= UTILS ================= */
const toRad = (v) => (v * Math.PI) / 180;

const calcDistance = (a, b) => {
  const R = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)));
};

/* ================= MAP STYLE ================= */
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#0B1220" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8FA2C9" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#0B1220" }] },
];

/* ================= SCREEN ================= */
export default function GPSTracking({ navigation }) {
  const mapRef = useRef(null);

  const [location, setLocation] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [route, setRoute] = useState([]);
  const [distance, setDistance] = useState(0);
  const [history, setHistory] = useState([]);

  const [expandedTripId, setExpandedTripId] = useState(null);

  const [startTime, setStartTime] = useState(null);

  /* ================= PERMISSION ================= */
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();

    loadHistory();
  }, []);

  /* ================= TRACKING ================= */
  useEffect(() => {
    let subscription;

    if (tracking) {
      setStartTime(new Date());
      subscription = Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
          timeInterval: 3000,
        },
        (loc) => {
          const point = {
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          };

          setRoute((prev) => {
            if (prev.length > 0) {
              setDistance(
                (d) => d + calcDistance(prev[prev.length - 1], point),
              );
            }
            return [...prev, point];
          });

          setLocation(loc.coords);
        },
      );
    }

    return () => subscription && subscription.then((s) => s.remove());
  }, [tracking]);

  /* ================= STORAGE ================= */
  const loadHistory = async () => {
    const data = await AsyncStorage.getItem("tripHistory");
    if (data) setHistory(JSON.parse(data));
  };

  const saveTrip = async () => {
    if (route.length < 2) {
      setTracking(false);
      setRoute([]);
      return;
    }
    const endTime = new Date();
    const tripId = Date.now().toString();

    const trip = {
      id: tripId,
      date: endTime.toLocaleString(),
      distance: distance.toFixed(2),
      route,
      start_time: startTime ? startTime.toISOString() : null,
      end_time: endTime.toISOString(),
    };

    const updated = [trip, ...history];
    setHistory(updated);
    await AsyncStorage.setItem("tripHistory", JSON.stringify(updated));

    // ส่งข้อมูลสรุปขึ้น Firebase
    const user = getLocalUser();
    if (user) {
      await addCloudTrip({
        student_id: user.student_id,
        vehicle_id: "EV-01",
        start_time: trip.start_time,
        end_time: trip.end_time,
        distance_km: parseFloat(trip.distance),
        route_points: route.length,
      });
    }

    Alert.alert("Saved & Synced", "Trip saved locally and synced to cloud.");

    setTracking(false);
    setRoute([]);
    setDistance(0);
  };

  if (!location) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>Loading GPS...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderBar
        title="GPS Tracking"
        subtitle="My bike location • Route history"
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* MAP */}
        <MapView
          ref={mapRef}
          style={styles.map}
          customMapStyle={darkMapStyle}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={location} />
          {route.length > 1 && (
            <Polyline
              coordinates={route}
              strokeColor="#35E1A1"
              strokeWidth={4}
            />
          )}
        </MapView>

        {/* INFO */}
        <View style={styles.infoRow}>
          <MiniCard title="GPS Status" value="Online" />
          <MiniCard title="Distance" value={`${distance.toFixed(2)} km`} />
        </View>

        {/* CONTROL */}
        <Card style={{ marginHorizontal: 16, marginTop: 20 }}>
          <TouchableOpacity
            style={[
              styles.btn,
              { backgroundColor: tracking ? "#FF3B30" : "#35E1A1" },
            ]}
            onPress={() => (tracking ? saveTrip() : setTracking(true))}
          >
            <Text style={styles.btnText}>
              {tracking ? "Stop & Save Trip" : "Start Tracking"}
            </Text>
          </TouchableOpacity>
        </Card>

        {/* HISTORY */}
        <Card style={{ marginHorizontal: 16 }}>
          <Text style={styles.sectionTitle}>Trip History</Text>

          {history.map((trip) => {
            const expanded = expandedTripId === trip.id;
            const start = trip.route[0];
            const end = trip.route[trip.route.length - 1];

            return (
              <View key={trip.id} style={{ marginBottom: 12 }}>
                <TouchableOpacity
                  onPress={() => setExpandedTripId(expanded ? null : trip.id)}
                >
                  <View style={styles.tripCard}>
                    <View>
                      <Text style={styles.tripDate}>{trip.date}</Text>
                      <Text style={styles.tripSub}>
                        {expanded ? "Tap to close" : "Tap to view detail"}
                      </Text>
                    </View>
                    <Text style={styles.tripKm}>{trip.distance} km</Text>
                  </View>
                </TouchableOpacity>

                {expanded && (
                  <View style={styles.tripDetail}>
                    <MapView
                      style={styles.tripMap}
                      customMapStyle={darkMapStyle}
                      initialRegion={{
                        latitude: start.latitude,
                        longitude: start.longitude,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02,
                      }}
                      pointerEvents="none"
                    >
                      <Marker coordinate={start} pinColor="green" />
                      <Marker coordinate={end} pinColor="red" />
                      <Polyline
                        coordinates={trip.route}
                        strokeColor="#35E1A1"
                        strokeWidth={3}
                      />
                    </MapView>

                    <View style={styles.tripSummary}>
                      <Text style={styles.summaryText}>
                        Distance: {trip.distance} km
                      </Text>
                      <Text style={styles.summaryText}>
                        Route Points: {trip.route.length}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </Card>
      </ScrollView>

      <BottomNavBar active="Map" navigation={navigation} />
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0F1A" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  map: { height: 320, margin: 16, borderRadius: 20 },
  infoRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 12,
  },

  btn: {
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: { color: "#000", fontSize: 16, fontWeight: "700" },

  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },

  tripCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#10182A",
  },
  tripDate: { color: "#EAF0FF", fontWeight: "600" },
  tripSub: { color: "#8A94B8", fontSize: 12, marginTop: 4 },
  tripKm: { color: "#35E1A1", fontWeight: "700", fontSize: 16 },

  tripDetail: {
    marginTop: 10,
    backgroundColor: "#0E1627",
    borderRadius: 18,
    overflow: "hidden",
  },
  tripMap: { height: 160, width: "100%" },
  tripSummary: { padding: 12 },
  summaryText: { color: "#8A94B8", fontSize: 13 },
});
