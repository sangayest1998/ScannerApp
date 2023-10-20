import React, { useState } from 'react';
import { StyleSheet, Button, View, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from 'date-fns';
import * as FileSystem from 'expo-file-system';
import { shareAsync } from 'expo-sharing';

export default function App() {
  const [selectedStartDate, setSelectedStartDate] = useState(false);
  const [selectedEndDate, setSelectedEndDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [datePickerDefaultDate, setDatePickerDefaultDate] = useState(new Date());
  const [dateError, setDateError] = useState("");

  const showDatePicker = (startDateSelection) => {
    setSelectedStartDate(startDateSelection);
    setSelectedEndDate(!startDateSelection);
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd'); // Format to "yyyy-MM-dd";
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
  };

  const isGenerateButtonActive = startDate && endDate;

  const downloadFromAPI = async () => {
    const filename = `attendance_report_${startDate}_${endDate}.csv`;
    const queryParams = `?start_date=${startDate}&end_date=${endDate}`;


    // const apiUrl = `http://192.168.128.8:8000/attendance-report${queryParams}`;

    const apiUrl = `http://202.144.153.106:8000/attendance-report${queryParams}`;

    try {
      const result = await FileSystem.downloadAsync(
        apiUrl,
        FileSystem.documentDirectory + filename,
        {
          headers: {
            "MyHeader": "MyValue"
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
    if (Platform.OS === 'ios') {
      await shareAsync(uri)
        .then(() => {
          console.log('Shared successfully');
        })
        .catch((error) => {
          console.error('Sharing failed:', error);
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
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TouchableOpacity onPress={() => showDatePicker(true)}>
          <Text style={styles.label}>Start Date:</Text>
          <Text style={styles.dateText}>{startDate}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => showDatePicker(false)}>
          <Text style={styles.label}>End Date:</Text>
          <Text style={styles.dateText}>{endDate}</Text>
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
    marginVertical: 16, // Added margin for better spacing
  },
  label: {
    fontSize: 18,
    color: "orange", // Set the label text color to orange
    alignSelf:'center'
  },
  dateText: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: "orange", // Set the border color to orange
    borderRadius: 5,
    padding: 8,
    width: 150,
    textAlign: "center",
    marginVertical: 8, // Added margin for spacing between date fields
    marginRight:20
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
