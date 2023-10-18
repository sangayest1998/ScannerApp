import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const ForgotPasswordScreen = () => {
  const [cid, setCid] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State to control loading indicator
  const navigation = useNavigation();
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleCIDSubmit = async () => {
    try {
      setIsLoading(true); // Show loading indicator while sending the request

      // Replace with your API endpoint
      const response = await fetch(
        "http://192.168.128.8:8000/forgot-password",
        {
          // const response = await fetch('http://192.168.128.8:8000/forgot-password', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cid: parseInt(cid) }),
        }
      );

      if (response.ok) {
        setSuccessMessage("Password reset email sent successfully.");
        // Request was successful, navigate to the OTP screen
        navigation.navigate("otp", { cid: cid });
      } else {
        setErrorMessage("Failed to send CID for password reset.");
        // Log the response status and error message
        console.error(
          "Failed to send CID for password reset. Response status:",
          response.status
        );
        const errorData = await response.json();
        console.error("Error Details:", errorData);
      }
    } catch (error) {
      setErrorMessage("An error occurred while sending the request.");
      console.error("An error occurred while sending the request:", error);
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.squareBox} />
      {/* Image container */}
      <View style={styles.imageContainer}>
        <Image source={require("../assets/logo.png")} style={styles.image} />
      </View>

      {/* Title */}
      <Text style={styles.title}>Forgot Password?</Text>

      {/* Input for CID */}
      <TextInput
        style={styles.input}
        placeholder="Enter your CID"
        value={cid}
        onChangeText={(text) => setCid(text)} // Update the state when text is entered
        editable={!isLoading} // Disable input while loading
      />

      {/* Success message */}
      {successMessage && (
        <Text style={styles.successMessage}>{successMessage}</Text>
      )}

      {/* Error message */}
      {errorMessage && <Text style={styles.errorMessage}>{errorMessage}</Text>}

      {/* Submit button with loading indicator */}
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={isLoading ? null : handleCIDSubmit}
        disabled={isLoading}
      >
        <View
          style={{
            backgroundColor: isLoading ? "#ccc" : "orange",
            padding: 8,
            borderRadius: 100,
            width: 300,
            marginTop: 30,
            marginBottom: -30,
          }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="orange" />
          ) : (
            <Text style={{ color: "white", textAlign: "center", fontSize: 20 }}>
              Submit
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Conditional rendering of squareBox1 based on input focus state */}
      {!isKeyboardVisible && <View style={styles.squareBox1} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: StatusBar.currentHeight,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: "orange",
  },
  input: {
    width: 300,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  successMessage: {
    color: "green",
    marginTop: 10,
  },
  errorMessage: {
    color: "red",
    marginTop: 15,
  },
  squareBox: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 100,
    backgroundColor: "orange",
    borderBottomEndRadius: 300,
  },
  squareBox1: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: 100,
    backgroundColor: "orange",
    borderTopStartRadius: 400,
  },
});

export default ForgotPasswordScreen;
