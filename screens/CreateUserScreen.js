import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const CreateUserScreen = () => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder='Enter Your CiD No'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
});

export default CreateUserScreen;
