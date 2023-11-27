import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Ionicons,
  MaterialCommunityIcons,
  Zocial,
  Entypo,
  FontAwesome,
  MaterialIcons,
} from "@expo/vector-icons";

const USER_DATA_BASE_URL = "https://attendances.desuung.org.bt/profile";
const PROFILE_IMAGE_BASE_URL =
  "https://attendances.desuung.org.bt/update/profile-picture";
const PROFILE_PICTURE_BASE_URL =
  "https://attendances.desuung.org.bt/get/profile-picture";

const ProfileScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState({
    name: "",
    department: "",
    contact: "",
    cid: "",
    did: "",
    email: "",
    profile_picture_url: "",
  });
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    getPermission();
    fetchUserData();
    retrieveProfilePicture(); // Retrieve profile picture when the component mounts
    retrieveProfilePictureURL(); // Retrieve the URL from AsyncStorage
  }, []);

  const getPermission = async () => {
    const galleryStatus =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (galleryStatus.status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant permission to access the gallery to upload a profile picture."
      );
    }
  };

  const fetchUserData = async () => {
    try {
      const access_token = await AsyncStorage.getItem("access_token");

      const response = await fetch(USER_DATA_BASE_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      } else {
        const responseText = await response.text();
        console.error(
          "Failed to fetch user data:",
          response.status,
          response.statusText,
          responseText
        );
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const pickImage = async () => {
    try {
      const access_token = await AsyncStorage.getItem("access_token");
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (galleryStatus.status !== "granted") {
        throw new Error("Permission to access the gallery is required.");
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      const formData = new FormData();
      formData.append("file", {
        uri: result.assets[0].uri,
        type: "image/jpeg",
        name: "profile.jpg",
      });

      const response = await fetch(PROFILE_IMAGE_BASE_URL, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (response.ok) {
        const imageURL = await response.json();
        const imageToken = imageURL.url;

        // Update the userData state with the new profile_picture_url
        setUserData((prevUserData) => ({
          ...prevUserData,
          profile_picture_url: imageToken,
        }));
        await AsyncStorage.setItem("profile_picture_url", imageToken); // Store updated URL

        // Refresh the profile picture immediately after updating
        retrieveProfilePicture();
        // Update the local state with the new image immediately
        setImage(imageToken);
        setImageError(false);
      } else {
        const responseText = await response.text();
        console.error(
          "Failed to upload profile picture:",
          response.status,
          response.statusText,
          responseText
        );
        setImageError(true);
        Alert.alert(
          "Error",
          "Failed to upload profile picture. Please try again."
        );
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error.message);
      setImageError(true);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  const retrieveProfilePicture = async () => {
    try {
      const access_token = await AsyncStorage.getItem("access_token");
  
      // Generate a random number or timestamp to bust the cache
      const cacheBuster = new Date().getTime(); // Example: Timestamp as a cache buster
  
      const response = await fetch(`${PROFILE_PICTURE_BASE_URL}?cache=${cacheBuster}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();

        // Convert Blob to Base64 string
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result;
          setImage(base64data);
          setImageError(false);
        };
        reader.readAsDataURL(blob);
      } else if (response.status === 404) {
        setImage(null);
        setImageError(false);
      } else {
        // Log the error details
        console.error(
          "Error retrieving profile picture. Status:",
          response.status
        );
        const responseText = await response.text();
        console.error("Error response:", responseText);

        // Set the error state
        setImageError(true);
      }
    } catch (error) {
      // Log any unexpected errors
      console.error("Unexpected error retrieving profile picture:", error);
      setImageError(true);
    }
  };
  const retrieveProfilePictureURL = async () => {
    try {
      const profileURL = await AsyncStorage.getItem("profile_picture_url");
      if (profileURL) {
        setUserData((prevUserData) => ({
          ...prevUserData,
          profile_picture_url: profileURL,
        }));
        setImage(profileURL);
      }
    } catch (error) {
      console.error("Error retrieving profile picture URL:", error);
    }
  };

  const handleLogout = async () => {
    try {
      // Show an alert to confirm logout
      Alert.alert(
        "Logout",
        "Are you sure you want to log out?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Logout",
            onPress: async () => {
              // Clear stored user data and authentication information
              await AsyncStorage.removeItem("access_token");
              await AsyncStorage.removeItem("refresh_token");
              await AsyncStorage.removeItem("userRole");
              await AsyncStorage.removeItem("userId");
  
              // Navigate to the Login screen
              navigation.navigate("Login");
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  
  

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={pickImage}>
          <View style={styles.imageContainer}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={styles.profileImage}
                onError={() => {
                  console.error("Image loading error:", image);
                  setImageError(true);
                }}
              />
            ) : (
              <Image
                source={require("../assets/c.png")}
                style={styles.placeholderImage}
              />
            )}
          </View>
        </TouchableOpacity>
        {imageError && (
          <Text style={styles.errorMessage}>Error loading image</Text>
        )}
      </View>

      <View style={styles.userInfoContainer}>
        <View style={styles.userInfoRow}>
          <Ionicons
            name="ios-person-circle"
            size={24}
            color="orange"
            style={styles.icon}
          />
          <Text style={styles.staticLabel}>Name:</Text>
          <TextInput
            style={styles.userInfoInput}
            value={userData.name}
            editable={false}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.userInfoRow}>
          <MaterialCommunityIcons
            name="clipboard-account"
            size={24}
            color="orange"
            style={styles.icon}
          />
          <Text style={styles.staticLabel}>DID:</Text>
          <TextInput
            style={styles.userInfoInput}
            value={userData.did}
            editable={false}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.userInfoRow}>
          <Entypo name="v-card" size={24} color="orange" style={styles.icon} />
          <Text style={styles.staticLabel}>CID:</Text>
          <TextInput
            style={styles.userInfoInput}
            value={userData.cid.toString()}
            editable={false}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.userInfoRow}>
          <Zocial name="email" size={24} color="orange" style={styles.icon} />
          <Text style={styles.staticLabel}>Email:</Text>
          <TextInput
            style={styles.userInfoInput}
            value={userData.email}
            editable={false}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.userInfoRow}>
          <MaterialIcons
            name="sim-card"
            size={24}
            color="orange"
            style={styles.icon}
          />
          <Text style={styles.staticLabel}>Contact:</Text>
          <TextInput
            style={styles.userInfoInput}
            value={userData.contact.toString()}
            editable={false}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.userInfoRow}>
          <FontAwesome
            name="group"
            size={24}
            color="orange"
            style={styles.icon}
          />
          <Text style={styles.staticLabel}>Department:</Text>
          <TextInput
            style={styles.userInfoInput}
            value={userData.department}
            editable={false}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    alignItems: "center",
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "orange",
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: "orange",
  },
  placeholderImage: {
    width: 100,
    height: 100,
  },
  userInfoContainer: {
    marginTop: 20,
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
    marginLeft: 0,
  },
  userInfoInput: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 0,
    borderColor: "transparent",
    color: "grey",
    paddingLeft: 6,
  },
  staticLabel: {
    fontWeight: "bold",
  },
  icon: {
    marginRight: 18,
    paddingLeft: 60,
  },
  errorMessage: {
    color: "red",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "orange",
    borderRadius: 100,
    padding: 10,
    width: "90%",
    marginTop: 40,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default ProfileScreen;
