// import React, { useState } from 'react';
// import { StyleSheet, Button, View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { format } from 'date-fns';
// import * as FileSystem from 'expo-file-system';

// export default function App() {
//   const [selectedStartDate, setSelectedStartDate] = useState(false);
//   const [selectedEndDate, setSelectedEndDate] = useState(false);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
//   const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
//   const [startDatePickerDefaultDate, setStartDatePickerDefaultDate] = useState(
//     new Date()
//   );
//   const [endDatePickerDefaultDate, setEndDatePickerDefaultDate] = useState(
//     new Date()
//   );
//   const [dateError, setDateError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const showStartDatePicker = () => {
//     setSelectedStartDate(true);
//     setSelectedEndDate(false);
//     setStartDatePickerVisible(true);
//     setEndDatePickerVisible(false);
//   };

//   const showEndDatePicker = () => {
//     setSelectedStartDate(false);
//     setSelectedEndDate(true);
//     setStartDatePickerVisible(false);
//     setEndDatePickerVisible(true);
//   };

//   const hideDatePicker = () => {
//     setStartDatePickerVisible(false);
//     setEndDatePickerVisible(false);
//   };

//   const handleConfirm = (date) => {
//     const formattedDate = format(date, 'yyyy-MM-dd'); // Format to "yyyy-MM-dd";
//     console.log("Formatted Date:", formattedDate);

//     if (selectedStartDate) {
//       setStartDate(formattedDate);
//       setStartDatePickerDefaultDate(date);
//       if (new Date(date) > new Date(endDatePickerDefaultDate)) {
//         setEndDate(formattedDate);
//         setEndDatePickerDefaultDate(date);
//         setDateError("");
//       }
//     } else if (selectedEndDate) {
//       if (new Date(date) >= new Date(startDatePickerDefaultDate)) {
//         setEndDate(formattedDate);
//         setEndDatePickerDefaultDate(date);
//         setDateError("");
//       } else {
//         setDateError(
//           "End date should always be greater than or equal to the start date."
//         );
//       }
//     }
//     hideDatePicker();
//   };

//   const isGenerateButtonActive = startDate && endDate;

//   const downloadFromAPI = async () => {
//     const filename = `attendance_report_${startDate}_${endDate}.csv`;
//     const queryParams = `?start_date=${startDate}&end_date=${endDate}`;
//     // const apiUrl = `http://192.168.0.119:8000/attendance-report${queryParams}`;
//     const apiUrl = `http://192.168.128.8:8000/attendance-report${queryParams}`;


//     const result = await FileSystem.downloadAsync(
//       apiUrl,
//       FileSystem.documentDirectory + filename,
//       {
//         headers: {
//           "MyHeader": "MyValue"
//         }
//       }
//     );

//     // Provide a valid mimetype (e.g., 'application/pdf') when calling the save function
//     save(result.uri, filename, 'attendance_report/csv');
//   };
//   const save = async (uri, filename, mimetype) => {
//     try {
//       const fileUri = FileSystem.documentDirectory + filename;
      
//       if (Platform.OS === 'ios') {
//         // On iOS, we can directly save the file to the document directory
//         await FileSystem.copyAsync({ from: uri, to: fileUri });
//       } else if (Platform.OS === 'android') {
//         // On Android, you can use the StorageAccessFramework
//         const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
//         if (permissions.granted) {
//           const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
//           if (mimetype && typeof mimetype === 'string') {
//             try {
//               const newUri = await FileSystem.StorageAccessFramework.createFileAsync(
//                 permissions.directoryUri,
//                 filename,
//                 mimetype
//               );
//               await FileSystem.writeAsStringAsync(newUri, base64, { encoding: FileSystem.EncodingType.Base64 });
//             } catch (error) {
//               console.error("Error while creating and writing the file:", error);
//               // Handle the error as needed
//             }
//           } else {
//             console.log("Invalid mimetype or it is null.");
//           }
//         }
//       }
      
//       Alert.alert("File Saved", "The file has been saved to the selected folder.");
//     } catch (error) {
//       console.error("Error while saving the file:", error);
//       // Handle the error as needed
//     }
//   };
  

