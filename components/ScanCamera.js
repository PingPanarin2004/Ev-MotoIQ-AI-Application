import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CameraView } from "expo-camera";

export default function ScanCamera({
  onCancel,
  onScanned,
  scanned,
}) {
  return (
    <View style={styles.scanContainer}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "code128", "code39", "ean13"],
        }}
        onBarcodeScanned={scanned ? undefined : onScanned}
      />

      <View style={styles.scanOverlay}>
        <Text style={styles.scanTitle}>Scan Student ID</Text>

        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scanContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  scanOverlay: {
    position: "absolute",
    bottom: 60,
    alignSelf: "center",
    alignItems: "center",
  },
  scanTitle: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 16,
  },
  cancelButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#1F2A44",
  },
  cancelText: {
    color: "#fff",
    fontSize: 16,
  },
});