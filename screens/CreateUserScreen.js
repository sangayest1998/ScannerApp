import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
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

// Define the URL for user data
const USER_DATA_BASE_URL = "http://192.168.128.8:8000/profile";

const CreateUserscreen = () => {
  const [userData, setUserData] = useState({
    name: "",
    contact: "",
    cid: "",
    did: "",
    email: "",
  });

  const [selectedDepartment, setSelectedDepartment] = useState(
    "Select a Department"
  ); // Set to the default label
  const [selectedRole, setSelectedRole] = useState("Select a Role"); // Set to the default label
  const [selectedEmployment, setSelectedEmployment] = useState(
    "Select a Employment"
  ); // Set to the default label

  const [showUserProfile, setShowUserProfile] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const departments = ["IT", "NS", "Call Center"];
  const roles = ["Staff", "Admin", "HR"];
  const employment = ["Volunteers", "Contract", "Deputation"];

  const inputRef = useRef(null);

  useEffect(() => {
    // Fetch user data here from USER_DATA_BASE_URL
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Perform an HTTP request to fetch user data from USER_DATA_BASE_URL
      const response = await fetch(USER_DATA_BASE_URL);
      const data = await response.json();
      setUserData(data); // Update userData state with the fetched data
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const createButtonPressed = () => {
  if (inputValue.trim() !== "") {
    setShowUserProfile(true);
    inputRef.current.blur();
    setInputValue("");
    
    // Clear the selected values in the Picker components
    setSelectedDepartment("Select a Department");
    setSelectedRole("Select a Role");
    setSelectedEmployment("Select a Employment");
  }
};
  const saveButtonPressed = () => {
    setShowUserProfile(false);
    setFormSubmitted(true);
    // Perform save action and submit the form data
  };

  

  return (
    <KeyboardAwareScrollView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{ flex: 1 }}
    >
      <View style={styles.Container}>
      <View style={styles.inputContainer}>
        <View style={styles.coolinput}>
          <Text style={styles.labelText}>CiD Card Number:</Text>
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
           style={[styles.buttonContent, styles.sameHeightButton]}
          onPress={createButtonPressed}
        >
          <Text style={styles.buttonText}>Create</Text>
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
              value={userData.cid ? userData.cid.toString() : ""}
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
              value={userData.contact ? userData.contact.toString() : ""}
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
            <Picker
              style={styles.userInfoInput}
              selectedValue={selectedDepartment}
              onValueChange={(itemValue) => setSelectedDepartment(itemValue)}
            >
              {["Select a Department", ...departments].map(
                (department, index) => (
                  <Picker.Item
                    label={department}
                    value={department}
                    key={index}
                  />
                )
              )}
            </Picker>
          </View>
          <View style={styles.userInfoRow}>
            <FontAwesome5
              name="network-wired"
              size={24}
              color="orange"
              style={styles.icon}
            />
            <Text style={styles.staticLabel}>Role:</Text>
            <Picker
              style={styles.userInfoInput}
              // style={pickerStyle}
              selectedValue={selectedRole}
              onValueChange={(itemValue) => setSelectedRole(itemValue)}
            >
              {["Select a Rolo", ...roles].map((role, index) => (
                <Picker.Item label={role} value={role} key={index} />
              ))}
            </Picker>
          </View>
          <View style={styles.userInfoRow}>
            <FontAwesome
              name="group"
              size={24}
              color="orange"
              style={styles.icon}
            />
            <Text style={styles.staticLabel}>Employment Type:</Text>
            <Picker
              style={styles.userInfoInput}
              // style={pickerStyle}
              selectedValue={selectedEmployment}
              onValueChange={(itemValue) => setSelectedEmployment(itemValue)}
            >
              {["Select a Employment", ...employment].map(
                (employmentType, index) => (
                  <Picker.Item
                    label={employmentType}
                    value={employmentType}
                    key={index}
                  />
                )
              )}
            </Picker>
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveButtonPressed}
          >
            <Text style={styles.saveButtonText}>Save</Text>
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
  sameHeightButton: {
    height: 60, 
    marginTop:30
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
    marginBottom:40
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default CreateUserscreen;
