import { Ionicons } from "@expo/vector-icons";
import { useCameraPermissions } from "expo-camera";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import ScanCamera from "../components/ScanCamera";
import { styles as myStyle } from "../styles/myStyle";

import { checkStudentOnFirebase } from "../services/firebase-service";
import { getLocalUser, saveLocalUser } from "../services/sqlite-service";

export default function Login({ navigation }) {
  const [mode, setMode] = useState("login");
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();

  // ตรวจสอบว่าเคยล็อกอินค้างไว้ไหม
  useEffect(() => {
    const existingUser = getLocalUser();
    if (existingUser) {
      console.log("Auto-Login Active for:", existingUser.fullname);
      // ถ้ามีข้อมูลอยู่แล้ว ให้ข้ามไป Dashboard เลย
      navigation.replace("Dashboard");
    }
  }, []);

  useEffect(() => {
    if (mode === "scan" && permission?.granted === false) {
      requestPermission();
    }
  }, [mode, permission]);

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned) return;

    setScanned(true);
    setLoading(true);
    console.log("Student ID:", data);

    const userData = await checkStudentOnFirebase(data);

    if (userData) {
      const userToSave = {
        student_id: userData.student_id,
        fullname: userData.fullname,
        emergency_phone: userData.emergency_phone || "",
        profile_image_uri: userData.profile_image_uri || null,
        firebase_id: userData.firebase_id,
      };

      // บันทึกลงเครื่อง SQLite
      const success = saveLocalUser(userToSave);

      if (success) {
        setLoading(false);
        Alert.alert("Authorized", `Welcome, ${userToSave.fullname}`, [
          {
            text: "Start Engine",
            onPress: () => navigation.replace("Dashboard"),
          },
        ]);
      } else {
        setLoading(false);
        Alert.alert("Error", "Failed to save user data locally.");
        setScanned(false);
      }
    } else {
      setLoading(false);
      Alert.alert("Access Denied ", "Student ID not found in database.", [
        {
          text: "Try Again",
          onPress: () => {
            setScanned(false);
            setMode("login");
          },
        },
      ]);
    }
  };

  // ================= SCAN MODE =================
  if (mode === "scan") {
    if (!permission) {
      return (
        <View style={loginStyles.permissionBox}>
          <Text style={loginStyles.permissionText}>
            Loading camera permission...
          </Text>
        </View>
      );
    }

    if (!permission.granted) {
      return (
        <View style={loginStyles.permissionBox}>
          <Text style={loginStyles.permissionText}>
            Camera permission is required
          </Text>

          <TouchableOpacity
            style={loginStyles.permissionBtn}
            onPress={requestPermission}
          >
            <Text style={loginStyles.permissionBtnText}>Grant Permission</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={loginStyles.permissionCancel}
            onPress={() => {
              setScanned(false);
              setMode("login");
            }}
          >
            <Text style={{ color: "#fff" }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <ScanCamera
          scanned={scanned}
          onScanned={handleBarCodeScanned}
          onCancel={() => {
            setScanned(false);
            setMode("login");
          }}
        />

        {loading && (
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.6)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size="large" color="#35E1A1" />
            <Text
              style={{
                color: "white",
                marginTop: 15,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Verifying Access...
            </Text>
          </View>
        )}
      </View>
    );
  }

  // ================= LOGIN MODE =================
  return (
    <ScrollView
      style={myStyle.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* LOGO */}
      <View style={loginStyles.logoContainer}>
        <Text style={loginStyles.logoText}>WISHU</Text>
        <Text style={loginStyles.logoSub}>EV-MotoIQ • Digital Key</Text>
      </View>

      {/* MAIN CARD */}
      <View style={loginStyles.mainCard}>
        <View style={loginStyles.cameraIcon}>
          <Ionicons name="camera" size={34} color="#35E1A1" />
        </View>

        <TouchableOpacity
          style={myStyle.buttonPrimary}
          onPress={() => {
            setScanned(false);
            setMode("scan");
          }}
        >
          <Text style={myStyle.buttonPrimaryText}>
            Scan Student ID to Start
          </Text>
        </TouchableOpacity>

        <Text style={loginStyles.descText}>
          Tap to open camera and scan your student barcode
        </Text>
        <Text style={loginStyles.descSub}>
          If authorized → unlock bike → go to Dashboard
        </Text>
      </View>

      {/* HOW IT WORKS */}
      <View style={loginStyles.howCard}>
        <Text style={loginStyles.howTitle}>How it works</Text>

        <View style={loginStyles.stepItem}>
          <Text style={loginStyles.stepText}>1) Scan Student ID</Text>
        </View>

        <View style={loginStyles.stepItem}>
          <Text style={loginStyles.stepText}>2) Verify access (database)</Text>
        </View>

        <View style={loginStyles.stepItem}>
          <Text style={loginStyles.stepText}>
            3) Unlock / Start → Dashboard
          </Text>
        </View>
      </View>

      <Text style={[loginStyles.footerNote, { marginTop: 20 }]}>
        Note: Scanner is on the bike — app shows status & logs for complete
        system.
      </Text>
    </ScrollView>
  );
}

/* ================= LOCAL STYLES ================= */
const loginStyles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginTop: 60,
  },
  logoText: {
    fontSize: 50,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  logoSub: {
    marginTop: 6,
    fontSize: 16,
    color: "#9AA4BF",
  },
  mainCard: {
    marginTop: 40,
    marginHorizontal: 20,
    backgroundColor: "#10182A",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  cameraIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#0B0F1A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  descText: {
    marginTop: 16,
    fontSize: 14,
    color: "#9AA4BF",
    textAlign: "center",
  },
  descSub: {
    marginTop: 6,
    fontSize: 13,
    color: "#6F7A99",
    textAlign: "center",
  },
  howCard: {
    marginTop: 30,
    marginHorizontal: 20,
    backgroundColor: "#10182A",
    borderRadius: 20,
    padding: 20,
  },
  howTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 14,
  },
  stepItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#0B0F1A",
    marginBottom: 10,
  },
  stepText: {
    color: "#D6DBF5",
    fontSize: 16,
  },
  footerNote: {
    fontSize: 14,
    color: "#6F7A99",
    textAlign: "center",
    paddingHorizontal: 30,
  },

  /* permission */
  permissionBox: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  permissionText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 16,
  },
  permissionBtn: {
    backgroundColor: "#35E1A1",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  permissionBtnText: {
    fontWeight: "600",
  },
  permissionCancel: {
    marginTop: 20,
  },
});
