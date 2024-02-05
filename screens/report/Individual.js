import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, ActivityIndicator,TouchableOpacity } from 'react-native';
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
  
      extractedInfo.push(
        <Text key={i}>
          <Text style={{ fontWeight: 'bold' }}>Month-Year:</Text> {monthYear}
          {'\n'}
          <Text style={{ fontWeight: 'bold' }}>Total Days Present:</Text> {daysPresent}
          {'\n'}
          {'\n'}
        </Text>
      );
    }
  
    return extractedInfo.length > 0 ? extractedInfo : 'ཡིག་ཆ་མིན་འདུག།།';
  };
  

  const generateReport = async () => {
    try {
      setIsLoading(true); // Set isLoading to true when report generation starts

      const storedToken = await AsyncStorage.getItem('access_token');
      const response = await fetch(`https://attendance.desuung.org.bt/attendance-report/${cid}`, {
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

  // button custom
  const MyButton = ({ onPress, title, disabled }) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: disabled ? 'gray' : 'orange',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        opacity: disabled ? 0.6 : 1,
      }}
      disabled={disabled}
    >
      <Text style={{ color: 'white' }}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ ...styles.container, borderColor: 'orange', borderWidth: 2, padding: 10,marginTop:30 }}>
      <Text style={styles.label}>Enter User CID:</Text>
      <TextInput
        style={styles.input}
        placeholder="མི་ཁུངས་ལག་ཁྱེར་ཨང་བཙུགས་གནང་།།"
        onChangeText={(text) => setCid(text)}
        value={cid}
        keyboardType="numeric"
      />
      <MyButton
        title={isLoading ? 'Generating Report...' : 'Generate Report'}
        onPress={generateReport}
        disabled={isLoading}
      />
      <View style={styles.spinner}>
        {isLoading && <ActivityIndicator size="small" color="orange" />}
      </View>
      {isLoading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          {extractedInfo !== '' && (
            <View style={styles.attendanceInfo}>
              <Text style={styles.infoTitle}>Attendance Info:</Text>
              <View style={styles.horizontalLine} />
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', 
    borderRadius: 10, 
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 5,
    width: '100%', 
  },
  spinner: {
    marginTop: 10,
  },
  loading: {
    marginTop: 10,
    fontSize: 16,
    color: 'orange',
  },
  scrollView: {
    width: '100%', 
   marginTop: 10,
    maxHeight: 400,
  },
  attendanceInfo: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'orange',
    borderRadius: 5,
 
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  textAlign:'center'
  },
  infoText: {
    fontSize: 16,
  },
  horizontalLine: {
    borderBottomColor: 'orange',
    borderBottomWidth: 2,
    marginBottom:20 
  },
});

export default AttendanceReportScreen;
