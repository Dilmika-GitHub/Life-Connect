import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button, Platform } from 'react-native';
import MonthYearPicker from 'react-native-month-year-picker';

export default function CommissionStatement() {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedRadioButton, setSelectedRadioButton] = useState('Life');

  const handlePickerConfirm = (event, newDate) => {
    if (event === ACTION_DATE_SET) {
      setDate(newDate || date);
    }
    setShowPicker(false);
  };

  const handleCreate = () => {
    console.log(`Selected Date: ${date.getFullYear()}-${date.getMonth() + 1}`);
    console.log(`Selected Radio Option: ${selectedRadioButton}`);
    // Add your create logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Statement for 950162</Text>
      
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.datePicker}>
        <Text style={styles.dateText}>{`${date.getMonth() + 1} | ${date.getFullYear()}`}</Text>
        <Text style={styles.monthText}>{date.toLocaleString('default', { month: 'long' })}</Text>
      </TouchableOpacity>

      {showPicker && (
        <MonthYearPicker
          onChange={handlePickerConfirm}
          value={date}
          minimumDate={new Date(2000, 0)} // Example of minimum date
          maximumDate={new Date(2030, 11)} // Example of maximum date
          locale="en"
        />
      )}

      <Text style={styles.label}>Select the document type</Text>
      <View style={styles.radioContainer}>
        {/* Place your RadioGroup component here with appropriate props */}
      </View>

      <Button title="CREATE" onPress={handleCreate} color="#FFFFFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F4F4',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  datePicker: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  monthText: {
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  radioContainer: {
    marginBottom: 20,
  },
});
