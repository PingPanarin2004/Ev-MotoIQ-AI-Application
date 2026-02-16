import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { styles as myStyle } from "../styles/myStyle";

import BottomNavBar from "../components/BottomNavBar";
import HeaderBar from "../components/HeaderBar";

import { addCloudDrivingLog } from "../services/firebase-service";
import { getLocalUser } from "../services/sqlite-service";

/* ===== MODE THEME ===== */
const MODE_THEME = {
  ECO: {
    color: "#35E1A1",
    title: "ECO",
    desc: "Eco Mode • ประหยัดพลังงาน • จำกัดความเร็ว • เน้น DTE",
  },
  MANUAL: {
    color: "#FF3B30",
    title: "MANUAL",
    desc: "Manual Mode • ควบคุมเอง • ตอบสนองตรงมือ",
  },
};

export default function DrivingMode({ navigation }) {
  const [mode, setMode] = useState("ECO");
  const [holding, setHolding] = useState(false);
  const holdTimer = useRef(null);

  /* ===== ANIMATED VALUES ===== */
  const breathe = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0)).current;

  const theme = MODE_THEME[mode];

  /* ===== IDLE BREATHING ===== */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  /* ===== HOLD LOGIC ===== */
  const handlePressIn = () => {
    setHolding(true);

    Animated.parallel([
      Animated.spring(pressScale, {
        toValue: 0.92,
        useNativeDriver: true,
      }),
      Animated.timing(glow, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    holdTimer.current = setTimeout(() => {
      switchMode();
    }, 1000);
  };

  const handlePressOut = () => {
    setHolding(false);

    Animated.parallel([
      Animated.spring(pressScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(glow, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };

  /* ===== SWITCH MODE FEEDBACK ===== */
  const switchMode = async () => {
    Animated.sequence([
      Animated.spring(pressScale, {
        toValue: 1.1,
        useNativeDriver: true,
      }),
      Animated.spring(pressScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    const previousMode = mode;
    const newMode = mode === "ECO" ? "MANUAL" : "ECO";

    setMode(newMode);
    setHolding(false);

    // Log การเปลี่ยนโหมด
    try {
      const user = getLocalUser();
      await addCloudDrivingLog({
        student_id: user?.student_id || "guest",
        mode_from: previousMode,
        mode_to: newMode,
      });
      console.log(`[Mode Switched] ${previousMode} -> ${newMode}`);
    } catch (error) {
      console.error("Failed to log mode switch:", error);
    }
  };

  /* ===== DERIVED STYLES ===== */
  const ringScale = breathe.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.03],
  });

  const glowOpacity = glow.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  return (
    <View style={myStyle.container}>
      <HeaderBar title="Driving Mode" subtitle="Hold to switch mode" />

      {/* ===== SWITCH BUTTON ===== */}
      <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View
          style={[
            local.glow,
            {
              shadowColor: theme.color,
              shadowOpacity: glowOpacity,
              transform: [{ scale: ringScale }],
            },
          ]}
        >
          <Animated.View
            style={[
              local.ring,
              {
                borderColor: theme.color,
                transform: [{ scale: pressScale }],
              },
            ]}
          >
            <Image
              source={require("../assets/Eco.png")}
              style={[local.icon, { tintColor: theme.color }]}
              resizeMode="contain"
            />
          </Animated.View>

          <Text style={local.tapText}>
            {holding ? "HOLDING..." : "TAP TO SWITCH"}
          </Text>
        </Animated.View>
      </Pressable>

      {/* ===== MODE INFO ===== */}
      <View style={local.infoWrap}>
        <Text style={local.modeTitle}>
          โหมดปัจจุบัน: {theme.title === "ECO" ? "ประหยัดพลังงาน" : "ควบคุมเอง"}
        </Text>
        <Text style={local.modeDesc}>{theme.desc}</Text>
      </View>

      <BottomNavBar active="Eco" navigation={navigation} />
    </View>
  );
}

/* ===== STYLES ===== */
const local = StyleSheet.create({
  glow: {
    alignSelf: "center",
    marginTop: 40,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 40,
  },
  ring: {
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B0F1A",
  },
  icon: {
    width: 140,
    height: 140,
    opacity: 0.95,
  },
  tapText: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    color: "#E6ECFF",
    fontWeight: "600",
    letterSpacing: 1,
  },
  infoWrap: {
    marginTop: 40,
    alignItems: "center",
  },
  modeTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  modeDesc: {
    marginTop: 8,
    color: "#8A94B8",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 24,
  },
});
