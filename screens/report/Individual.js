import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  ActivityIndicator,
  Keyboard,
  ScrollView
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  Zocial,
  Entypo,
  MaterialIcons,
} from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Table, Row, Rows } from "react-native-table-component";

const getTokenFromStorage = async () => {
  try {
    const token = await AsyncStorage.getItem("access_token");
    return token;
  } catch (error) {
    console.error("Error retrieving token from AsyncStorage: ", error);
  }
};

const Individual = () => {
  const tableHead = ["Si No", "Month-Year", "Attendance (Days)"];
  const tableData = [
    ["1", "June-2023", "20"],
    ["2", "July-2023", "28"],
    ["3", "August-2023", "30"],
    ["4", "September-2023", "10"],
    ["5", "Octomber-2023", "21"],
  ];

  const [userData, setUserData] = useState({
    name: "",
    mobile_no: "",
    cid: "",
    did: "",
    email: "",
  });

  const [showUserProfile, setShowUserProfile] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRef = useRef(null);

  const USER_DATA_BASE_URL = "https://dhqscanner.desuung.org.bt:8443/user-details";

  const createButtonPressed = async () => {
    Keyboard.dismiss();

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

  return (
    <KeyboardAwareScrollView
      behavior={Platform.OS === "ios" ? "padding" : null}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <View style={styles.coolinput}>
            <TextInput
              style={styles.input}
              placeholder="Enter your CID Number........"
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
                style={styles.buttonTouchable}
              >
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {showUserProfile && (
        <View style={styles.userProfileContainer}>
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
        </View>
      )}
      {showUserProfile && (
        <ScrollView style={styles.tableScrollContainer}>
          <View style={styles.tablecontainer}>
            <Table borderStyle={styles.border}>
              <Row
                data={tableHead}
                style={styles.head}
                textStyle={styles.headText}
              />
              <Rows
                data={tableData}
                style={styles.rows}
                textStyle={styles.cellText}
              />
            </Table>
          </View>
        </ScrollView>
      )}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
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
    marginLeft: 0,
    marginRight: 8,
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
    fontSize: 18,
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    width: "90%",
    marginLeft: 0,
  },
  userInfoInput: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 0,
    borderColor: "transparent",
    color: "grey",
    marginLeft: 8,
  },
  staticLabel: {
    fontWeight: "bold",
    paddingLeft: 16,
  },
  userProfileContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  tableScrollContainer: {
    maxHeight: 800, 
  },
  tablecontainer: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: "#fff",
    width: 300, 
   
  },
  head: {
    height: 40,
    backgroundColor: "#f1f8ff",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  cellText: {
    textAlign: "center",
    flex: 1,
  },
  rows: {
    height: 80,
    flexDirection: "row",
  },
});

export default Individual;
