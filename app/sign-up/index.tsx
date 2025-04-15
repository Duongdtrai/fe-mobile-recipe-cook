import axios from 'axios';
import { Formik } from 'formik';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';
import { navigateToOtherScreen } from '@/helper/func';
import { useNavigation } from '@react-navigation/native';
import { signUp } from '@/services/userServices';
import { styleIOS } from '@/helper/styles';
import { HTTP_STATUS_CODE } from '@/ts/enums';
import { useToast } from 'react-native-toast-notifications';
import { showErrorToast } from '@/helper/toast';

const SignUpScreen: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showReEnterpassWord, setShowReEnterPassword] = useState(false);
  const navigation = useNavigation<any>();
  const toast = useToast();

  const initialValues = {
    fullName: '',
    email: '',
    password: '',
    reEnteredPassword: ''
  }

  const validationSchema = Yup.object().shape({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required')
      .matches(
        /^(?=.*[A-Z])(?=.*[0-9])/,
        'Password must contain at least one uppercase letter and one number'
      ),
    reEnteredPassword: Yup.string()
      .oneOf([Yup.ref('password'), ''], 'Passwords must match')
      .required('Please re-enter your password'),
  })

  const handleSignUp = async (data: any) => {
    const sendData = {
      email: data?.email,
      password: data?.password,
      fullname: data?.fullName
    }
    const res = await signUp(sendData);
    if (res?.status === HTTP_STATUS_CODE.OK) {
      navigateToOtherScreen('login/index', navigation);
    } else {
      showErrorToast(toast, "Email has already been registered");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <ScrollView style={styles.scrollViewContainer} showsVerticalScrollIndicator={false}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSignUp}
          >
            {formikProps => (
              <View style={styles.container}>
                <View style={styles.logoContainer}>
                  <Image
                    source={{
                      uri: 'https://yt3.googleusercontent.com/nh364hWLvDMkQIuFJ4pHIiqnd6y3DwPl4Doxn2OCsn-8At-k0CrcymuwM9otm2-Ty7vv0VBWFw=s900-c-k-c0x00ffffff-no-rj'
                    }}
                    style={styleIOS(styles.logo, styles.logoIOS)}
                  />
                  <Text style={styles.header}>Create Account</Text>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styleIOS(styles.label, styles.labelIOS)}>Full Name</Text>
                  <TextInput
                    style={styleIOS(styles.input, styles.inputIOS)}
                    placeholder="Enter your full name"
                    value={formikProps.values.fullName}
                    onChangeText={formikProps.handleChange('fullName')}
                    onBlur={formikProps.handleBlur('fullName')}
                    clearButtonMode={'while-editing'}
                  />
                  {formikProps.touched.fullName && formikProps.errors.fullName &&
                    <Text style={styles.errorText}>{formikProps.errors.fullName}</Text>
                  }
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styleIOS(styles.label, styles.labelIOS)}>Email</Text>
                  <TextInput
                    style={styleIOS(styles.input, styles.inputIOS)}
                    placeholder="Enter your email"
                    value={formikProps.values.email}
                    onChangeText={formikProps.handleChange('email')}
                    onBlur={formikProps.handleBlur('email')}
                    keyboardType="email-address"
                    clearButtonMode={'while-editing'}
                  />
                  {formikProps.touched.email && formikProps.errors.email &&
                    <Text style={styles.errorText}>{formikProps.errors.email}</Text>
                  }
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styleIOS(styles.label, styles.labelIOS)}>Password</Text>
                  <View style={styles.iconContainer}>
                    <TextInput
                      style={styleIOS(styles.input, styles.inputIOS)}
                      placeholder="Enter your password"
                      value={formikProps.values.password}
                      onChangeText={formikProps.handleChange('password')}
                      onBlur={formikProps.handleBlur('password')}
                      secureTextEntry={!showPassword}
                      textContentType="oneTimeCode"
                    />
                    <TouchableOpacity style={styles.icon} onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={16} color="black" />
                    </TouchableOpacity>
                  </View>
                  {formikProps.touched.password && formikProps.errors.password &&
                    <Text style={styles.errorText}>{formikProps.errors.password}</Text>
                  }
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styleIOS(styles.label, styles.labelIOS)}>Re-enter password</Text>
                  <View style={styles.iconContainer}>
                    <TextInput
                      style={styleIOS(styles.input, styles.inputIOS)}
                      placeholder="Re-enter Password"
                      value={formikProps.values.reEnteredPassword}
                      onChangeText={formikProps.handleChange('reEnteredPassword')}
                      onBlur={formikProps.handleBlur('reEnteredPassword')}
                      secureTextEntry={!showReEnterpassWord}
                      textContentType="oneTimeCode"
                    />
                    <TouchableOpacity style={styles.icon} onPress={() => setShowReEnterPassword(!showReEnterpassWord)}>
                      <Ionicons name={showReEnterpassWord ? 'eye-off' : 'eye'} size={16} color="black" />
                    </TouchableOpacity>
                  </View>
                  {formikProps.touched.reEnteredPassword && formikProps.errors.reEnteredPassword &&
                    <Text style={styles.errorText}>{formikProps.errors.reEnteredPassword}</Text>
                  }
                </View>
                <TouchableOpacity style={styles.signUpButton} onPress={formikProps.handleSubmit}>
                  <Text style={styles.signUpButtonText}>Sign Up</Text>
                </TouchableOpacity>
                <View style={styles.signInContainer}>
                  <Text style={styleIOS(styles.signInText, styles.signInTextIOS)}>Already have an account? </Text>
                  <TouchableOpacity>
                    <Text style={styleIOS(styles.signInLink, styles.signInLinkIOS)} onPress={() => navigateToOtherScreen('login/index', navigation)}> Sign in</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  scrollViewContainer: {
    marginTop: 30,
    width: '100%',
  },
  iconContainer: {
    position: 'relative',
    width: '100%'
  },
  inputContainer: {
    marginBottom: 15,
    width: '100%',
  },
  icon: {
    position: 'absolute',
    padding: 5,
    top: 7,
    right: 2,
  },
  label: {
    marginBottom: 5,
    fontSize: 16
  },
  labelIOS: {
    fontSize: 14
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 200,
  },
  logoIOS: {
    width: 150,
    height: 150,
  },
  header: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    width: '100%',
    textAlign: 'left',
    marginBottom: 10
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 5,
    fontSize: 16
  },
  inputIOS: {
    fontSize: 14
  },
  signUpButton: {
    backgroundColor: 'gold',
    width: '100%',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  signUpButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpButtonTextIOS: {
    fontSize: 14,
  },
  signInContainer: {
    flexDirection: 'row',
    marginTop: 20,
    position: 'relative',
  },
  signInText: {
    fontSize: 16,
  },
  signInTextIOS: {
    fontSize: 14,
  },
  signInLink: {
    color: 'black',
    textDecorationLine: 'none',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signInLinkIOS: {
    fontSize: 14
  }
});

export default SignUpScreen;
