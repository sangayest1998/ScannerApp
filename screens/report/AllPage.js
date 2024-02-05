import React, { useState, useEffect } from 'react';
import { View, Button, Alert, Platform, StyleSheet, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MonthlyReportScreen() {
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userIdValue = await AsyncStorage.getItem('userId');
        if (userIdValue) {
          setUserId(userIdValue);
        }

        const tokenValue = await AsyncStorage.getItem('access_token');
        if (tokenValue) {
          setToken(tokenValue);
        }
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
    };

    fetchData();
  }, []);

  const downloadFromAPI = async () => {
    const apiUrl = "https://attendance.desuung.org.bt/all-attendance";

    try {
      const result = await FileSystem.downloadAsync(
        apiUrl,
        FileSystem.documentDirectory + 'Attendance_report_for_All.csv',
        {
          headers: {
            "MyHeader": "MyValue",
            "Authorization": `Bearer ${token}`,
          }
        }
      );

  await save(result.uri, 'Attendance_report_for_All.csv');
  } catch (error) {
    console.error("Error while downloading/saving the file:", error);
    Alert.alert("Download Error", "There was an error while downloading/saving the file. Please try again.");
  }
};

const save = async (uri, filename) => {
  try {
    if (Platform.OS === 'ios') {
      await shareAsync(uri)
        .then(() => {
          console.log('Shared successfully');
        })
        .catch((error) => {
          console.error('Sharing failed:', error);
          throw new Error(error); // Added to handle errors uniformly
        });
    } else if (Platform.OS === 'android') {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        const newUri = await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          filename,
          'Attendance_report_for_All.csv'
        );
        
        await FileSystem.writeAsStringAsync(newUri, base64, { encoding: FileSystem.EncodingType.Base64 });
        Alert.alert("File Saved", "The file has been saved to the selected folder.");
      } else {
        Alert.alert("Permission Denied", "You need to grant permission to save the file.");
      }
    }
  } catch (error) {
    console.error('Error while saving the file:', error);
    Alert.alert("Save Error", "There was an error while saving the file. Please try again.");
  }
};


return (
  <View style={styles.container}>
    <Text style={styles.instructions}>
      Click the button below to download the attendance report for the entire month.
    </Text>
    <View style={styles.downloadButtonContainer}>
      <Button
        title="Download to Device"
        onPress={downloadFromAPI}
        color="orange"
      />
    </View>
  </View>
);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 16,
},
instructions: {
  textAlign: 'center',
  marginBottom: 20,
  fontSize: 16,
  color: '#333',
},
downloadButtonContainer: {
  marginVertical: 16,
},
});