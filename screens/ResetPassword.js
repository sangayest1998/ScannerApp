// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Alert,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
// } from "react-native";
// import { useNavigation, useRoute } from "@react-navigation/native";

// export default function ResetPasswordScreen() {
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [passwordMismatch, setPasswordMismatch] = useState(false);

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };

//   const navigation = useNavigation();
//   const route = useRoute();
//   const otp = route.params?.otp || "";
//   const cid = route.params.cid;

//   const handleResetPassword = async () => {
//     if (newPassword === confirmPassword) {
//       if (newPassword.length < 8) {
//         Alert.alert("Error", "Password should be at least 8 characters long.");
//         return;
//       }

//       setIsLoading(true);
//       setPasswordMismatch(false);

//       const resetData = {
//         otp_code: otp, // Send OTP as a string
//         new_password: newPassword,
//         confirm_password: confirmPassword,
//       };

//       try {
//         console.log("Sending reset request:", resetData);

//         const response = await fetch("http://202.144.153.106:8000/reset-password", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(resetData),
//         });

//         console.log("Response status:", response.status);
//         console.log("Response statusText:", response.statusText);

//         if (response.ok) {
//           Alert.alert("Password reset was successful.");
//           navigation.navigate('Login');
//         } else {
//           const responseData = await response.json();
//           console.log("Reset password error:", responseData);
//           Alert.alert(
//             "Error",
//             responseData.detail || "Failed to reset password. Please try again."
//           );
//         }
//       } catch (error) {
//         console.error("An error occurred while sending the request:", error);
//         Alert.alert("Error", "An error occurred. Please try again later.");
//       } finally {
//         setIsLoading(false);
//       }
//     } else {
//       setPasswordMismatch(true);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.squareBox} />
//       <Text style={styles.title}>Reset Password</Text>

//       <View
//         style={[
//           styles.passwordContainer,
//           passwordMismatch && styles.errorBorder,
//         ]}
//       >
//         <TextInput
//           value={newPassword}
//           onChangeText={(text) => setNewPassword(text)}
//           placeholder="New Password (min 8 characters)"
//           secureTextEntry={!showPassword}
//           editable={!isLoading}
//           style={styles.passwordInput}
//         />
//         <TouchableOpacity
//           onPress={togglePasswordVisibility}
//           style={styles.eyeIcon}
//         >
//           <Text style={styles.eyeIconText}>{showPassword ? "👁" : "🔒"}</Text>
//         </TouchableOpacity>
//       </View>

