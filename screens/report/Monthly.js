import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Button, TouchableOpacity, Alert, Platform } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MonthlyReportScreen() {
  const [selectedStartDate, setSelectedStartDate] = useState(false);
  const [selectedEndDate, setSelectedEndDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerDefaultDate, setDatePickerDefaultDate] = useState(new Date());
  const [dateError, setDateError] = useState("");
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

  const showDatePicker = useCallback((startDateSelection) => {
    setSelectedStartDate(startDateSelection);
    setSelectedEndDate(!startDateSelection);
    setDatePickerVisible(true);
  }, []);

  const hideDatePicker = useCallback(() => {
    setDatePickerVisible(false);
  }, []);

  const handleConfirm = useCallback((date) => {
    try {
      const formattedDate = date.toISOString().split('T')[0]; // Format to "yyyy-MM-dd";
      console.log("Formatted Date:", formattedDate);

      if (selectedStartDate) {
        setStartDate(formattedDate);
        setDatePickerDefaultDate(date);
      } else if (selectedEndDate) {
        if (new Date(date) >= new Date(datePickerDefaultDate)) {
          setEndDate(formattedDate);
          setDateError("");
        } else {
          setDateError("End date should always be greater than or equal to the start date.");
        }
      }
      hideDatePicker();
    } catch (error) {
      console.error("Error while handling date:", error);
    }
  }, [selectedStartDate, selectedEndDate, datePickerDefaultDate, hideDatePicker]);

  const isGenerateButtonActive = startDate && endDate;

  
  const resetDateFields = () => {
    setStartDate("");
    setEndDate("");
  };

  const downloadFromAPI = async () => {
    const filename = `attendance_report_of_${startDate}_${endDate}.csv`;
    const queryParams = `?start_date=${startDate}&end_date=${endDate}`;
    
    const apiUrl = `https://attendances.desuung.org.bt/attendance-report${queryParams}`;

    try {
      const result = await FileSystem.downloadAsync(
        apiUrl,
        FileSystem.documentDirectory + filename,
        {
          headers: {
            "MyHeader": "MyValue",
            "Authorization": `Bearer ${token}`, // Include the authorization header
          }
        }
      );

      save(result.uri, filename);
    } catch (error) {
      console.error("Error while downloading the file:", error);
      Alert.alert("Download Error", "There was an error while downloading the file.");
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
            'attendance_report/csv'
          );
          
          await FileSystem.writeAsStringAsync(newUri, base64, { encoding: FileSystem.EncodingType.Base64 });
          Alert.alert("File Saved", "The file has been saved to the selected folder.");
        } else {
          Alert.alert("Permission Denied", "You need to grant permission to save the file.");
        }
      }
      resetDateFields(); // Reset date fields after successful download
    } catch (error) {
      console.error('Error while saving the file:', error);
      Alert.alert("Save Error", "There was an error while saving the file. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TouchableOpacity onPress={() => showDatePicker(true)}>
          <Text style={styles.label}>Start Date:</Text>
          <Text style={styles.dateText}>{startDate || 'Select Date'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => showDatePicker(false)}>
          <Text style={styles.label}>End Date:</Text>
          <Text style={styles.dateText}>{endDate || 'Select Date'}</Text>
        </TouchableOpacity>
      </View>

      {dateError !== "" && <Text style={styles.errorText}>{dateError}</Text>}

      <View style={styles.downloadButtonContainer}>
        <Button
          title="Download to Device"
          onPress={downloadFromAPI}
          disabled={!isGenerateButtonActive}
          color="orange"
        />
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={datePickerDefaultDate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 16,
  },
  label: {
    fontSize: 18,
    color: "orange",
    alignSelf: 'center',
  },
  dateText: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "orange",
    borderRadius: 5,
    padding: 8,
    width: 150,
    textAlign: "center",
    marginVertical: 8,
    marginRight: 20,
  },
  downloadButtonContainer: {
    marginVertical: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 8,
  },
});
