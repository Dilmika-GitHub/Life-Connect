import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { checkMaintenance } from '../../services/adminAPIs';

const MaintenanceScreen = () => {
  const [maintenanceInfo, setMaintenanceInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchMaintenanceInfo = async () => {
      try {
        const data = await checkMaintenance();
        if (data.isinforce === 'Y') {
          setMaintenanceInfo(data);
        }
      } catch (error) {
        console.error("Error fetching maintenance info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceInfo();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/maintenance.png')}
        style={styles.image}
      />
      <Text style={styles.title}>Hang on!</Text>
      <Text style={styles.subtitle}>We are under maintenance</Text>
      <Text style={styles.message}>
      {maintenanceInfo.main_desc}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#BBFAFF',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default MaintenanceScreen;
