import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet } from 'react-native'; 
import { StatusBar } from 'react-native';
import ScanScreen from './screens/ScanScreen';
import ReportScreen from './screens/report/ReportScreen';
import CreateUserScreen from './screens/CreateUserScreen';
import QRCodeGeneratorScreen from './screens/QRCodeGeneratorScreen';
import NotificationScreen from './screens/NotificationScreen';
import ProfileScreen from './screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const headerStyle = {
  backgroundColor: 'orange',
};

const headerTitleStyle = {
  fontSize: 30,
  color: 'white',
  
};

const headerWithBorderRadius = StyleSheet.create({
  headerStyleWithBorderRadius: {
    backgroundColor: 'orange',
    // borderBottomLeftRadius: 20, 
    borderBottomRightRadius: 150, 
    height:100
  },
});

const getTabOptions = (route, iconName, label) => ({
  tabBarIcon: ({ focused, size, color }) => (
    <Icon name={focused ? iconName : `${iconName}-outline`} size={size} color={color} />
  ),
  headerStyle: headerWithBorderRadius.headerStyleWithBorderRadius, 
  headerTitleStyle,
  title: label,
});

const TabNavigator = ({ route }) => {
  const userRole = route.params?.userRole;

  StatusBar.setBarStyle('light-content', true);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'orange',
        headerTitleAlign: 'center',
      }}
    >
      {userRole === 'admin' || userRole === 'hr' || userRole === 'staff' ? (
        <>
          <Tab.Screen name="Scan" component={ScanScreen} options={getTabOptions(route, 'ios-barcode', 'Scan')} />
          {userRole === 'admin' && (
            <Tab.Screen
              name="CreateUser"
              component={CreateUserScreen}
              options={getTabOptions(route, 'ios-create', 'Create User')}
            />
          )}
        </>
      ) : null}

      {userRole === 'admin' || userRole === 'hr' ? (
        <Tab.Screen name="Report" component={ReportScreen} options={getTabOptions(route, 'ios-list', 'Report')} />
      ) : null}

      {userRole === 'qrGenerate' ? (
        <Tab.Screen
          name="QRGenerator"
          component={QRCodeGeneratorScreen}
          options={getTabOptions(route, 'ios-qr-code', 'QR Generator')}
        />
      ) : null}

      {userRole === 'hr' || userRole === 'staff' ? (
        <Tab.Screen
          name="Notifications"
          component={NotificationScreen}
          options={getTabOptions(route, 'ios-notifications', 'Notifications')}
        />
      ) : null}

      {userRole === 'admin' || userRole === 'hr' || userRole === 'staff' ? (
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={getTabOptions(route, 'ios-person', 'Profile')}
        />
      ) : null}
    </Tab.Navigator>
  );
};

export default TabNavigator;
