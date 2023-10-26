import React, { useState, useRef } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function EnterOTPScreen() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  const navigation = useNavigation();
  const route = useRoute();
  const cid = route.params.cid;



const handleOTPEnter = async () => {
  try {
    if (otp.some(digit => digit === '')) {
      // Ensure that all OTP fields are filled
      Alert.alert('Error', 'Please fill in all the OTP fields.');
      return;
    }

    const enteredOTP = otp.join('');

    const response = await fetch(`http://192.168.128.8:8000/enter-otp?cid=${cid}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otp_code: enteredOTP }),
    });

    console.log('Response status:', response.status);
    console.log('Response statusText:', response.statusText);

    if (response.ok) {
      navigation.navigate('reset', { otp: enteredOTP, cid: cid });
    } else {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    }
  } catch (error) {
    console.error('An error occurred while sending the request:', error);
    Alert.alert('Error', 'An error occurred. Please try again later.');
  }
};


  return (
    <>
      <View style={styles.squareBox} />
      <View style={styles.container}>
        <Text style={styles.title}>Email Verification</Text>
        <Text style={styles.title1}>Enter the 6-digit code sent to you</Text>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={inputRefs[index]}
              style={styles.otpInput}
              maxLength={1}
              keyboardType="numeric"
              value={digit}
              onChangeText={(text) => {
                const newOtp = [...otp];
                newOtp[index] = text;
                setOtp(newOtp);

                if (text && index < 5) {
                  inputRefs[index + 1].current.focus();
                } else if (!text && index > 0) {
                  inputRefs[index - 1].current.focus();
                }
              }}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleOTPEnter}>
          <Text style={styles.loginButtonText}>Submit OTP</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  squareBox: {
    width: '100%',
    height: 100,
    backgroundColor: 'orange',
    borderBottomEndRadius: 300,
    marginBottom: 40,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 40,
    color:'#f05e16'
  },
  title1: {
    fontSize: 14,
    color: 'grey',
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  otpInput: {
    borderWidth: 3,
    borderColor: 'orange',
    width: 50,
    height: 50,
    textAlign: 'center',
    margin: 5,
  },
  loginButton: {
    backgroundColor: 'orange',
    padding: 10,
    alignItems: 'center',
    borderRadius: 100,
    marginTop: 40,
    width: '80%',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

