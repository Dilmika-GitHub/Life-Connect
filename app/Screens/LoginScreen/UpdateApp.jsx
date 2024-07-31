import React, { useEffect, useState } from 'react';
import { View, Text, Button, Platform, Alert, StyleSheet,Linking,Image, TouchableOpacity } from 'react-native';
import { checkAppVersion } from '../../services/adminAPIs';

const UpdateApp = () => {
  const [updateInfo, setUpdateInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const appVersion = '1.0.0';

    const fetchUpdateInfo = async () => {
      try {
        const data = await checkAppVersion(appVersion);
        if (data.isinforce === 'Y') {
          setUpdateInfo(data);
        } else {
          Alert.alert('No Updates Available', 'Your app is up to date.');
        }
      } catch (error) {
        console.error("Error fetching update info:", error);
        Alert.alert('Error', 'Failed to check for updates.');
      } finally {
        setLoading(false);
      }
    };

    fetchUpdateInfo();
  }, []);

  const handleUpdatePress = () => {
    const updateUrl = Platform.select({
      ios: 'https://apps.apple.com/us/app/facebook/id284882215', // Replace with your App Store URL
      android: 'https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME' // Replace with your Play Store URL
    });

    if (updateUrl) {
      Linking.openURL(updateUrl).catch(err => {
        console.error('Failed to open URL:', err);
        Alert.alert('Error', 'Failed to open update page.');
      });
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {updateInfo ? (
        <>
          <Text style={styles.title}>Update Available</Text>
          <Image
        source={require('../../../assets/update.png')} 
        style={styles.image}
      />
          <Text style={styles.description}>{updateInfo.versiondesc}</Text>
          <TouchableOpacity onPress={handleUpdatePress} style={styles.updateButton}>
        <Text style={styles.updateButtonText}>Update Now</Text>
      </TouchableOpacity>
        </>
      ) : (
        <Text>Your app is up to date.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor:'#BBFAFF'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  image:{
    width: 300,
    height: 300,
    alignSelf: 'center',
    marginVertical: 20,
  },
  updateButton: {
    backgroundColor: '#08818B',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    width:'50%',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UpdateApp;
