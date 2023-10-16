import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const NotificationsScreen = ({ navigation }) => {
  // Sample notification data for today's check-in or check-out
  const today = new Date();
  const notifications = [
    {
      id: '1',
      text: 'You have a check-in scheduled at 10:00 AM.',
      date: today.getDate(),
      month: today.toLocaleString('default', { month: 'short' }),
      year: today.getFullYear(),
    },
    {
      id: '2',
      text: 'Don\'t forget your check-out at 6:00 PM today.',
      date: today.getDate(),
      month: today.toLocaleString('default', { month: 'short' }),
      year: today.getFullYear(),
    },
    // Add more notification objects as needed
  ];

  // Render individual notification items
  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity style={styles.notificationItem}>
      <Text style={styles.notificationText}>{item.text}</Text>
      <Text style={styles.notificationDate}>{item.date} {item.month} {item.year}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  notificationText: {
    fontSize: 16,
  },
  notificationDate: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
});

export default NotificationsScreen;
