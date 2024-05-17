import * as ScreenOrientation from 'expo-screen-orientation';

export const lockToPortrait = async () => {
  await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
};

export const lockToAllOrientations = async () => {
  await ScreenOrientation.unlockAsync();
};