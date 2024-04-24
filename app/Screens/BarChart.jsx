import React from 'react';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const BarChartComponent = ({ data, graphStyle, chartConfig }) => {
  const screenWidth = Dimensions.get('window').width;

  return (
    <BarChart
      style={graphStyle}
      data={data}
      width={screenWidth}
      height={180}
      chartConfig={chartConfig}
      verticalContentInset={{ top: 10, bottom: 10 }}
    />
  );
};

export default BarChartComponent;
