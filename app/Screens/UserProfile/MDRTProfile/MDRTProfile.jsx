import { Image, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL, ENDPOINTS } from '../../../services/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getAgencyCode = async (setCategoryType, setagencyCode) => {
  try {
    const token = await AsyncStorage.getItem('accessToken'); 
    const email = await AsyncStorage.getItem('email'); 
    const categoryType = await AsyncStorage.getItem('categoryType');
    setCategoryType(categoryType);

    const response = await axios.get(BASE_URL + ENDPOINTS.PROFILE_DETAILS, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        email: email,
        catType: categoryType
      }
    });

    setagencyCode(response.data);

    if (categoryType === "Ag") {
      await AsyncStorage.setItem("agencyCode", response.data?.agent_code);
    } else if (categoryType === "Or") {
      await AsyncStorage.setItem("agencyCode", response.data?.orgnizer_code);
    }

    console.log("called",await AsyncStorage.getItem('agencyCode'));
  } catch (error) {
    console.error('Error Getting Agency Code:', error);
    throw error; 
  }
};

const fetchMdrtPersonalData = async (setData, setLoading, setError) => {
  try {
    const token = await AsyncStorage.getItem('accessToken');
    const agencyCode = await AsyncStorage.getItem('agencyCode');
    const categoryType = await AsyncStorage.getItem('categoryType');
    const year = new Date().getFullYear();

    const response = await axios.get(BASE_URL + ENDPOINTS.MDRT_PROFILE, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        p_agency_1: agencyCode,
        p_agency_2: '0',
        p_cat: categoryType,
        p_year: year
      }
    });

    setData(response.data);
  } catch (error) {
    setError(true);
  } finally {
    setLoading(false);
  }
};

export default function MDRTProfile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [categoryType, setCategoryType] = useState(null);
  const [agencyCode, setagencyCode] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAgencyCode(setCategoryType, setagencyCode);
        await fetchMdrtPersonalData(setData, setLoading, setError);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>Failed to load data.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top section border */}
      <View style={[styles.section, styles.topSection]}></View>

      {/* Bottom section border */}
      <View style={[styles.section, styles.bottomSection]}>
        {/* Grey color square text */}
        <View style={styles.greySquare}>
          <View style={styles.row}>
            <Text style={styles.titleText}>Agent Code</Text>
            <Text style={styles.normalText}>{data.consider_agency}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.titleText}>MDRT Target</Text>
            <Text style={styles.normalText}>{data.mdrt_target || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.titleText}>No of Policies:</Text>
            <Text style={styles.normalText}>{data.nop || "N/A"}</Text>
          </View>
          <View style={styles.specialRow}>
            <Text style={styles.titleText}>MDRT Ranking</Text>
            <Text style={styles.normalText}>{data.mdrt_rank || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.titleText}>Need more</Text>
            <Text style={styles.normalText}>{data.mdrt_balance_due || "N/A"}</Text>
          </View>
          <View style={styles.specialRow}>
            <Text style={styles.titleText}>TOT Ranking</Text>
            <Text style={styles.normalText}>{data.tot_rank || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.titleText}>Need more</Text>
            <Text style={styles.normalText}>{data.tot_target || "N/A"}</Text>
          </View>
          <View style={styles.specialRow}>
            <Text style={styles.titleText}>COT Ranking</Text>
            <Text style={styles.normalText}>{data.cot_rank || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.titleText}>Need more</Text>
            <Text style={styles.normalText}>{data.cot_balance_due || "N/A"}</Text>
          </View>
          <View style={styles.specialRow}>
            <Text style={styles.titleText}>HOF Ranking</Text>
            <Text style={styles.normalText}>{data.hofRanking || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.titleText}>Need more</Text>
            <Text style={styles.normalText}>{data.needMoreHOF || "N/A"}</Text>
          </View>
        </View>
      </View>

      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={require('../../../../components/user.jpg')} 
          style={styles.roundImage}
          resizeMode="cover" 
        />
        <Text style={styles.imageText}>{data.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  section: {
    width: '100%',
  },
  topSection: {
    flex: 1, 
    backgroundColor: '#FEA58F'
  },
  bottomSection: {
    flex: 5, 
    backgroundColor: 'white'
  },
  imageContainer: {
    position: 'absolute',
    left: '50%',
    top: '16%', 
    transform: [{ translateX: -100 }, { translateY: -100 }]
  },
  roundImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3, // Border width for the gold color
    borderColor: 'gold' // Gold color for the border
  },
  imageText: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },
  greySquare: {
    width: 320,
    height: 310,
    backgroundColor: 'lightgrey',
    marginTop: 150, 
    alignSelf: 'center',
    borderRadius: 10,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  specialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  titleText: {
    fontSize: 16,
    color: 'black',
    minWidth: 100,
  },
  normalText: {
    fontSize: 16,
    color: 'grey'
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red'
  },
});
