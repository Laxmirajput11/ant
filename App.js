import React, {useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Alert,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  Text,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';

const App = () => {
  const [imageUri, setImageUri] = useState(null);

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera access',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  const openCamera = async type => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Error', 'Camera permission is required to take photos.');
      return;
    }

    console.log(`Opening ${type} camera`); // Debugging line to confirm camera type

    const options = {
      mediaType: 'photo',
      cameraType: type, // 'front' or 'back'
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        Alert.alert('Cancelled', 'You cancelled the image picker.');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', `ImagePicker Error: ${response.errorMessage}`);
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        setImageUri(uri);
      } else {
        console.log('Unknown response from image picker:', response);
        Alert.alert('Error', 'An unknown error occurred.');
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => openCamera('front')}>
        <Text style={styles.buttonText}>Open Front Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => openCamera('back')}>
        <Text style={styles.buttonText}>Open Back Camera</Text>
      </TouchableOpacity>
      {imageUri && <Image source={{uri: imageUri}} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f4f8', // Light background
  },
  button: {
    backgroundColor: '#00796B', // Teal shade
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  image: {
    width: 320,
    height: 320,
    marginTop: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#00796B',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
});

export default App;
