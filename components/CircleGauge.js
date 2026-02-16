import { StyleSheet, Text, View } from "react-native";

export default function CircleGauge({ value, unit, label }) {
  return (
    <View style={styles.circle}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.unit}>{unit}</Text>
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    alignItems: "center",
    marginBottom: 20,
  },
  value: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "700",
  },
  unit: {
    color: "#9AA4BF",
  },
  label: {
    color: "#9AA4BF",
    marginTop: 8,
  },
});
