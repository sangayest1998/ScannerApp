import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    AsyncStorage.getItem('userId')
      .then((value) => {
        if (value) {
          setUserId(value);
        }
      })
      .catch((error) => {
        console.error('Error retrieving userId:', error);
      });

    AsyncStorage.getItem('access_token') // Use 'access_token' key to retrieve the token
      .then((value) => {
        if (value) {
          setToken(value);
        }
      })
      .catch((error) => {
        console.error('Error retrieving token:', error);
      });
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (isLoading) return;

    setIsLoading(true);
    setScanned(true);

    try {
      const response = await axios.post('https://attendances.desuung.org.bt/api/qr-scan', {
       

      
        cid: userId,
        token: data,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(response.data);

      if (response.data.message) {
        Alert.alert('Success', response.data.message, [
          { text: 'OK', onPress: resetScanner },
        ]);
      } else {
        Alert.alert('Unknown Status', 'An unknown status was returned from the server.', [
          { text: 'OK', onPress: resetScanner },
        ]);
      }
    } catch (error) {
      console.error(error);

      if (error.response && error.response.data && error.response.data.detail) {
        Alert.alert('Error', error.response.data.detail, [
          { text: 'OK', onPress: resetScanner },
        ]);
      } else {
        Alert.alert('Error', 'An error occurred while processing your request.', [
          { text: 'OK', onPress: resetScanner },
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return <Text style={styles.errorText}>No access to camera.</Text>;
  }

  return (
    <View style={styles.container}>
     
     <View style={[styles.cameraContainer, { height: Dimensions.get('window').height }]}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.scanner} // Use a custom style for the scanner
        />

        {isLoading && (
          <ActivityIndicator size="large" color="orange" style={styles.loadingIndicator} />
        )}
      </View>
      <Text style={styles.txt}>Place the QR code inside the frame</Text>
      <View style={styles.cornersContainer}>
        <View style={styles.topLeftCorner} />
        <View style={styles.topRightCorner} />
        <View style={styles.bottomLeftCorner} />
        <View style={styles.bottomRightCorner} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
  },

  cameraContainer: {
    marginTop: 0, // Ensure there is no top margin
    position: 'relative',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    aspectRatio: 1,
  },
  
  cornersContainer: {
    position: 'absolute',
    top: '30%',
    left: '15%',
    width: '70%',
    aspectRatio: 1,
    zIndex: 1,
  
  },

  scanner: {
    flex: 1,
  },
  topLeftCorner: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '15%',
    height: '15%',
    borderTopWidth: 8,
    borderLeftWidth: 8,
    borderColor: '#ff8c00',
  },
  topRightCorner: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '15%',
    height: '15%',
    borderTopWidth: 8,
    borderRightWidth: 8,
    borderColor: '#ff8c00',
  },
  bottomLeftCorner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '15%',
    height: '15%',
    borderBottomWidth: 8,
    borderLeftWidth: 8,
    borderColor: '#ff8c00',
  },
  bottomRightCorner: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '15%',
    height: '15%',
    borderBottomWidth: 8,
    borderRightWidth: 8,
    borderColor: '#ff8c00',
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
  },
  txt: {
    color: '#fff4e6',
    fontSize: 18,
    position:'absolute',
    top:80,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding:15,
    borderRadius:50
  },
});

export default ScanScreen;


