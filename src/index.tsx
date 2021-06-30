import auth from '@react-native-firebase/auth';
import {
  CommonActions,
  LinkingOptions,
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Linking, Platform } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { changeBarColors } from 'react-native-immersive-bars';
import { Provider as PaperProvider } from 'react-native-paper';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';
import useIsDarkTheme from '~/hooks/use-is-dark-theme';
import RootStack from '~/navigators/root-stack';
import { RootStoreProvider, useRootStore } from '~/stores/store-setup';
import DarkTheme from '~/themes/dark-theme';
import DefaultTheme from '~/themes/default-theme';
import delay from '~/utils/delay';

const linking: LinkingOptions = {
  prefixes: [
    /* your linking prefixes */
    'moviefinder://',
    'https://www.moviefinder.com',
  ],
  config: {
    /* configuration for matching screens with paths */
    screens: {
      initialRouteName: 'Loader',
      Welcome: 'welcome',
      Loader: {
        path: 'loader/:delay?/:text?',
        parse: {
          delay: (ms) => Number(ms),
          text: (text) => decodeURIComponent(text),
        },
        stringify: {
          delay: (ms) => String(ms),
          text: (text) => encodeURIComponent(text),
        },
      },
    },
  },
};

const Main = observer(() => {
  const { hydrate } = useRootStore();
  const nav = useRef<NavigationContainerRef>(null);
  const [isDark] = useIsDarkTheme();
  const theme = useMemo(() => {
    if (isDark) {
      return DarkTheme;
    }
    return DefaultTheme;
  }, [isDark]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      changeBarColors(isDark);
    }
  }, [isDark]);

  const onReady = useCallback(async () => {
    try {
      const uri = await Linking.getInitialURL();
      if (uri) {
        await delay(500);
        await hydrate();
        RNBootSplash.hide({ fade: true });
      }
    } catch (error) {
      console.error(error);
    }
  }, [hydrate]);

  useEffect(() => {
    let first = true;
    let id: string | null = null;
    const unsubscribe = auth().onAuthStateChanged((user) => {
      // We should skip the first call to the function that happens
      // immediately after the listener is set up. But we must store
      // current user id in case user is already signed in.
      if (first) {
        first = false;
        id = user ? user.uid : user;
        return console.log('first render');
      }

      // On subsequent state change, let's compare if the event is
      // firing for the same user. In that case we don't need to
      // process it. Thanks firebase
      if ((user === null && user === id) || (user && user.uid === id)) {
        return console.log('user did not change');
      }

      // NOW WE CAN HANDLE ACTUAL CHANGE OF AUTH STATE.
      console.log('user changed');

      id = user ? user.uid : null;

      const params = {
        delay: 1500,
        text: user ? 'Signing In' : 'Signing Out',
      };

      if (nav.current) {
        nav.current.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [{ name: 'Loader', params }],
          })
        );
      }
      hydrate();
    });

    return () => {
      unsubscribe();
    };
  }, [hydrate]);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <PaperProvider theme={theme}>
        <NavigationContainer linking={linking} theme={theme} ref={nav} onReady={onReady}>
          <RootStack />
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
});

const App = () => (
  <RootStoreProvider>
    <Main />
  </RootStoreProvider>
);

export default App;
