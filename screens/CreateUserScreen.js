import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
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
import AsyncStorage from "@react-native-async-storage/async-storage";



const getTokenFromStorage = async () => {
  try {
    const token = await AsyncStorage.getItem("access_token");
    return token;
  } catch (error) {
    console.error("Error retrieving token from AsyncStorage: ", error);
  }
};

const CreateUserscreen = ({navigation}) => {
  const [userData, setUserData] = useState({
    name: "",
    mobile_no: "",
    cid: "",
    did: "",
    email: "",
  });

  const [showUserProfile, setShowUserProfile] = useState(false);
  const [inputValue, setInputValue] = React.useState('');

 

  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);



  const USER_DATA_BASE_URL = "https://attendance.desuung.org.bt/user-details";

  const [selectedDesignation, setSelectedDesignation] = useState("");
  const [designationList, setDesignationList] = useState([]);

  // Define a function to fetch designations from the backend
  const fetchDesignations = async () => {
    try {
      const token = await getTokenFromStorage(); // Get the token from AsyncStorage
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(
        "https://attendance.desuung.org.bt/designations_list",
        {
          headers,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDesignationList(data);
      } else {
        console.error("Failed to fetch designations");
      }
    } catch (error) {
      console.error("Error fetching designations:", error);
    }
  };

  useEffect(() => {
    // Call the fetchDesignations function when the component mounts
    fetchDesignations();
  }, []);

  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departments, setDepartments] = useState([]);

  // Define a function to fetch departments from AsyncStorage
  const fetchDepartments = async () => {
    try {
      const token = await getTokenFromStorage(); // Get the token from AsyncStorage
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // If departments data is not in AsyncStorage, fetch it from the backend
      const response = await fetch(
        "https://attendance.desuung.org.bt/departments_list",
        { headers }
      );

      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      } else {
        console.error("Failed to fetch departments");
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    // Call the fetchDepartments function when the component mounts
    fetchDepartments();
  }, []);

  const [selectedRole, setSelectedRole] = useState("");
  const [roles, setRoles] = useState([]);

  // Define a function to fetch roles from the backend
  const fetchRoles = async () => {
    try {
      const response = await fetch("https://attendance.desuung.org.bt/roles_list");
      if (response.ok) {
        const data = await response.json();
        setRoles(data);
      } else {
        console.error("Failed to fetch roles");
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    // Call the fetchRoles function when the component mounts
    fetchRoles();
  }, []);

  const [selectedEmployment, setSelectedEmployment] = useState("");
  const [employment, setEmployment] = useState([]);

  // Define a function to fetch employment types from the backend
  const fetchEmploymentTypes = async () => {
    try {
      const token = await getTokenFromStorage();
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await fetch(        
        "https://attendance.desuung.org.bt/employment_types_list",
        { headers }
      );

      if (response.ok) {
        const data = await response.json();
        setEmployment(data);
      } else {
        console.error("Failed to fetch employments");
        // Log the response status and error message
        console.error("Response Status:", response.status);
        console.error("Error Message:", await response.text());
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    // Call the fetchRoles function when the component mounts
    fetchEmploymentTypes();
  }, []);

  // buttons functions
  const createButtonPressed = async () => {
    Keyboard.dismiss();
    if (inputValue.trim() === "") {
      Alert.alert("CID Required", "Please enter a CID to fetch user data.");
      return;
    }

    if (inputValue === userData.cid) {
      Alert.alert(
        "User Already Created",
        "You are trying to search the same CID again."
      );
      return;
    }

    try {
      const token = await getTokenFromStorage();
      if (token) {
        setLoading(true);

        const response = await fetch(`${USER_DATA_BASE_URL}/${inputValue}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          const responseJson = await response.json();
          const data = responseJson.data[0];

          if (
            data &&
            data.name &&
            data.did &&
            data.cid &&
            data.email &&
            data.mobile_no
          ) {
            setUserData(data);
            setShowUserProfile(true);
            setInputValue("");
          } else {
            Alert.alert("Invalid Data", "Incorrect CiD Number.");
          }
        } else {
          Alert.alert(
            "Error",
            "Failed to fetch user data. Check your CID and server."
          );
        }
      } else {
        Alert.alert(
          "Unauthorized",
          "You are not authorized to access this data."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Error fetching user data: " + error.message);
    } finally {
      setLoading(false);
    }
  };


  //post

  const saveButtonPressed = async () => {
    if (showUserProfile) {
      const missingSelections = [];

    if (selectedDesignation === "") {
      missingSelections.push("designation");
    }

    if (selectedDepartment === "") {
      missingSelections.push("department");
    }

    if (selectedRole === "") {
      missingSelections.push("roles");
    }

    if (selectedEmployment === "") {
      missingSelections.push("employment types");
    }

    if (missingSelections.length > 0) {
      Alert.alert(
        "Selection Required",
        `Please select ${missingSelections.join(", ")} before creating the user.`
      );
      return;
    }

      const token = await getTokenFromStorage();

      if (token) {
        const postData = {
          name: userData.name,
          did: userData.did,
          email: userData.email,
          contact: userData.mobile_no,
          cid: userData.cid,
          password: "string",
          designation: selectedDesignation,
          department: selectedDepartment,
          roles: selectedRole,
          employment_type: selectedEmployment,
        };

        console.log("postData:", postData);

        const response = await fetch("https://attendance.desuung.org.bt/user/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });
        if (response.status === 200) {
          // User data posted successfully
          Alert.alert("Message Alert.","User Created Successfully");
          console.log("User Created Successfully");
        } else {
          Alert.alert("Message Alert.","This user already exist.");
          console.log("Failed");
        }
          // Clear user data and selected values for a new entry
          setUserData({
            name: "",
            mobile_no: "",
            cid: "",
            did: "",
            email: "",
          });
          setSelectedDesignation("");
          setSelectedDepartment("");
          setSelectedRole("");
          setSelectedEmployment("");

          // Hide the user profile
          setShowUserProfile(false);
        
      }
    }
  };

  const pickerStyle = {
    height: 50,
    width: "90%",
    paddingHorizontal: 10,
    marginBottom: 10,
  };

  const itemStyle = {
    // Style for individual items, including the arrow color
    color: "grey", // This will change the arrow color
  };

  return (
    <KeyboardAwareScrollView
    contentContainerStyle={styles.container}
    resetScrollToCoords={{ x: 0, y: 0 }}
    scrollEnabled
  >
      <View style={styles.Container}>
        <View style={styles.inputContainer}>
          <View style={styles.coolinput}>
            <TextInput
              style={styles.input}
              placeholder="Enter the CID"
              name="input"
              keyboardType="numeric"
              value={inputValue}
              onChangeText={(text) => setInputValue(text)}
              ref={inputRef}
            />
          </View>
          <View style={styles.buttonContent}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <TouchableOpacity
                onPress={createButtonPressed}
              >
               <MaterialIcons name="search" size={28} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
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
              value={userData.mobile_no}
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

            {Array.isArray(designationList) ? (
              <Picker
                style={pickerStyle}
                selectedValue={selectedDesignation}
                onValueChange={(itemValue) => setSelectedDesignation(itemValue)
                }
                
              >
                <Picker.Item label="Select a Designation" value="" />
                {designationList.map((designation) => (
                  <Picker.Item
                    label={designation.name}
                    value={designation.name}
                    key={designation.name}
                    style={itemStyle}
                  />
                ))}
              </Picker>
            ) : (
              <Text>Loading Designations...</Text>
            )}
          </View>
          <View style={styles.userInfoRow}>
            <FontAwesome
              name="group"
              size={24}
              color="orange"
              style={styles.icon}
            />

            <Picker
              style={pickerStyle}
              selectedValue={selectedDepartment}
              onValueChange={(itemValue) => setSelectedDepartment(itemValue)}
            >
              <Picker.Item label="Select a Department" value="" />
              {departments.map((department, index) => (
                <Picker.Item
                  label={department}
                  value={department}
                  key={index}
                  style={itemStyle}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.userInfoRow}>
            <FontAwesome5
              name="network-wired"
              size={24}
              color="orange"
              style={styles.icon}
            />

            <Picker
              style={pickerStyle}
              selectedValue={selectedRole}
              onValueChange={(itemValue) => setSelectedRole(itemValue)}
            >
              <Picker.Item label="Select a Role" value="" />
              {roles.map((role, index) => (
                <Picker.Item
                  label={role}
                  value={role}
                  key={index}
                  style={itemStyle}
                />
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

            <Picker
              style={pickerStyle}
              selectedValue={selectedEmployment}
              onValueChange={(itemValue) => setSelectedEmployment(itemValue)}
            >
              <Picker.Item label="Select an Employment Type" value="" />
              {employment.map((employmentType, index) => (
                <Picker.Item
                  label={employmentType.name}
                  value={employmentType.name}
                  key={index}
                  style={itemStyle}
                />
              ))}
            </Picker>
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
    justifyContent:'center',
    alignItems:'center'
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderRadius:'100'
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

  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "80%",
    marginLeft: 50,
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
