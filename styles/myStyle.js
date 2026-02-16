import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  /* ================= BASE ================= */
  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
  },

  content: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },

  card: {
    backgroundColor: "#10182A",
    borderRadius: 28,
    padding: 24,
    marginBottom: 20,
  },

  row: {
    flexDirection: "row",
    gap: 14,
    marginTop: 20,
  },

  /* ================= HEADER ================= */
  textheader: {
    position: "absolute",
    top: 80,
    alignSelf: "center",
    fontSize: 36,
    fontWeight: "bold",
    color: "#FFFFFF",
  },

  subtitle: {
    alignSelf: "center",
    marginTop: 130,
    fontSize: 14,
    color: "#9AA4BF",
  },

  /* ================= SECTION ================= */
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 10,
  },

  bigText: {
    fontSize: 38,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 6,
  },

  desc: {
    fontSize: 14,
    color: "#9AA4BF",
    lineHeight: 20,
  },

  info: {
    fontSize: 14,
    color: "#9AA4BF",
    lineHeight: 20,
  },

  /* ================= INPUT (เดิม) ================= */
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 40,
    width: 300,
    height: 48,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#1B263B",
  },

  inputContainer2: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
    width: 300,
    height: 48,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#1B263B",
  },

  iconBox: {
    backgroundColor: "#26344F",
    width: 48,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  textInput: {
    flex: 1,
    paddingLeft: 12,
    height: "100%",
    color: "#FFFFFF",
    backgroundColor: "#1B263B",
  },

  eyeIcon: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1B263B",
    height: "100%",
  },

  /* ================= BUTTON ================= */
  buttonPrimary: {
    alignSelf: "center",
    marginTop: 30,
    width: 300,
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: "#35E1A1",
    alignItems: "center",
  },

  buttonPrimaryText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0B1220",
  },

  buttonSecondary: {
    alignSelf: "center",
    marginTop: 16,
    width: 300,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#35E1A1",
    alignItems: "center",
  },

  buttonSecondaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#35E1A1",
  },
});
