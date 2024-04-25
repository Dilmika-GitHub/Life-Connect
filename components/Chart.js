import React from 'react';
import { View, Text } from 'react-native';
import {Svg, Path } from 'react-native-svg';

export const Bar1 = ({ style }) => {
    return (
      <Svg
        width="342" 
        height="102"
        viewBox="0 0 342 102"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={style}
      >
        <Path
          fill="#FEC7B9"
          d="M330 0H12C5.37258 0 0 5.37258 0 12V90C0 96.6274 5.37258 102 12 102H330C336.627 102 342 96.6274 342 90V12C342 5.37258 336.627 0 330 0Z"
        ></Path>
      </Svg>
    );
  };
  
  export const Bar2 = ({ style }) => {
    return (
      <Svg
        width="122" 
        height="150" 
        viewBox="0 0 122 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          fill="#FFB6A4"
          d="M0 30C0 13.4315 13.4315 0 30 0H92C108.569 0 122 13.4315 122 30V150H0V30Z"
        ></Path>
      </Svg>
    );
  };