import { View, StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useAppTheme } from './_layout';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import colorScheme from '@/assets/colorscheme';
import NotificationModal from '@/components/common/NotificationModal';
import { submitUserLogin } from '@/services/userService';
import { useDispatch } from 'react-redux';
import { UserActions } from '@/state/reducers/userReducer';
import { AppDispatch } from '@/state/defaultStore';
import { useRouter } from 'expo-router';
import { UserState } from '@/state/rootState';

export default function Index() {
  const theme = useAppTheme();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPassword, setUserPassword] = useState<string>('');
  const [shouldShowErrorModal, setShouldShowErrorModal] = useState<boolean>(false);

  const handleLoginClick = async () => {
    const result = await submitUserLogin(userEmail, userPassword);
    if (result.success) {
      const userPayload: UserState = {
        userId: result.loginResponse?.user.ID as number,
        isAuthorized: true,
        authToken: result.loginResponse?.token === undefined ? '' : result.loginResponse?.token,
      };
      dispatch({ type: UserActions.SetUserStateFull, payload: userPayload });
      router.push('/(main)/(tabs)');
    } else {
      setShouldShowErrorModal(true);
      console.log('Error status: ', result.errorResponse?.status);
      console.log('Error message: ', result.errorResponse?.message);
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 100,
        }}
      >
        {shouldShowErrorModal && (
          <NotificationModal
            message='Incorrect username/password.'
            isVisible={shouldShowErrorModal}
            setModalVisibile={setShouldShowErrorModal}
          />
        )}
        <Text style={styles.headerStyle}>Notifier</Text>
        <View style={{ marginTop: 10, display: 'flex', flexDirection: 'column' }}>
          <TextInput
            style={styles.textInputContent}
            placeholder='Enter your email'
            textContentType='emailAddress'
            label='Email'
            mode='outlined'
            value={userEmail}
            onChangeText={(text) => setUserEmail(text)}
          />
          <TextInput
            style={styles.textInputContent}
            secureTextEntry={true}
            textContentType='password'
            label='Password'
            placeholder='Enter your password'
            mode='outlined'
            value={userPassword}
            onChangeText={(text) => setUserPassword(text)}
          />
        </View>
        <View style={{ marginTop: 20, display: 'flex', flexDirection: 'row' }}>
          <Button
            textColor={theme.colors.laserBlue}
            style={styles.buttonStyle}
            contentStyle={styles.buttonContentStyle}
            onPress={handleLoginClick}
            labelStyle={styles.buttonLabelStyle}
          >
            Login
          </Button>
          <Button
            textColor={theme.colors.laserBlue}
            style={styles.buttonStyle}
            contentStyle={styles.buttonContentStyle}
            labelStyle={styles.buttonLabelStyle}
          >
            Register
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    display: 'flex',
    borderWidth: 2,
    borderColor: colorScheme.tokyoLaserBlue,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    width: 120,
    height: 50,
  },
  headerStyle: {
    color: colorScheme.tokyoLaserBlue,
    fontSize: 50,
  },
  buttonLabelStyle: {
    fontSize: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContentStyle: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContent: {
    width: 300,
    height: 60,
    fontSize: 18,
    marginTop: 10,
  },
});
