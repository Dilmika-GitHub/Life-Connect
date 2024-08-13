import React from 'react';
import { View, Text, StyleSheet, Linking, Alert, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/FontAwesome';

const PolicyDetailsModal = ({ isVisible, onClose, policy }) => {
    if (!policy) {
      return null;
    }

    // Format the contact number as needed (this logic can be moved to a utility function)
  const formatPhoneNumber = (phoneNumber) => {
    if (phoneNumber.startsWith('0') && phoneNumber.length === 10) {
      return `94${phoneNumber.slice(1)}`;
    }
    return phoneNumber;
  };

  const formattedContact = policy.mobile_phone ? formatPhoneNumber(policy.mobile_phone) : 'N/A';


  const handleContactPress = async (contact) => {
    const url = `tel:${contact}`;
    if (await Linking.canOpenURL(url)) {
      Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Unable to make a call to this number.');
    }
  };

  const handleWhatsAppPress = (contact) => {
    let url = `whatsapp://send?phone=${contact}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'WhatsApp not installed or invalid contact number.');
    });
  };

  const handleEmailPress = async (email) => {
    const url = `mailto:${email}`;
    if (await Linking.canOpenURL(url)) {
      Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Unable to send email.');
    }
  };

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} backdropOpacity={0.2}>
      <View style={styles.modalContent}>
        <View style={styles.header}>
          <Text style={styles.modalTitle}>{policy.product_name}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.modalRow}>
          <Text style={styles.modalLabel}>Policy No.</Text>
          <Text style={styles.modalText}>{policy.policy_no}</Text>
        </View>
        <View style={styles.modalRow}>
          <Text style={styles.modalLabel}>Insured Name</Text>
          <Text style={styles.modalText}>{policy.customer_name}</Text>
        </View>
        <View style={styles.modalRow}>
          <Text style={styles.modalLabel}>Policy Status</Text>
          <Text style={styles.modalText}>{policy.current_policy_status}</Text>
        </View>
        <View style={styles.modalRow}>
          <Text style={styles.modalLabel}>Sum Assured</Text>
          <Text style={styles.modalText}>{policy.sa? `Rs. ${new Intl.NumberFormat().format(policy.sa)}` : 'N/A'}</Text>
        </View>
        <View style={styles.modalRow}>
          <Text style={styles.modalLabel}>Maturity Date</Text>
          <Text style={styles.modalText}>{policy.maturity_date}</Text>
        </View>
        <View style={styles.modalRow}>
          <Text style={styles.modalLabel}>Status</Text>
          <Text style={styles.modalText}>{policy.status}</Text>
        </View>
        <View style={styles.modalRow}>
          <Text style={styles.modalLabel}>Gross Amount</Text>
          <Text style={styles.modalText}>{policy.gross_amount? `Rs. ${new Intl.NumberFormat().format(policy.gross_amount)}` : 'N/A'}</Text>
        </View>
        <View style={styles.modalRow}>
          <Text style={styles.modalLabel}>Deductions</Text>
          <Text style={styles.modalText}>{policy.deductions? `Rs. ${new Intl.NumberFormat().format(policy.deductions)}` : 'N/A'}</Text>
        </View>
        <View style={styles.modalRow}>
          <Text style={styles.modalLabel}>Net Amount</Text>
          <Text style={styles.modalText}>{policy.net_amount? `Rs. ${new Intl.NumberFormat().format(policy.net_amount)}` : 'N/A'}</Text>
        </View>
        <View style={styles.modalRow}>
          <Text style={styles.modalLabel}>Contact No.</Text>
          <Text style={styles.modalText}>{formattedContact}</Text>
        </View>
        {formattedContact !== 'N/A' && (
          <View style={styles.iconRow}>
            <TouchableOpacity onPress={() => handleContactPress(formattedContact)} accessible accessibilityLabel="Call">
              <Icon name="phone" size={20} color="blue" style={styles.contactIcon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleWhatsAppPress(formattedContact)} accessible accessibilityLabel="WhatsApp">
              <Icon name="whatsapp" size={20} color="green" style={styles.whatsappIcon} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default PolicyDetailsModal;

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 10,
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'left',
    flex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    textAlign: 'left',
  },
  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingBottom: 10,
  },
});