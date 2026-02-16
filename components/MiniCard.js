import { StyleSheet, Text, View } from "react-native";

export default function MiniCard({ title, value, children }) {
  const isOnline = value === "Online";

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      {isOnline ? (
        <View style={styles.onlineBadge}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>Online</Text>
        </View>
      ) : (
        <Text style={styles.value}>{value}</Text>
      )}

      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#0B1220",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  title: {
    fontSize: 14,
    color: "#8FA2C9",
    marginBottom: 6,
  },

  value: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  /* ===== Online badge ===== */

  onlineBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(46, 204, 113, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },

  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2ECC71",
    marginRight: 6,
  },

  onlineText: {
    color: "#2ECC71",
    fontWeight: "700",
    fontSize: 14,
  },
});
