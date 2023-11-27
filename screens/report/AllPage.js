import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';

const AllPage = () => {


  const handleDownload = async () => {
    const url = 'URL_OF_YOUR_FILE_TO_DOWNLOAD';

    try {
      const downloadObject = FileSystem.createDownloadResumable(url, `${FileSystem.documentDirectory}downloadedFile.ext`);
      const { uri } = await downloadObject.downloadAsync();

      console.log('File downloaded to:', uri);
      Alert.alert('File downloaded successfully', `File saved at: ${uri}`);
    } catch (error) {
      console.error('Error downloading file:', error);
      Alert.alert('Error', 'File download failed');
    }
  };

  return (
    <View>
    
      {/* Button to download a file with orange color style */}
      <TouchableOpacity onPress={handleDownload} style={styles.downloadButton}>
        <Text style={styles.buttonText}>Download File</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  downloadButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 100,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AllPage;
