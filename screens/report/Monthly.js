import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const Example = () => {
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
    const formattedDate = date.toLocaleDateString();
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

  const generateCsv = () => {
    if (dateError) {
      // You can handle the error here, or you can add your logic for generating CSV
    } else {
      // Implement your logic to generate the CSV based on the selected dates
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
              placeholder="(MM/YYYY)"
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
              placeholder="(MM/YYYY)"
              value={endDate}
              editable={false}
            />
          </TouchableOpacity>
        </View>
      </View>

      {dateError !== "" && <Text style={styles.errorText}>{dateError}</Text>}

      <View style={styles.generateButtonContainer}>
        <Button
          title="Generate"
          onPress={generateCsv}
          disabled={!isGenerateButtonActive}
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
    marginVertical: 8, // Add margin to separate from the button
  },
});

export default Example;