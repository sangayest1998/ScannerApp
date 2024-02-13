import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { MaterialCommunityIcons } from '@expo/vector-icons';


const getTokenFromStorage = async () => {
  try {
    const token = await AsyncStorage.getItem("access_token");
    return token;
  } catch (error) {
    console.error("Error retrieving token from AsyncStorage: ", error);
  }
};

const BASE_URL = "https://attendance.desuung.org.bt";

const QRCodeGenerator = () => {
  const [checkInQR, setCheckInQR] = useState(null);
  const [checkOutQR, setCheckOutQR] = useState(null);
  const [error, setError] = useState(null);
  const [showCheckInButton, setShowCheckInButton] = useState(true);
  const [labelText, setLabelText] = useState("Scan Me");

  const generateQR = async (action) => {
    try {
      const token = await getTokenFromStorage();
      if (token) {
        console.log(`Fetching ${action} QR code...`);
        
        try {
          const response = await axios.get(`${BASE_URL}/api/qr-codes/${action}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          console.log("Response data:", response.data);
          
          if (response.status === 200) {
            console.log(`${action} QR code fetched successfully.`);
            if (action === "check-in") {
              setCheckInQR(response.data.check_in_qr_url);
              setCheckOutQR(null);
              setShowCheckInButton(false);
              setLabelText("Check-In Code");
            } else if (action === "check-out") {
              setCheckOutQR(response.data.check_out_qr_url);
              setCheckInQR(null);
              setShowCheckInButton(true);
              setLabelText("Check-Out Code");
            }
            setError(null);
          } else {
            console.log(`Error fetching ${action} QR code`);
            setError(`Error fetching ${action} QR code`);
          }
        } catch (error) {
          console.error(`Error fetching ${action} QR code: ${error.message}`);
          setError(`Error fetching ${action} QR code: ${error.message}`);
        }
      } else {
        console.error("Token is not available.");
        setError("Token is not available.");
      }
    } catch (error) {
      console.error(`Error retrieving token: ${error}`);
      setError("Error retrieving token.");
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
          <View style={styles.iconContainer}>
            {showCheckInButton ? (
              <MaterialCommunityIcons name="close" size={50} color="red" />
            ) : (
             
              <MaterialCommunityIcons name="check" size={50} color="green" />
            )}
          </View>
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
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
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    top: 20,
    right: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: 'bold',
  },
  topRightButton: {
    backgroundColor: "orange",
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    top: 100,
    right: 100,
    transform: [{ translateX: 50 }, { translateY: -50 }],
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
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  labelText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginTop: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
});

export default QRCodeGenerator;
