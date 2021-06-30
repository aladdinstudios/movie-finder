import { DrawerNavigationProp } from '@react-navigation/drawer';
import {
  createMaterialBottomTabNavigator,
  MaterialBottomTabNavigationProp,
} from '@react-navigation/material-bottom-tabs';
import { CompositeNavigationProp, RouteProp, useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Platform } from 'react-native';
import { changeBarColors } from 'react-native-immersive-bars';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import useIsDarkTheme from '~/hooks/use-is-dark-theme';
import { DrawerScreensParams } from '~/navigators/drawer';
import { RootStackScreensParams } from '~/navigators/root-stack';
import Favorites from '~/screens/favorites';
import Home from '~/screens/home';

export type BottomTabScreensParams = {
  Home: undefined;
  Favorites: undefined;
};

export type BottomTabScreens = keyof BottomTabScreensParams;

export interface BottomTabScreenProps<T extends BottomTabScreens> {
  navigation: CompositeNavigationProp<
    MaterialBottomTabNavigationProp<BottomTabScreensParams, T>,
    CompositeNavigationProp<
      DrawerNavigationProp<DrawerScreensParams>,
      NativeStackNavigationProp<RootStackScreensParams>
    >
  >;
  route: RouteProp<BottomTabScreensParams, T>;
}

const { Navigator, Screen } = createMaterialBottomTabNavigator<BottomTabScreensParams>();

const BottomTab = () => {
  const { bottom } = useSafeAreaInsets();
  const [isDark] = useIsDarkTheme();

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === 'android') {
        changeBarColors(true);
        return () => changeBarColors(isDark);
      }
    }, [isDark])
  );

  return (
    <Navigator
      sceneAnimationEnabled={true}
      shifting={true}
      initialRouteName="Home"
      safeAreaInsets={{ bottom }}
    >
      <Screen name="Home" component={Home} options={{ tabBarIcon: 'home' }} />
      <Screen name="Favorites" component={Favorites} options={{ tabBarIcon: 'account' }} />
    </Navigator>
  );
};

export default BottomTab;
