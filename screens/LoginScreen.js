import { ToastAndroid } from "react-native";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";

const BASE_URL = "https://attendances.desuung.org.bt";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      let backPressCount = 0;

      const onBackPress = () => {
        // Handle the back press as needed
        backPressCount += 1;

        if (backPressCount >= 2) {
          // If back pressed twice, exit the app
          BackHandler.exitApp();
        } else {
          // Show a toast to inform the user
          ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);

          // Reset back press count after a delay (e.g., 2 seconds)
          setTimeout(() => {
            backPressCount = 2;
          }, 2000);
        }

        // Return true to disable the default back navigation
        return true;
      };

      // Add event listener for the hardware back press
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => {
        // Cleanup the event listener on component unmount
        backHandler.remove();
      };
    }, [])
  );

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

  const [CID, setCID] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const handleCIDChange = (text) => {
    const numericText = text.replace(/\D/g, "");
    // Limit the input to 11 digits
    if (numericText.length <= 11) {
      setCID(numericText);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (isLoading) {
      return;
    }

    const showAlert = (message) => {
      Alert.alert("Error", message, [{ text: "OK" }], { cancelable: true });
    };

    if (!CID && !password) {
      showAlert("Please fill in the required values");
      return;
    }

    if (!CID) {
      showAlert("Please enter your Identity Card Number.");
      return;
    }

    if (!password) {
      showAlert("Please enter your password.");
      return;
    }
    try {
      setIsLoading(true);
      Keyboard.dismiss();

      const data = new URLSearchParams();
      data.append("username", CID);
      data.append("password", password);

      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        body: data.toString(),
      });

      if (response.ok) {
        const responseData = await response.json();

        if (
          responseData.access_token &&
          responseData.session_token &&
          responseData.userRole !== null
        ) {
          console.log("Access Token:", responseData.access_token);
          console.log("Refresh Token:", responseData.session_token);
          console.log("User Role:", responseData.userRole);

          await AsyncStorage.setItem("access_token", responseData.access_token);
          await AsyncStorage.setItem(
            "refresh_token",
            responseData.session_token
          );
          await AsyncStorage.setItem("userRole", String(responseData.userRole));
          await AsyncStorage.setItem("userId", CID);

          setPassword('');

          if (responseData.redirect_url) {
            navigation.navigate("Tabs", { userRole: responseData.userRole });
          } else {
            navigation.navigate("Login");
          }

        } else {
          console.error("Invalid response data:", responseData);
          Alert.alert(
            "Error",
            "Access token, refresh token, or user role is missing or null in the response",
            [{ text: "OK" }],
            { cancelable: true }
          );
        }
      } else if (response.status === 401) {
        Alert.alert(
          "Error",
          "Invalid CID number or password",
          [{ text: "OK" }],
          { cancelable: true }
        );
      } else {
        Alert.alert(
          "Error",
          "An error occurred. Please try again.",
          [{ text: "OK" }],
          { cancelable: true }
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Error",
        "An error occurred. Please try again.",
        [{ text: "OK" }],
        { cancelable: true }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!isLoading) {
      navigation.navigate("Password");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -200}
      >
        <StatusBar style="auto" hidden={false} />
        <View style={styles.squareBox} />
        <View style={styles.logoContainer}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
        </View>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Identity Card Number"
            onChangeText={handleCIDChange}
            value={CID}
            keyboardType="numeric"
            editable={!isLoading}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            <TouchableOpacity
              onPress={togglePasswordVisibility}
              style={styles.eyeIcon}
            >
              <Text style={styles.eyeIconText}>
                {showPassword ? "👁" : "🔒"}
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleForgotPassword}
            style={[
              styles.forgotPassword,
              isLoading ? styles.disabledLink : null,
            ]}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#007BFF"
              style={styles.loader}
            />
          ) : (
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>
          )}
        </View>
        <View
          style={[
            styles.squareBox1,
            isKeyboardVisible ? { display: "none" } : null,
          ]}
        >
          <View style={styles.squareBox1} />
          <View style={styles.footer}>
            <Text style={styles.designDevelopText}>
              Welcome to{"\n"}
              <Text style={styles.designDevelopAuthor}>
                Desuung Attendance Scanner App
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  squareBox: {
    width: "100%",
    height: height * 0.12,
    backgroundColor: "orange",
    marginBottom: 60,
    borderBottomEndRadius: 300,
  },

  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: width * 0.5,
    height: height * 0.18,
    resizeMode: "contain",
    marginVertical: height * 0.02,
  },
  formContainer: {
    flex: 1,
    width: "80%",
  },
  input: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
  },
  eyeIconText: {
    fontSize: 24,
  },
  loginButton: {
    backgroundColor: "orange",
    padding: 10,
    alignItems: "center",
    borderRadius: 100,
    marginTop: 10,
    marginBottom: 170,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loader: {
    marginTop: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center", // Center the error message
  },
  footer: {
    position: "absolute",
    bottom: 20,
    alignItems: "center",
  },
  designDevelopText: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
    color: "#fff",
  },
  forgotPassword: {
    alignSelf: "center",
    marginBottom: 40,
    marginLeft: 150,
  },
  forgotPasswordText: {
    color: "#f7be6d",
    fontSize: 15,
  },

  disabledLink: {
    opacity: 0.5, // Reduce opacity when the link is disabled
  },

  squareBox1: {
    position: "relitive",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 100,
    backgroundColor: "orange",
    borderTopStartRadius: 400,
  },
});

export default LoginScreen;
