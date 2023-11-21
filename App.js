// import 'react-native-gesture-handler';
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import LoginScreen from './screens/LoginScreen'; // Import your LoginScreen
// import TabNavigator from './TabNavigator'; // Import your TabNavigator
// import ForgotPasswordScreen from './screens/ForgotPasswordScreen'
// import EnterOtp from './screens/EnterOtp'
// import ResetPasswordScreen from './screens/ResetPassword';

// const Stack = createStackNavigator();

// const App = () => {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {/* <Stack.Screen name="Login" component={CoolInput} options={{ headerShown: false }}/> */}
//         <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
//         <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false}}/>
//         <Stack.Screen name="Password" component={ForgotPasswordScreen} options={{ headerShown: false}}/>
//         <Stack.Screen name="otp" component={EnterOtp} options={{ headerShown: false}}/>
//         <Stack.Screen name="reset" component={ResetPasswordScreen} options={{ headerShown: false}}/>
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default App;


import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation from @react-navigation/native
import LoginScreen from './screens/LoginScreen';
import TabNavigator from './TabNavigator';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import EnterOtp from './screens/EnterOtp';
import ResetPasswordScreen from './screens/ResetPassword';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const AuthCheck = () => {
  const navigation = useNavigation(); // Use useNavigation hook to get the navigation object

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = await AsyncStorage.getItem('access_token');
      if (accessToken) {
        const userRole = await AsyncStorage.getItem('userRole');
        navigation.navigate('Tabs', { userRole });
      } else {
        navigation.navigate('Login');
      }
    };

    checkAuth();
  }, [navigation]); // Add navigation to the dependency array

  return null; // Render nothing because this component is just for authentication check
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="AuthCheck" component={AuthCheck} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Password" component={ForgotPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="otp" component={EnterOtp} options={{ headerShown: false }} />
        <Stack.Screen name="reset" component={ResetPasswordScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
