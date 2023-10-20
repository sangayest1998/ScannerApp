import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import DropdownPicker from "react-native-dropdown-picker"; // Import the DropdownPicker component

import {
  Ionicons,
  MaterialCommunityIcons,
  Zocial,
  Entypo,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const CreateUserscreen = () => {
  const [userData, setUserData] = useState({
    name: "",
    contact: "",
    cid: "",
    did: "",
    email: "",
  });

  const [selectedDepartment, setSelectedDepartment] = useState("Select a Department");
  const [selectedRole, setSelectedRole] = useState("Select a Role");
  const [selectedEmployment, setSelectedEmployment] = useState("Select an Employment");

  const [showUserProfile, setShowUserProfile] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const departments = ["IT", "NS", "Call Center"];
  const roles = ["Staff", "Admin", "HR"];
  const employment = ["Volunteers", "Contract", "Deputation"];

  const inputRef = useRef(null);

  const USER_DATA_BASE_URL = "http://192.168.128.8:8000/user-details";

  const createButtonPressed = async () => {
    if (inputValue.trim() !== "") {
      try {
        const response = await fetch(`${USER_DATA_BASE_URL}/${inputValue}`);
  
        if (response.status === 200) {
          const data = await response.json();
          console.log("API Response:", data);
  
          if (Array.isArray(data) && data.length > 0) {
            const userData = data[0];
            
            if (userData.name && userData.did && userData.cid && userData.email && userData.mobile_no) {
              setUserData(userData);
              setShowUserProfile(true);
            } else {
              console.error("Invalid or missing data in the API response.");
            }
          } else {
            console.error("No user data found in the API response.");
          }
        } else if (response.status === 404) {
          console.error("User not found. Check your CID and server.");
        } else {
          console.error("Failed to fetch user data. Status Code:", response.status);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    } else {
      Alert.alert("CID Required", "Please enter a CID to fetch user data.");
    }
  };

  const saveButtonPressed = () => {
    if (showUserProfile) {
      const formData = {
        name: userData.name,
        contact: userData.contact,
        cid: userData.cid,
        did: userData.did,
        email: userData.email,
        department: selectedDepartment,
        role: selectedRole,
        employment: selectedEmployment,
      };

      fetch(USER_DATA_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (response.status === 200) {
            console.log("Data saved successfully.");
          } else {
            console.error("Failed to save data.");
          }
        })
        .catch((error) => {
          console.error("Error while saving data:", error);
        });
    }
    setShowUserProfile(false);
  };

  return (
    <KeyboardAwareScrollView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{ flex: 1 }}
    >
      <View style={styles.Container}>
        <View style={styles.inputContainer}>
          <View style={styles.coolinput}>
            <TextInput
              style={styles.input}
              placeholder="Enter your CiD Number........"
              name="input"
              keyboardType="numeric"
              value={inputValue}
              onChangeText={(text) => setInputValue(text)}
              ref={inputRef}
            />
          </View>
          <TouchableOpacity
            style={styles.buttonContent}
            onPress={createButtonPressed}
          >
            <Text style={styles.buttonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
      {showUserProfile && (
        <View style={styles.userProfile}>
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
            <Entypo
              name="v-card"
              size={24}
              color="orange"
              style={styles.icon}
            />
            <Text style={styles.staticLabel}>CID:</Text>
            <TextInput
              style={styles.userInfoInput}
              value={userData.cid}
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
              value={userData.contact}
              editable={false}
              underlineColorAndroid="transparent"
            />
          </View>
          <View style={styles.userInfoRow}>
            <Ionicons
              name="ios-locate"
              size={24}
              color="orange"
              style={styles.icon}
            />
            <Text style={styles.staticLabel}>Designation:</Text>
            <TextInput
              style={styles.userInfoInput}
              placeholder="Enter Designation..."
              editable={true}
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
            <DropdownPicker
              items={["Select a Department", ...departments].map((department) => ({
                label: department,
                value: department,
              }))}
              value={selectedDepartment}
              placeholder="Select a Department"
              containerStyle={styles.userInfoInput}
              onOpen={() => {
                // Handle open event
              }}
              onClose={() => {
                // Handle close event
              }}
              onChangeItem={(item) => setSelectedDepartment(item.value)}
            />
          </View>
          <View style={styles.userInfoRow}>
            <FontAwesome5
              name="network-wired"
              size={24}
              color="orange"
              style={styles.icon}
            />
            <Text style={styles.staticLabel}>Role:</Text>
            <DropdownPicker
              items={["Select a Role", ...roles].map((role) => ({
                label: role,
                value: role,
              }))}
              value={selectedRole}
              placeholder="Select a Role"
              containerStyle={styles.userInfoInput}
              onOpen={() => {
                // Handle open event
              }}
              onClose={() => {
                // Handle close event
              }}
              onChangeItem={(item) => setSelectedRole(item.value)}
            />
          </View>
          <View style={styles.userInfoRow}>
            <FontAwesome
              name="group"
              size={24}
              color="orange"
              style={styles.icon}
            />
            <Text style={styles.staticLabel}>Employment Type:</Text>
            <DropdownPicker
              items={["Select an Employment", ...employment].map((employmentType) => ({
                label: employmentType,
                value: employmentType,
              }))}
              value={selectedEmployment}
              placeholder="Select an Employment"
              containerStyle={styles.userInfoInput}
              onOpen={() => {
                // Handle open event
              }}
              onClose={() => {
                // Handle close event
              }}
              onChangeItem={(item) => setSelectedEmployment(item.value)}
            />
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveButtonPressed}
          >
            <Text style={styles.saveButtonText}>Create</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  Container: {
    display: "flex",
    flexDirection: "row",
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  coolinput: {
    display: "flex",
    flexDirection: "column",
    width: 300,
    maxWidth: 240,
    marginLeft: 20,
    marginRight: 20,
  },
  labelText: {
    fontSize: 18,
    color: "#fc5f00",
    fontWeight: "700",
    marginTop: 5,
    marginLeft: 7,
    paddingHorizontal: 3,
    width: "auto",
  },
  input: {
    padding: 11,
    fontSize: 12,
    borderWidth: 2,
    borderColor: "#ffb347",
    borderRadius: 5,
    backgroundColor: "#e8e8e8",
  },
  buttonContent: {
    backgroundColor: "#fa9c1b",
    borderRadius: 6,
    padding: 10,
    transition: "all 0.2s",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 20,
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "100%",
    marginLeft: 60,
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
    paddingLeft: 16,
  },
  userProfile: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "orange",
    padding: 10,
    alignItems: "center",
    borderRadius: 100,
    marginTop: 20,
    width: "50%",
    marginBottom: 40,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default CreateUserscreen;
