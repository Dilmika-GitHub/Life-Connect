import React from 'react';
import { Svg, Path } from 'react-native-svg';

export const Waves = ({ style }) => {
  return (
    <Svg
      style={style}
      viewBox="0 0 389 237"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        fill="#FE937B"
        fill-opacity="1"
        d="M0 233.5V0H389V115C350 103.5 312.3 101.8 227.5 169C191.667 197.5 96 250.3 0 233.5Z"
      ></Path>
    </Svg>
  );
};

export const Waves2 = ({ style }) => {
  return (
    <Svg
      style={style}
      viewBox="0 0 390 233"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        fill="#FEC7B9"
        fill-opacity="1"
        d="M-70 -109C-70 -112.866 -66.866 -116 -63 -116H486C489.866 -116 493 -112.866 493 -109V191.068C493 194.99 487.491 195.858 486.285 192.126V192.126C456.994 101.474 347.095 66.7087 270.997 124.023L190.082 184.966V184.966C116.006 234.664 22.7227 246.204 -61.2303 216.057L-69.4898 213.091C-69.7959 212.981 -70 212.691 -70 212.365V-109Z"
      ></Path>
    </Svg>
  );
};

export const MySvgComponent = () => (
  <View>
    <SvgUri
      width="200"
      height="200"
      source={{ uri: '../assets/Vector 5.svg' }}
    />
  </View>
);


//export default Waves;
