import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const BASE_URL = "http://192.168.128.8:8000:8000";

// const BASE_URL = "http://192.168.0.119:8000";

// const BASE_URL = "http://202.144.153.106:8000";


const QRCodeGenerator = () => {
  const [checkInQR, setCheckInQR] = useState(null);
  const [checkOutQR, setCheckOutQR] = useState(null);
  const [error, setError] = useState(null);
  const [showCheckInButton, setShowCheckInButton] = useState(true);
  const [labelText, setLabelText] = useState("Scan Me");

  const generateQR = async (action) => {
    try {
      const response = await fetch(`${BASE_URL}/api/qr-codes/${action}`);
      if (response.ok) {
        const data = await response.json();
        if (action === "check-in") {
          setCheckInQR(data.check_in_qr_url);
          setCheckOutQR(null);
          setShowCheckInButton(false);
          setLabelText("Check-In Code"); // Change label text to "Check-In"
        } else if (action === "check-out") {
          setCheckOutQR(data.check_out_qr_url);
          setCheckInQR(null);
          setShowCheckInButton(true);
          setLabelText("Check-Out Code"); // Change label text to "Check-Out"
        }
        setError(null);
      } else {
        setError(`Error fetching ${action} QR code`);
      }
    } catch (error) {
      setError(`Error fetching ${action} QR code: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      {showCheckInButton && (
        <TouchableOpacity
          onPress={() => generateQR("check-in")}
          style={[styles.button, styles.topRightButton]}
        >
          <Text style={styles.buttonText}>Generate Check-In QR Code</Text>
        </TouchableOpacity>
      )}

      {!showCheckInButton && (
        <TouchableOpacity
          onPress={() => generateQR("check-out")}
          style={[styles.button, styles.topRightButton]}
        >
          <Text style={styles.buttonText}>Generate Check-Out QR Code</Text>
        </TouchableOpacity>
      )}

      {(checkInQR || checkOutQR) && (
        <View style={styles.qrContainer}>
          <Image source={{ uri: checkInQR || checkOutQR }} style={styles.qrCode} />
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>{labelText}</Text>
          </View>
        </View>
      )}

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    top: 20,
    right: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  topRightButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    top: 20,
    right: 20,
  },
  qrContainer: {
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "orange",
    padding: 20,
    borderRadius: 10,
  },
  qrCode: {
    width: 200,
    height: 200,
  },
  labelContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  labelText: {
    color: "blue",
    fontSize: 20,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 10,
  },
});

export default QRCodeGenerator;