import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { StyleSheet } from 'react-native'; 
import { StatusBar, View } from 'react-native';
import ScanScreen from './screens/ScanScreen';
import ReportScreen from './screens/report/ReportScreen';
import CreateUserScreen from './screens/CreateUserScreen';
import QRCodeGeneratorScreen from './screens/QRCodeGeneratorScreen';
import NotificationScreen from './screens/NotificationScreen';
import ProfileScreen from './screens/ProfileScreen';


const Tab = createBottomTabNavigator();

const headerStyle = {
  backgroundColor: '#ff8c00',
};

const headerTitleStyle = {
  fontSize: 30,
  color: 'white',
};

const headerWithBorderRadius = StyleSheet.create({
  headerStyleWithBorderRadius: {
    backgroundColor: '#ff8c00',
    borderBottomRightRadius: 150, // Adjust the border radius if needed
    height: 100,
  },
});

const tabBarStyle = {
  backgroundColor: '#ff8c00',
  height: 70,
  paddingBottom: 10,
};

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
        tabBarActiveTintColor: '#fff4e6',
        tabBarInactiveTintColor: '#554348',
        headerTitleAlign: 'center',
        tabBarStyle: tabBarStyle,
        tabBarHideOnKeyboard: true,// This line will hide the tab bar behind the keyboard
      }}
    >
      {userRole === 'ADMIN' || userRole === 'HR' || userRole === 'STAFF' ? (
        <>
          <Tab.Screen name="Scan" component={ScanScreen} options={getTabOptions(route, 'ios-barcode', 'Scan')} />
          {userRole === 'ADMIN' && (
            <Tab.Screen
              name="CreateUser"
              component={CreateUserScreen}
              options={getTabOptions(route, 'ios-create', 'Create User')}
            />
          )}
        </>
      ) : null}

      {userRole === 'ADMIN' || userRole === 'HR' ? (
        <Tab.Screen name="Report" component={ReportScreen} options={getTabOptions(route, 'ios-list', 'Report')} />
      ) : null}

{userRole === 'QRGENERATOR' ? (
  <Tab.Screen
    name="QRGenerator"
    component={QRCodeGeneratorScreen}
    options={getTabOptions(route, 'ios-qr-code', 'QR Generator')}
  />
) : null}

{userRole === 'FIELD_GOJAY' ? (
  <Tab.Screen
    name="QRGenerator"
    component={QRCodeGeneratorScreen}
    options={getTabOptions(route, 'ios-qr-code', 'QR Generator')}
  />
) : null}


      {userRole === 'HR' || userRole === 'STAFF' ? (
        <Tab.Screen
          name="Notifications"
          component={NotificationScreen}
          options={getTabOptions(route, 'ios-notifications', 'Notifications')}
        />
      ) : null}

      {userRole === 'ADMIN' || userRole === 'HR' || userRole === 'STAFF' ||userRole=='QRGENERATOR' ||userRole==='FIELD_GOJAY'? (
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
