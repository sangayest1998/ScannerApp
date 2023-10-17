// import React, { useState } from "react";
// import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, Linking } from "react-native";
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { format } from 'date-fns';

// const Monthly = () => {
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
//     const formattedDate = format(date, 'yyyy-MM-dd'); // Format to "yyyy-MM-dd"
//     console.log("Formatted Date:", formattedDate); // Log the formatted date

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

//   const generateCsv = async () => {
//     if (dateError) {
//       console.log("Date Error:", dateError); // Log date error
//       Alert.alert("Error", dateError);
//     } else {
//       try {
//         setLoading(true);

//         // Create a query string for the URL parameters
//         const queryParams = `?start_date=${startDate}&end_date=${endDate}`;
//         const apiUrl = `http://202.144.153.106:8000/attendance-report${queryParams}`;

//         const response = await fetch(apiUrl, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         if (response.status === 200) {
//           console.log("CSV Generated successfully!");
//           const csvData = await response.text();
//           setLoading(false);

//           // Use the data URI instead of creating a URL
//           const dataUri = `data:text/csv;charset=utf-8,${encodeURIComponent(csvData)}`;

//           Linking.openURL(dataUri).catch((error) => {
//             console.error("Failed to open CSV: " + error.message);
//           });
//         } else if (response.status === 422) {
//           // Log the response data or error message
//           const responseData = await response.json();
//           console.log("API Error 422:", responseData);
//           Alert.alert(
//             "API Error",
//             "Failed to generate CSV: " + responseData.message
//           );
//           setLoading(false);
//         } else {
//           console.log("API Error:", response.status);
//           Alert.alert("Error", "Failed to generate CSV");
//           setLoading(false);
//         }
//       } catch (error) {
//         console.error("An error occurred:", error);
//         Alert.alert("Error", "An error occurred: " + error.message);
//         setLoading(false);
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

//       <View style={styles.generateButtonContainer}>
//         <Button
//           title={loading ? "Generating..." : "Generate"}
//           onPress={generateCsv}
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
// };

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
//   generateButtonContainer: {
//     marginVertical: 16,
//     padding: 10,
//   },
//   errorText: {
//     color: "red",
//     textAlign: "center",
//     marginVertical: 8,
//   },
// });

// export default Monthly;


import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from 'date-fns';
import * as FileSystem from 'expo-file-system';

const Monthly = () => {
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
    const formattedDate = format(date, 'yyyy-MM-dd'); // Format to "yyyy-MM-dd"
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

  const generateCsv = async () => {
    if (dateError) {
      console.log("Date Error:", dateError);
      Alert.alert("Error", dateError);
    } else {
      try {
        setLoading(true);

        const queryParams = `?start_date=${startDate}&end_date=${endDate}`;
        const apiUrl = `http://192.168.128.8:8000/attendance-report${queryParams}`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          console.log("CSV Generated successfully!");
          const csvData = await response.text();
          setLoading(false);

          const fileName = 'attendance_report.csv';
          const fileUri = FileSystem.documentDirectory + fileName;
          console.log('File path:', fileUri);


          await FileSystem.writeAsStringAsync(fileUri, csvData, {
            encoding: FileSystem.EncodingType.UTF8,
          });

          Alert.alert("Download Complete", "The file has been downloaded to your device's download folder.");
        } else if (response.status === 422) {
          const responseData = await response.json();
          console.log("API Error 422:", responseData);
          Alert.alert("API Error", "Failed to generate CSV: " + responseData.message);
          setLoading(false);
        } else {
          console.log("API Error:", response.status);
          Alert.alert("Error", "Failed to generate CSV");
          setLoading(false);
        }
      } catch (error) {
        console.error("An error occurred:", error);
        Alert.alert("Error", "An error occurred: " + error.message);
        setLoading (false);
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

      <View style={styles.generateButtonContainer}>
        <Button
          title={loading ? "Generating..." : "Generate"}
          onPress={generateCsv}
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
};

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
  generateButtonContainer: {
    marginVertical: 16,
    padding: 10,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginVertical: 8,
  },
});

export default Monthly;

