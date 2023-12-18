import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AttendanceReportScreen = () => {
  const [cid, setCid] = useState('');
  const [reportContent, setReportContent] = useState('');
  const [token, setToken] = useState('');
  const [extractedInfo, setExtractedInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getToken();
  }, []);

  const getToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('access_token');
      setToken(storedToken);
    } catch (error) {
      console.error('Error retrieving token from AsyncStorage: ', error);
    }
  };

  const extractAttendanceInfo = (content) => {
    const monthYearRegex = /(January|February|March|April|May|June|July|August|September|October|November|December)\s\d{4}/g;
    const daysPresentRegex = /Total Days Present:\s(\d+)/g;

    const monthYearMatches = Array.from(content.matchAll(monthYearRegex));
    const daysPresentMatches = Array.from(content.matchAll(daysPresentRegex));

    const extractedInfo = [];

    for (let i = 0; i < monthYearMatches.length; i++) {
      const monthYear = monthYearMatches[i][0];
      const daysPresent = daysPresentMatches[i] ? daysPresentMatches[i][1] : 'Data not found';

      extractedInfo.push(`Month-Year: ${monthYear}\nTotal Days Present: ${daysPresent}`);
    }

    return extractedInfo.length > 0 ? extractedInfo.join('\n\n') : 'Information not found';
  };

  const generateReport = async () => {
    try {
      setIsLoading(true); // Set isLoading to true when report generation starts

      const storedToken = await AsyncStorage.getItem('access_token');
      const response = await fetch(`https://attendances.desuung.org.bt/attendance-report/${cid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedToken}`,
        },
      });

      console.log('Response Status:', response.status);

      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }

      const content = await response.text();
      setReportContent(content);
      const extractedInfo = extractAttendanceInfo(content);
      setExtractedInfo(extractedInfo);

      console.log('Extracted Information:', extractedInfo);
    } catch (error) {
      console.error('Fetch Error:', error);
      Alert.alert('Error', 'Failed to fetch report');
    } finally {
      setIsLoading(false); // Ensure isLoading is set to false, regardless of success or error
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter User CID:</Text>
      <TextInput
        style={styles.input}
        placeholder="User CID"
        onChangeText={(text) => setCid(text)}
        value={cid}
      />
     <Button
  title={isLoading ? 'Generating Report...' : 'Generate Report'}
  onPress={generateReport}
  disabled={isLoading || cid.trim() === ''} // Disable the button if CID is empty
/>
      <View style={styles.spinner}>
        {isLoading && <ActivityIndicator size="small" color="#0000ff" />}
      </View>
      {isLoading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          {extractedInfo !== '' && (
            <View style={styles.attendanceInfo}>
              <Text style={styles.infoTitle}>Attendance Info:</Text>
              <Text style={styles.infoText}>{extractedInfo}</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    padding: 5,
    marginVertical: 10,
    width: 200,
  },
  loading: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    marginTop: 20,
    maxHeight: 200,
  },
  attendanceInfo: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  infoTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 18,
  },
  infoText: {
    textAlign: 'center',
  },
  spinner: {
    marginTop: 10,
  },
});

export default AttendanceReportScreen;
