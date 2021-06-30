import CustomDrawer from '~/components/custom-drawer';
import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer';
import {
  CompositeNavigationProp,
  NavigatorScreenParams,
  RouteProp,
} from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from 'react-native-screens/native-stack';
import { RootStackScreensParams } from '~/navigators/root-stack';
import BottomTab, { BottomTabScreensParams } from '~/navigators/bottom-tab';

export type DrawerScreensParams = {
  BottomTab: undefined | NavigatorScreenParams<BottomTabScreensParams>;
};

export type DrawerScreens = keyof DrawerScreensParams;

export type DrawerScreenProps<T extends DrawerScreens> = {
  navigation: CompositeNavigationProp<
    DrawerNavigationProp<DrawerScreensParams, T>,
    NativeStackNavigationProp<RootStackScreensParams>
  >;
  route: RouteProp<DrawerScreensParams, T>;
};

const { Navigator, Screen } = createDrawerNavigator<DrawerScreensParams>();

const Drawer = () => (
  <Navigator
    lazy={true}
    drawerContent={(props) => <CustomDrawer {...props} />}
    drawerStyle={styles.drawer}
  >
    <Screen
      name="BottomTab"
      component={BottomTab}
      options={{ drawerIcon: () => 'dots-horizontal', title: 'Find Movies' }}
    />
  </Navigator>
);

const styles = StyleSheet.create({
  drawer: {
    flex: 1,
  },
});

export default Drawer;
