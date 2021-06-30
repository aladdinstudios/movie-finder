import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Headline } from 'react-native-paper';
import FixedContainer from '~/components/fixed-container';
import { RootStackScreenProps } from '~/navigators/root-stack';

GoogleSignin.configure({
  webClientId: '67225926582-s8gjm5kdt01j08jahvs6777ddsm0q271.apps.googleusercontent.com',
});

const Login = observer<RootStackScreenProps<'Login'>>(() => {
  const onGoogleButtonPress = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      const { idToken } = await GoogleSignin.signIn();

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <FixedContainer style={styles.center} edges={[]}>
      <Image style={styles.logo} source={require('~/assets/bootsplash_logo.png')} />
      <View style={styles.report}>
        <Headline>Welcome to Movie Finder</Headline>
        <GoogleSigninButton
          style={styles.signin}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={onGoogleButtonPress}
        />
      </View>
    </FixedContainer>
  );
});

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    width: 200,
    height: 200,
  },
  signin: {
    marginTop: 10,
    width: 192,
  },
  report: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 100,
  },
});

export default Login;
