import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Ionicons,
  MaterialCommunityIcons,
  Zocial,
  Entypo,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
} from "@expo/vector-icons";

const USER_DATA_BASE_URL = 'https://dhqscanner.desuung.org.bt:8443/profile';
const PROFILE_IMAGE_BASE_URL = 'https://dhqscanner.desuung.org.bt:8443/update/profile-picture';
const PROFILE_PICTURE_BASE_URL = 'https://dhqscanner.desuung.org.bt:8443/get/profile-picture';

const ProfileScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState({
    name: '',
    department: '',
    contact: '',
    cid: '',
    did: '',
    email: '',
    profile_picture_url: '',
  });
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    getPermission();
    fetchUserData();
  }, []);

  const getPermission = async () => {
    const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (galleryStatus.status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Please grant permission to access the gallery to upload a profile picture.'
      );
    }
  };

  const fetchUserData = async () => {
    try {
      const access_token = await AsyncStorage.getItem('access_token');
      const profileImageUrl = await AsyncStorage.getItem('profile_picture_url'); // Get the stored URL

      const response = await fetch(USER_DATA_BASE_URL, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        if (profileImageUrl) {
          setImage(profileImageUrl);
        }

        setUserData(data);
      } else {
        const responseText = await response.text();
        console.error(
          'Failed to fetch user data:',
          response.status,
          response.statusText,
          responseText
        );
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const pickImage = async () => {
    try {
      const access_token = await AsyncStorage.getItem('access_token');
      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (galleryStatus.status !== 'granted') {
        throw new Error('Permission to access the gallery is required.');
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (result.canceled) {
        return;
      }

      const formData = new FormData();
      formData.append('file', {
        uri: result.assets[0].uri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      });

      const response = await fetch(PROFILE_IMAGE_BASE_URL, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        const imageURL = await response.json();
        const imageToken = imageURL.url.replace('/static/images/', '');
        const imageUrl = `${PROFILE_PICTURE_BASE_URL}/${imageToken}`;
        setImage(imageUrl);
        setImageError(false);

        await AsyncStorage.setItem('profile_picture_url', imageUrl); // Store updated URL

        fetchUserData();
      } else {
        const responseText = await response.text();
        console.error(
          'Failed to upload profile picture:',
          response.status,
          response.statusText,
          responseText
        );
        setImageError(true);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error.message);
      setImageError(true);
    }
  };

  const handleLogout = async () => {
    try {
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={pickImage}>
          <View style={styles.imageContainer}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={styles.profileImage}
                onError={() => {
                  console.error('Image loading error:', image);
                  setImageError(true);
                }}
              />
            ) : (
              <Image
                source={require('../assets/c.png')}
                style={styles.placeholderImage}
              />
            )}
          </View>
        </TouchableOpacity>
        {imageError && (
          <Text style={styles.errorMessage}>Error loading image</Text>
        )}
      </View>

      <View style={styles.userInfoContainer}>
        <View style={styles.userInfoRow}>
          <Ionicons name="ios-person-circle" size={24} color="orange" style={styles.icon} />
          <Text style={styles.staticLabel}>Name:</Text>
          <TextInput
            style={styles.userInfoInput}
            value={userData.name}
            editable={false}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.userInfoRow}>
          <MaterialCommunityIcons name="clipboard-account" size={24} color="orange" style={styles.icon} />
          <Text style={styles.staticLabel}>DID:</Text>
          <TextInput
            style={styles.userInfoInput}
            value={userData.did}
            editable={false}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.userInfoRow}>
          <Entypo name="v-card" size={24} color="orange" style={styles.icon} />
          <Text style={styles.staticLabel}>CID:</Text>
          <TextInput
            style={styles.userInfoInput}
            value={userData.cid.toString()}
            editable={false}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.userInfoRow}>
          <Zocial name="email" size={24} color="orange" style={styles.icon} />
          <Text style={styles.staticLabel}>Email:</Text>
          <TextInput
            style={styles.userInfoInput}
            value={userData.email}
            editable={false}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.userInfoRow}>
          <MaterialIcons name="sim-card" size={24} color="orange" style={styles.icon} />
          <Text style={styles.staticLabel}>Contact:</Text>
          <TextInput
            style={styles.userInfoInput}
            value={userData.contact.toString()}
            editable={false}
            underlineColorAndroid="transparent"
          />
        </View>
        <View style={styles.userInfoRow}>
          <FontAwesome name="group" size={24} color="orange" style={styles.icon} />
          <Text style={styles.staticLabel}>Department:</Text>
          <TextInput
            style={styles.userInfoInput}
            value={userData.department}
            editable={false}
            underlineColorAndroid="transparent"
          />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileContainer: {
    alignItems: 'center',
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'orange',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: 'orange',
  },
  placeholderImage: {
    width: 100,
    height: 100,
  },
  userInfoContainer: {
    marginTop: 20,
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: 'orange',
    borderRadius: 100,
    padding: 10,
    width: '90%',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    marginLeft: 0,
  },
  userInfoInput: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 0,
    borderColor: 'transparent',
    color: 'grey',
    paddingLeft: 6,
  },
  staticLabel: {
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 18,
    paddingLeft: 60,
  },
});

export default ProfileScreen;