//   return (
//     <View style={styles.container}>
//       <View style={styles.inputRow}>
//         <View style={styles.inputWrapper}>
//           <Text style={styles.label}>Start Date:</Text>
//           <TouchableOpacity onPress={showStartDatePicker}>
//             <TextInput
//               style={styles.input}
//               placeholder="yyyy-MM-dd"
//               value={startDate}
//               editable={false}
//             />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.inputWrapper}>
//           <Text style={styles.label}>End Date:</Text>
//           <TouchableOpacity onPress={showEndDatePicker}>
//             <TextInput
//               style={styles.input}
//               placeholder="yyyy-MM-dd"
//               value={endDate}
//               editable={false}
//             />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {dateError !== "" && <Text style={styles.errorText}>{dateError}</Text>}

//       <View style={styles.downloadButtonContainer}>
//         <Button
//           title={"Download to Device"}
//           onPress={downloadFromAPI}
//           disabled={!isGenerateButtonActive || loading}
//           color="orange"
//         />
//       </View>

//       <DateTimePickerModal
//         isVisible={isStartDatePickerVisible}
//         mode="date"
//         onConfirm={handleConfirm}
//         onCancel={hideDatePicker}
//         date={startDatePickerDefaultDate}
//       />
//       <DateTimePickerModal
//         isVisible={isEndDatePickerVisible}
//         mode="date"
//         onConfirm={handleConfirm}
//         onCancel={hideDatePicker}
//         date={endDatePickerDefaultDate}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//   },
//   inputRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//   },
//   inputWrapper: {
//     flex: 1,
//     marginHorizontal: 8,
//   },
//   label: {
//     fontSize: 18,
//     textAlign: "center",
//   },
//   input: {
//     width: "100%",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 8,
//     marginVertical: 8,
//     color: "orange",
//     textAlign: "center",
//   },
//   downloadButtonContainer: {
//     marginVertical: 1,
//     padding: 10,
//   },
//   errorText: {
//     color: "red",
//     textAlign: "center",
//     marginVertical: 8,
//   },
// });

// import React, { useState } from 'react';
// import { StyleSheet, Button, View, Text, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { format } from 'date-fns';
// import * as FileSystem from 'expo-file-system';

// export default function App() {
//   const [selectedStartDate, setSelectedStartDate] = useState(false);
//   const [selectedEndDate, setSelectedEndDate] = useState(false);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
//   const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);
//   const [startDatePickerDefaultDate, setStartDatePickerDefaultDate] = useState(
//     new Date()
//   );
//   const [endDatePickerDefaultDate, setEndDatePickerDefaultDate] = useState(
//     new Date()
//   );
//   const [dateError, setDateError] = useState("");

//   const showStartDatePicker = () => {
//     setSelectedStartDate(true);
//     setSelectedEndDate(false);
//     setStartDatePickerVisible(true);
//     setEndDatePickerVisible(false);
//   };

//   const showEndDatePicker = () => {
//     setSelectedStartDate(false);
//     setSelectedEndDate(true);
//     setStartDatePickerVisible(false);
//     setEndDatePickerVisible(true);
//   };

//   const hideDatePicker = () => {
//     setStartDatePickerVisible(false);
//     setEndDatePickerVisible(false);
//   };

//   const handleConfirm = (date) => {
//     const formattedDate = format(date, 'yyyy-MM-dd'); // Format to "yyyy-MM-dd";
//     console.log("Formatted Date:", formattedDate);

//     if (selectedStartDate) {
//       setStartDate(formattedDate);
//       setStartDatePickerDefaultDate(date);
//       if (new Date(date) > new Date(endDatePickerDefaultDate)) {
//         setEndDate(formattedDate);
//         setEndDatePickerDefaultDate(date);
//         setDateError("");
//       }
//     } else if (selectedEndDate) {
//       if (new Date(date) >= new Date(startDatePickerDefaultDate)) {
//         setEndDate(formattedDate);
//         setEndDatePickerDefaultDate(date);
//         setDateError("");
//       } else {
//         setDateError(
//           "End date should always be greater than or equal to the start date."
//         );
//       }
//     }
//     hideDatePicker();
//   };

//   const isGenerateButtonActive = startDate && endDate;

