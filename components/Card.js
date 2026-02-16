import { StyleSheet, View } from "react-native";

export default function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0E1627",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 16,
  },
});
