import React, { useState } from 'react';
import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import IndividualComponent from '../report/Individual';
import MonthlyComponent from '../report/Monthly'; // Import your MonthlyComponent
import AllPageComponent from '../report/AllPage';

const ReportScreen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(null);

  const items = [
    { label: 'Individual', value: 'individual' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'All', value: 'all' }
  ];

  return (
    <View style={{ flex: 1, padding: 30 }}>
      <DropDownPicker
        items={items}
        open={isOpen}
        setOpen={setIsOpen}
        value={currentValue}
        setValue={setCurrentValue}
        maxHeight={200}
        autoScroll
        placeholder='Select Your View'
        placeholderStyle={{ color: 'orange', fontWeight: 'bold', fontSize: 16 }}
        showTickIcon={true}
        showArrowIcon={true}
      />

      {currentValue === 'individual' && <IndividualComponent />}
      {currentValue === 'monthly' && <MonthlyComponent />}
      {currentValue === 'all' && <AllPageComponent />}
    </View>
  );
};

export default ReportScreen;
