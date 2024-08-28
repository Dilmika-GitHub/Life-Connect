import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Button } from 'react-native';

export default function PolicyScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Calculate the list of months starting from the last month
  const getLast12Months = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = String(date.getMonth()).padStart(2, '0'); 
      const yearMonth = `${date.getFullYear()} - ${month}`;
      months.push({ date, yearMonth });
    }
    return months;
  };

  const last12Months = getLast12Months();

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowPicker(false);
  };

  return (
    <View style={styles.container}>
      {/* Display Percentage */}
      <Text style={styles.percentageText}>Percentage: 75%</Text>

      {/* Year and Month Picker */}
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.pickerContainer}>
        <Text style={styles.pickerText}>
          {selectedDate.getFullYear()} - {String(selectedDate.getMonth()).padStart(2, '0')}
        </Text>
      </TouchableOpacity>

      {/* Custom Year and Month Picker Modal */}
      <Modal visible={showPicker} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.pickerWrapper}>
            <Text style={styles.modalTitle}>Select Year and Month</Text>
            <ScrollView style={styles.scrollView}>
              {last12Months.map(({ date, yearMonth }, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.optionContainer}
                  onPress={() => handleDateChange(date)}
                >
                  <Text style={styles.optionText}>{yearMonth}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button title="Close" onPress={() => setShowPicker(false)} />
          </View>
        </View>
      </Modal>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Inforced Policies</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Lapsed Policies</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  percentageText: {
    fontSize: 24,
    marginBottom: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  pickerText: {
    fontSize: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 30,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerWrapper: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
  },
  scrollView: {
    width: '100%',
    marginVertical: 10,
  },
  optionContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
