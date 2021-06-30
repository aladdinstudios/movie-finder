import { NavigatorScreenParams } from '@react-navigation/native';
import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from 'react-native-screens/native-stack';
import Drawer, { DrawerScreensParams } from '~/navigators/drawer';
import Loader from '~/screens/loader';
import Login from '~/screens/login';

export type RootStackScreensParams = {
  Loader: undefined | { delay?: number; text?: string };
  Login: undefined;
  Drawer: undefined | NavigatorScreenParams<DrawerScreensParams>;
};

export type RootStackScreens = keyof RootStackScreensParams;

export type RootStackScreenProps<T extends RootStackScreens> = NativeStackScreenProps<
  RootStackScreensParams,
  T
>;

export type UseRootStackNavigation<T extends RootStackScreens = 'Loader'> =
  NativeStackNavigationProp<RootStackScreensParams, T>;

const { Navigator, Screen } = createNativeStackNavigator<RootStackScreensParams>();

const RootStack = () => (
  <Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Screen name="Loader" component={Loader} />
    <Screen name="Login" component={Login} />
    <Screen name="Drawer" component={Drawer} />
  </Navigator>
);

export default RootStack;
