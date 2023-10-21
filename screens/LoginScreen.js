import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

//  const BASE_URL = 'http://192.168.0.119:8000'; // Update with your FastAPI server URL

const BASE_URL = 'http://192.168.128.8:8000'; 

// const BASE_URL = 'http://202.144.153.106:8000'; 


const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const [CID, setCID] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation();

  const handleCIDChange = (text) => {
    setCID(text);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    if (isLoading) {
      return;
    }

    const showAlert = (message) => {
      Alert.alert('Error', message, [{ text: 'OK' }], { cancelable: true });
    };

    try {
      setIsLoading(true);
      // Dismiss the keyboard to prevent further input
      Keyboard.dismiss();

      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        },
        body: `username=${CID}&password=${password}`,
      });

      if (response.ok) {
        const responseData = await response.json();

        // Check if both access_token and userRole are present in the response
        if (responseData.access_token && responseData.userRole) {
          await AsyncStorage.setItem('access_token', responseData.access_token);
          console.log('User Role:', responseData.userRole);
          await AsyncStorage.setItem('userRole', responseData.userRole);

          await AsyncStorage.setItem('userId', CID);

          if (responseData.redirect_url) {
            navigation.navigate('Tabs', { userRole: responseData.userRole });
          } else {
            navigation.navigate('Login');
          }
        } else {
          showAlert('Access token or user role is missing');
        }
      } else {
        const errorMessage = await response.text();
        showAlert(errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      showAlert('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Navigate to the ForgotPasswordScreen when the "Forgot Password?" link is clicked.
    if (!isLoading) {
      navigation.navigate('Password');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200} // Adjust as needed
      >
        <StatusBar style="auto" />

        <View style={styles.squareBox} />
        <View style={styles.logoContainer}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
        </View>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Identity Card Number"
            onChangeText={handleCIDChange}
            value={CID}
            keyboardType="numeric"
            editable={!isLoading}
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              onChangeText={(text) => setPassword(text)}
              value={password}
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
              <Text style={styles.eyeIconText}>{showPassword ? '👁' : '🔒'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleForgotPassword}
            style={[styles.forgotPassword, isLoading ? styles.disabledLink : null]}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {isLoading ? (
            <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
          ) : (
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.squareBox1, isKeyboardVisible ? { display: 'none' } : null]}>
        <View style={styles.squareBox1} />
        <View style={styles.footer}>
          <Text style={styles.designDevelopText}>
            Welcome to{"\n"}
            <Text style={styles.designDevelopAuthor}>
              Desuung Attendance Scanner App
            </Text>
          </Text>
        </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  squareBox: {
    width: '100%',
    height: height * 0.12,
    backgroundColor: 'orange',
    marginBottom: 60,
    borderBottomEndRadius: 300,
  },

  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: width * 0.5, // Adjust width as a percentage of the screen width
    height: height * 0.18, // Adjust height as a percentage of the screen height
    resizeMode: 'contain',
    marginVertical: height * 0.02,
  },
  formContainer: {
    flex: 1,
    width: '80%',
  },
  input: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
  },
  eyeIconText: {
    fontSize: 24,
  },
  loginButton: {
    backgroundColor: 'orange',
    padding: 10,
    alignItems: 'center',
    borderRadius: 100,
    marginTop: 10,
    marginBottom: 170,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  loader: {
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center', // Center the error message
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
  },
  designDevelopText: {
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    color:'#fff'
  },
  forgotPassword: {
    alignSelf: 'center',
    marginBottom: 50,
    
  },
  forgotPasswordText: {
    color: '#4267B2',
    fontSize: 15,
  },

  disabledLink: {
    opacity: 0.5, // Reduce opacity when the link is disabled
  },

  squareBox1: {
    position: 'relitive',
    alignItems:'center',
    justifyContent:'center',
    width: '100%', 
    height: 100,
    backgroundColor: 'orange', 
    borderTopStartRadius:400,
  },
});

export default LoginScreen;
   
