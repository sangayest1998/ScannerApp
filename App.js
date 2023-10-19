import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen'; // Import your LoginScreen
import TabNavigator from './TabNavigator'; // Import your TabNavigator
import ForgotPasswordScreen from './screens/ForgotPasswordScreen'
import EnterOtp from './screens/EnterOtp'
import ResetPasswordScreen from './screens/ResetPassword';


const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name="Login" component={CoolInput} options={{ headerShown: false }}/> */}
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false}}/>
        <Stack.Screen name="Password" component={ForgotPasswordScreen} options={{ headerShown: false}}/>
        <Stack.Screen name="otp" component={EnterOtp} options={{ headerShown: false}}/>
        <Stack.Screen name="reset" component={ResetPasswordScreen} options={{ headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
