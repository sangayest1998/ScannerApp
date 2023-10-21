import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert ,Dimensions} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('userId')
      .then((value) => {
        if (value) {
          setUserId(value);
        }
      })
      .catch((error) => {
        console.error('Error retrieving userId:', error);
      });
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (isLoading) return;

    setIsLoading(true);
    setScanned(true);

    try {
      const response = await axios.post('http://192.168.128.8:8000/api/qr-scan', 

      // const response = await axios.post('http://202.144.153.106:8000/api/qr-scan', 

      // const response = await axios.post('http://192.168.128.8:8000/api/qr-scan', 
      
      {
        cid: userId,
        token: data,
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
      <Text style={styles.txt}>Place the QR code inside the frame</Text>
      <View style={styles.cameraContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.scanner} // Use a custom style for the scanner
        />
     
      {isLoading && (
        <ActivityIndicator size="large" color="blue" style={styles.loadingIndicator} />
      )}
       </View>
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
    backgroundColor: 'grey',
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
    position: 'relative',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    aspectRatio: 1,
    overflow: 'hidden',
  },
  cornersContainer: {
    position: 'absolute',
    top: '25%',
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
    borderColor: 'orange',
  },
  topRightCorner: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '15%',
    height: '15%',
    borderTopWidth: 8,
    borderRightWidth: 8,
    borderColor: 'orange',
  },
  bottomLeftCorner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '15%',
    height: '15%',
    borderBottomWidth: 8,
    borderLeftWidth: 8,
    borderColor: 'orange',
  },
  bottomRightCorner: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '15%',
    height: '15%',
    borderBottomWidth: 8,
    borderRightWidth: 8,
    borderColor: 'orange',
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
  },
  txt:{
    color:'white',
    fontSize:17,
    marginBottom:30
  }
});

export default ScanScreen;



// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
// import { BarCodeScanner } from 'expo-barcode-scanner';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const ScanScreen = () => {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [scanned, setScanned] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [userId, setUserId] = useState('');

//   useEffect(() => {
//     (async () => {
//       const { status } = await BarCodeScanner.requestPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

//   useEffect(() => {
//     AsyncStorage.getItem('userId')
//       .then((value) => {
//         if (value) {
//           setUserId(value);
//         }
//       })
//       .catch((error) => {
//         console.error('Error retrieving userId:', error);
//       });
//   }, []);

//   const handleBarCodeScanned = async ({ type, data }) => {
//     if (isLoading) return;

//     setIsLoading(true);
//     setScanned(true);

//     try {
//       const response = await axios.post('http://192.168.0.119:8000/api/qr-scan', {
//         cid: userId,
//         token: data,
//       });

//       console.log(response.data);

//       if (response.data.message) {
//         Alert.alert('Success', response.data.message, [
//           { text: 'OK', onPress: resetScanner },
//         ]);
//       } else {
//         Alert.alert('Unknown Status', 'An unknown status was returned from the server.', [
//           { text: 'OK', onPress: resetScanner },
//         ]);
//       }
//     } catch (error) {
//       console.error(error);

//       if (error.response && error.response.data && error.response.data.detail) {
//         Alert.alert('Error', error.response.data.detail, [
//           { text: 'OK', onPress: resetScanner },
//         ]);
//       } else {
//         Alert.alert('Error', 'An error occurred while processing your request.', [
//           { text: 'OK', onPress: resetScanner },
//         ]);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resetScanner = () => {
//     setScanned(false);
//   };

//   if (hasPermission === null) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" color="blue" />
//         <Text>Requesting camera permission...</Text>
//       </View>
//     );
//   }
//   if (hasPermission === false) {
//     return <Text style={styles.errorText}>No access to camera.</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.txt}>Place the QR code inside the frame</Text>
//       <View style={styles.cameraWindow}>
//         <BarCodeScanner
//           onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//           style={styles.scanner} // Use a custom style for the scanner
//         />
//       </View>
//       {isLoading && (
//         <ActivityIndicator size="large" color="blue" style={styles.loadingIndicator} />
//       )}
//     </View>
    
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor:'grey'
//   },
//   errorText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: 'red',
//   },
//   loadingIndicator: {
//     position: 'absolute',
//     top: '50%',
//     left: 0,
//     right: 0,
//   },
//   cameraWindow: {
//     width: '75%',
//     aspectRatio: 1, // This will make the camera feed fit perfectly into the square
//     borderRadius: 20,
//     overflow: 'hidden',
//     marginBottom: 30,
//     borderWidth: 5,
//     borderColor: 'orange',
//   },
//   scanner: {
//     height: 379,
//   },
//   txt:{
//     color:'white',
//     fontSize:17,
//     marginBottom:30
//   }
// });

// export default ScanScreen;