//       <View
//         style={[
//           styles.passwordContainer,
//           passwordMismatch && styles.errorBorder,
//         ]}
//       >
//         <TextInput
//           value={confirmPassword}
//           onChangeText={(text) => setConfirmPassword(text)}
//           placeholder="Confirm Password"
//           secureTextEntry={!showConfirmPassword}
//           editable={!isLoading}
//           style={styles.passwordInput}
//         />
//         <TouchableOpacity
//           onPress={toggleConfirmPasswordVisibility}
//           style={styles.eyeIcon}
//         >
//           <Text style={styles.eyeIconText}>
//             {showConfirmPassword ? "👁" : "🔒"}
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {passwordMismatch && (
//         <Text style={styles.errorText}>
//           Passwords do not match. Please try again.
//         </Text>
//       )}

//       <TouchableOpacity
//         style={styles.loginButton}
//         onPress={handleResetPassword}
//         disabled={isLoading}
//       >
//         {isLoading ? (
//           <ActivityIndicator color="#fff" />
//         ) : (
//           <Text style={styles.loginButtonText}>Reset Password</Text>
//         )}
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     backgroundColor: "#fff",
//   },
//   squareBox: {
//     width: "100%",
//     height: 100,
//     backgroundColor: "orange",
//     borderBottomEndRadius: 300,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 20,
//     marginBottom: 40,
//     fontWeight: "bold",
//     color: "#f05e16",
//   },
//   passwordContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFE5B4",
//     padding: 10,
//     marginBottom: 10,
//     borderRadius: 10,
//     width: "80%",
//   },
//   errorBorder: {
//     borderColor: "red",
//     borderWidth: 1,
//   },
//   passwordInput: {
//     flex: 1,
//   },
//   eyeIcon: {
//     position: "absolute",
//     right: 8,
//   },
//   eyeIconText: {
//     fontSize: 24,
//   },
//   loginButton: {
//     backgroundColor: "#ffb347",
//     padding: 10,
//     alignItems: "center",
//     borderRadius: 100,
//     marginTop: 40,
//     width: "80%",
//   },
//   loginButtonText: {
//     color: "#fff",
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   errorText: {
//     color: "red",
//     marginBottom: 10,
//   },
// });


import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const navigation = useNavigation();
  const route = useRoute();
  const otp = route.params?.otp || "";
  const cid = route.params.cid;

  const handleResetPassword = async () => {
    if (newPassword === confirmPassword) {
      if (newPassword.length < 8) {
        Alert.alert("Error", "Password should be at least 8 characters long.");
        return;
      }

      setIsLoading(true);
      setPasswordMismatch(false);

      const resetData = {
        otp_code: otp, // Send OTP as a string
        new_password: newPassword,
        confirm_password: confirmPassword,
      };

      try {
        console.log("Sending reset request:", resetData);

        // const response = await fetch("http://192.168.128.8:8000/reset-password", {
       
         const response = await fetch("https://attendances.desuung.org.bt/reset-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(resetData),
        });

        console.log("Response status:", response.status);
        console.log("Response statusText:", response.statusText);

        if (response.ok) {
          Alert.alert("Password reset was successful.");
          navigation.navigate('Login');
        } else {
          const responseData = await response.json();
          console.log("Reset password error:", responseData);
          Alert.alert(
            "Error",
            responseData.detail || "Failed to reset password. Please try again."
          );
        }
      } catch (error) {
        console.error("An error occurred while sending the request:", error);
        Alert.alert("Error", "An error occurred. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setPasswordMismatch(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.squareBox} />

      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
  <View style={styles.imageContainer}>
        <Image source={require("../assets/reset.png")} style={styles.image} />
      </View>
        <View
          style={[
            styles.passwordContainer,
            passwordMismatch && styles.errorBorder,
          ]}
        >
          <TextInput
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
            placeholder="New Password (min 8 characters)"
            secureTextEntry={!showPassword}
            editable={!isLoading}
            style={styles.passwordInput}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.eyeIcon}
          >
            <Text style={styles.eyeIconText}>{showPassword ? "👁" : "🔒"}</Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.passwordContainer,
            passwordMismatch && styles.errorBorder,
          ]}
        >
          <TextInput
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPassword}
            editable={!isLoading}
            style={styles.passwordInput}
          />
          <TouchableOpacity
            onPress={toggleConfirmPasswordVisibility}
            style={styles.eyeIcon}
          >
            <Text style={styles.eyeIconText}>
              {showConfirmPassword ? "👁" : "🔒"}
            </Text>
          </TouchableOpacity>
        </View>

        {passwordMismatch && (
          <Text style={styles.errorText}>
            Passwords do not match. Please try again.
          </Text>
        )}

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleResetPassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Reset Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  squareBox: {
    width: "100%",
    height: 100,
    backgroundColor: "orange",
    borderBottomEndRadius: 300,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    width: "80%",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    marginBottom: 40,
    fontWeight: "bold",
    color: "black",
    textAlign:'center'
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFE5B4",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  errorBorder: {
    borderColor: "red",
    borderWidth: 1,
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    position: "absolute",
    right: 8,
  },
  eyeIconText: {
    fontSize: 24,
  },
  loginButton: {
    backgroundColor: "#ffb347",
    padding: 10,
    alignItems: "center",
    borderRadius: 100,
    marginTop: 40,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
});