//   const downloadFromAPI = async () => {
//     const filename = `attendance_report_${startDate}_${endDate}.csv`;
//     const queryParams = `?start_date=${startDate}&end_date=${endDate}`;
//     const apiUrl = `http://192.168.0.119:8000/attendance-report${queryParams}`;

//     try {
//       const result = await FileSystem.downloadAsync(
//         apiUrl,
//         FileSystem.documentDirectory + filename,
//         {
//           headers: {
//             "MyHeader": "MyValue"
//           }
//         }
//       );

//       await save(result.uri, filename, 'attendance_report/csv');
//     } catch (error) {
//       console.error("Error while downloading the file:", error);
//       Alert.alert("Download Error", "There was an error while downloading the file.");
//     }
//   };

//   const save = async (uri, filename, mimetype) => {
//     try {
//       const fileUri = FileSystem.documentDirectory + filename;
  
//       if (Platform.OS === 'ios') {
//         await FileSystem.copyAsync({ from: uri, to: fileUri });
//         Alert.alert('File Saved', `The file has been saved to the document folder. Mime type: ${mimetype}`);
//       } else if (Platform.OS === 'android') {
//         await androidSave(uri, filename, mimetype);
//       }
//     } catch (error) {
//       console.error("Error while saving the file:", error);
//       Alert.alert("Save Error", "There was an error while saving the file.");
//     }
//   };

//   const androidSave = async (uri, filename, mimetype) => {
//     const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
//     if (permissions.granted) {
//       const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
//       if (mimetype && typeof mimetype === 'string') {
//         const newUri = await FileSystem.StorageAccessFramework.createFileAsync(
//           permissions.directoryUri,
//           filename,
//           mimetype
//         );
//         await FileSystem.writeAsStringAsync(newUri, base64, { encoding: FileSystem.EncodingType.Base64 });
//         Alert.alert("File Saved", "The file has been saved to the selected folder.");
//       } else {
//         console.log("Invalid mimetype or it is null.");
//         Alert.alert("Save Error", "Invalid mimetype or mimetype is null.");
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.inputRow}>
//         <View style={styles.inputWrapper}>
//           <Text style={styles.label}>Start Date:</Text>
//           <TouchableOpacity onPress={showStartDatePicker}>
//             <TextInput
//               style={styles.input}
//               placeholder="yyyy-MM-dd"
//               value={startDate}
//               editable={false}
//             />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.inputWrapper}>
//           <Text style={styles.label}>End Date:</Text>
//           <TouchableOpacity onPress={showEndDatePicker}>
//             <TextInput
//               style={styles.input}
//               placeholder="yyyy-MM-dd"
//               value={endDate}
//               editable={false}
//             />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {dateError !== "" && <Text style={styles.errorText}>{dateError}</Text>}

//       <View style={styles.downloadButtonContainer}>
//         <Button
//           title={"Download to Device"}
//           onPress={downloadFromAPI}
//           disabled={!isGenerateButtonActive}
//           color="orange"
//         />
//       </View>

//       <DateTimePickerModal
//         isVisible={isStartDatePickerVisible}
//         mode="date"
//         onConfirm={handleConfirm}
//         onCancel={hideDatePicker}
//         date={startDatePickerDefaultDate}
//       />
//       <DateTimePickerModal
//         isVisible={isEndDatePickerVisible}
//         mode="date"
//         onConfirm={handleConfirm}
//         onCancel={hideDatePicker}
//         date={endDatePickerDefaultDate}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 16,
//   },
//   inputRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     width: "100%",
//   },
//   inputWrapper: {
//     flex: 1,
//     marginHorizontal: 8,
//   },
//   label: {
//     fontSize: 18,
//     textAlign: "center",
//   },
//   input: {
//     width: "100%",
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 8,
//     marginVertical: 8,
//     color: "orange",
//     textAlign: "center",
//   },
//   downloadButtonContainer: {
//     marginVertical: 1,
//     padding: 10,
//   },
//   errorText: {
//     color: "red",
//     textAlign: "center",
//     marginVertical: 8,
//   },
// });



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
    const apiUrl = `http://192.168.0.119:8000/attendance-report${queryParams}`;

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
