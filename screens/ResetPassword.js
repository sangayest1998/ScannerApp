import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function ResetPasswordScreen() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const navigation = useNavigation();
  const route = useRoute();
  const otp = route.params?.otp || '';

  const handleResetPassword = async () => {
    if (newPassword === confirmPassword) {
      if (newPassword.length < 8) {
        Alert.alert('Error', 'Password should be at least 8 characters long.');
        return;
      }

      setIsLoading(true);

      const resetData = {
        otp_code: otp,
        new_password: newPassword,
        confirm_password: confirmPassword,
      };

      try {
        console.log('Sending reset request:', resetData);

        const response = await fetch('http://192.168.0.119:8000/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(resetData),
        });

        console.log('Response status:', response.status);
        console.log('Response statusText:', response.statusText);

        if (response.ok) {
          Alert.alert('Password reset was successful.');
          // Navigate to the login screen upon successful reset
          navigation.navigate('Login');
        } else {
          const responseData = await response.json();
          console.log('Reset password error:', responseData);
          Alert.alert('Error', responseData.detail || 'Failed to reset password. Please try again.');
        }
      } catch (error) {
        console.error('An error occurred while sending the request:', error);
        Alert.alert('Error', 'An error occurred. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    } else {
      Alert.alert('Error', 'Passwords do not match. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.squareBox} />
      <Text style={styles.title}>Reset Password</Text>

      <View style={styles.passwordContainer}>
        <TextInput
          value={newPassword}
          onChangeText={text => setNewPassword(text)}
          placeholder="New Password (min 8 characters)"
          secureTextEntry={!showPassword}
          editable={!isLoading}
          style={styles.passwordInput}
        />
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Text style={styles.eyeIconText}>{showPassword ? '👁' : '🔒'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.passwordContainer}>
        <TextInput
          value={confirmPassword}
          onChangeText={text => setConfirmPassword(text)}
          placeholder="Confirm Password"
          secureTextEntry={!showConfirmPassword}
          editable={!isLoading}
          style={styles.passwordInput}
        />
        <TouchableOpacity onPress={toggleConfirmPasswordVisibility} style={styles.eyeIcon}>
          <Text style={styles.eyeIconText}>{showConfirmPassword ? '👁' : '🔒'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleResetPassword} disabled={isLoading}>
        <Text style={styles.loginButtonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  squareBox: {
    width: '100%',
    height: 100,
    backgroundColor: 'orange',
    borderBottomEndRadius: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 40,
    fontWeight: 'bold',
    color: '#f05e16',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5B4',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    width: '80%',
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    position: 'absolute',
    right: 8,
  },
  eyeIconText: {
    fontSize: 24,
  },
  loginButton: {
    backgroundColor: '#ffb347',
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
