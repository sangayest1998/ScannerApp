import React, { useState } from 'react';
import { StyleSheet, Button, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from 'date-fns';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [selectedStartDate, setSelectedStartDate] = useState(false);
  const [selectedEndDate, setSelectedEndDate] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
  const [startDatePickerDefaultDate, setStartDatePickerDefaultDate] = useState(
    new Date()
  );
  const [endDatePickerDefaultDate, setEndDatePickerDefaultDate] = useState(
    new Date()
  );
  const [dateError, setDateError] = useState("");
  const [loading, setLoading] = useState(false);

  const showStartDatePicker = () => {
    setSelectedStartDate(true);
    setSelectedEndDate(false);
    setStartDatePickerVisible(true);
    setEndDatePickerVisible(false);
  };

  const showEndDatePicker = () => {
    setSelectedStartDate(false);
    setSelectedEndDate(true);
    setStartDatePickerVisible(false);
    setEndDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setStartDatePickerVisible(false);
    setEndDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd'); // Format to "yyyy-MM-dd";
    console.log("Formatted Date:", formattedDate);

    if (selectedStartDate) {
      setStartDate(formattedDate);
      setStartDatePickerDefaultDate(date);
      if (new Date(date) > new Date(endDatePickerDefaultDate)) {
        setEndDate(formattedDate);
        setEndDatePickerDefaultDate(date);
        setDateError("");
      }
    } else if (selectedEndDate) {
      if (new Date(date) >= new Date(startDatePickerDefaultDate)) {
        setEndDate(formattedDate);
        setEndDatePickerDefaultDate(date);
        setDateError("");
      } else {
        setDateError(
          "End date should always be greater than or equal to the start date."
        );
      }
    }
    hideDatePicker();
  };

  const isGenerateButtonActive = startDate && endDate;

  const downloadFromAPI = async () => {
    const filename = `attendance_report_${startDate}_${endDate}.csv`;
    const queryParams = `?start_date=${startDate}&end_date=${endDate}`;
    const apiUrl = `http://202.144.153.106:8000/attendance-report${queryParams}`;

    const result = await FileSystem.downloadAsync(
      apiUrl,
      FileSystem.documentDirectory + filename,
      {
        headers: {
          "MyHeader": "MyValue"
        }
      }
    );

    // Provide a valid mimetype (e.g., 'application/pdf') when calling the save function
    save(result.uri, filename, 'attendance_report/csv');
  };
  const save = async (uri, filename, mimetype) => {
    if (Platform.OS === "android") {
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  
        if (mimetype && typeof mimetype === 'string') {
          try {
            const newUri = await FileSystem.StorageAccessFramework.createFileAsync(
              permissions.directoryUri,
              filename,
              mimetype
            );
  
            // Save the file directly without checking for existing files
            await FileSystem.writeAsStringAsync(newUri, base64, { encoding: FileSystem.EncodingType.Base64 });
            Alert.alert("File Saved", "The file has been saved to the selected folder.");
          } catch (error) {
            console.error("Error while creating and writing the file:", error);
            // Handle the error as needed
          }
        } else {
          console.log("Invalid mimetype or it is null.");
        }
      }
    }
  }; 

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Start Date:</Text>
          <TouchableOpacity onPress={showStartDatePicker}>
            <TextInput
              style={styles.input}
              placeholder="yyyy-MM-dd"
              value={startDate}
              editable={false}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>End Date:</Text>
          <TouchableOpacity onPress={showEndDatePicker}>
            <TextInput
              style={styles.input}
              placeholder="yyyy-MM-dd"
              value={endDate}
              editable={false}
            />
          </TouchableOpacity>
        </View>
      </View>

      {dateError !== "" && <Text style={styles.errorText}>{dateError}</Text>}

      <View style={styles.downloadButtonContainer}>
        <Button
          title={"Download to Device"}
          onPress={downloadFromAPI}
          disabled={!isGenerateButtonActive || loading}
          color="orange"
        />
      </View>

      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={startDatePickerDefaultDate}
      />
      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={endDatePickerDefaultDate}
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
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 8,
  },
  label: {
    fontSize: 18,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginVertical: 8,
    color: "orange",
    textAlign: "center",
  },
  downloadButtonContainer: {
    marginVertical: 1,
    padding: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 8,
  },
});
