import { styleIOS } from '@/helper/styles';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import * as Yup from 'yup';
import API from '@/config/api';
import { HTTP_STATUS_CODE } from '@/ts/enums';
import { showErrorToast, showSuccessToast } from '@/helper/toast';
import { navigateToOtherScreen } from '@/helper/func';
import { useNavigation } from '@react-navigation/native';

const ChangePassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showReEnterpassWord, setShowReEnterPassword] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);

    const navigation = useNavigation<any>();
    const toast = useToast();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
        },
        scrollViewContainer: {
            marginTop: 50,
            width: '100%',
        },
        imageContainer: {
            backgroundColor: '#FFEC8B',
            width: 200,
            height: 200,
            borderRadius: 100,
            padding: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        iconContainer: {
            position: 'relative',
            width: '100%'
        },
        inputContainer: {
            marginBottom: 20,
            width: '90%',
        },
        inputContainerIOS: {
            marginBottom: 10,
        },
        image: {
            width: 120,
            height: 120,
            marginBottom: 20,
        },
        icon: {
            position: 'absolute',
            padding: 5,
            top: 7,
            right: 2,
        },
        infoText: {
            fontSize: 20,
            fontWeight: 'bold',
            width: '70%',
            textAlign: 'center',
            marginVertical: 70
        },
        infoTextIOS: {
            width: '90%',
            fontSize: 18,
            marginVertical: 50
        },
        errorText: {
            color: 'red',
            width: '100%',
            textAlign: 'left',
            marginBottom: 10,
            fontSize: 16
        },
        errorTextIOS: {
            fontSize: 14
        },
        label: {
            fontSize: 16,
            marginBottom: 5
        },
        labelIOS: {
            fontSize: 14
        },
        input: {
            width: '100%',
            height: 40,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            paddingHorizontal: 10,
            fontSize: 16
        },
        inputIOS: {
            fontSize: 14
        },
        button: {
            backgroundColor: !loading ? 'gold' : '#FFD70080',
            width: '90%',
            height: 40,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 20
        },
        buttonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
            zIndex: 100
        },
        buttonTextIOS: {
            fontSize: 14
        },
        loading: {
            width: 80,
            height: 80,
            position: 'absolute',
            top: -20,
            left: '50%',
            zIndex: 1,
        }
    });

    const initialValues = {
        password: '',
        reEnteredPassword: ''
    }

    const validationSchema = Yup.object().shape({
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required')
            .matches(
                /^(?=.*[A-Z])(?=.*[0-9])/,
                'Password must contain at least one uppercase letter and one number'
            ),
        reEnteredPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Please re-enter your password'),
    })

    const handleChangePassword = async (data: any) => {
        const response = await API.changePassword({ password: data.password });
        if (response?.data?.status === HTTP_STATUS_CODE.OK) {
            showSuccessToast(toast, "Password updated successfully");
            navigation.navigate("account-setting/index");
        } else {
            showErrorToast(toast, "Network Error");
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >
                <ScrollView style={styles.scrollViewContainer}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={(data: any) => handleChangePassword(data)}
                    >
                        {formikProps => (
                            <View style={styles.container}>
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={require('../../assets/images/lock.png')}
                                        style={styles.image}
                                    />
                                </View>
                                <Text style={styleIOS(styles.infoText, styles.infoTextIOS)}>Your new password must be different from previously used password</Text>
                                <View style={styleIOS(styles.inputContainer, styles.inputContainerIOS)}>
                                    <Text style={styleIOS(styles.label, styles.labelIOS)}>New password</Text>
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
                                        <Text style={styleIOS(styles.errorText, styles.errorTextIOS)}>{formikProps.errors.password}</Text>
                                    }
                                </View>
                                <View style={styleIOS(styles.inputContainer, styles.inputContainerIOS)}>
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
                                        <Text style={styleIOS(styles.errorText, styles.errorTextIOS)}>{formikProps.errors.reEnteredPassword}</Text>
                                    }
                                </View>
                                <TouchableOpacity style={styles.button} onPress={formikProps.handleSubmit}>
                                    <Text style={styleIOS(styles.buttonText, styles.buttonTextIOS)}>Save</Text>
                                    {loading &&
                                        <LottieView
                                            autoPlay
                                            loop
                                            style={styles.loading}
                                            source={require('../../assets/animations/loading.json')}
                                        />
                                    }
                                </TouchableOpacity>
                            </View>
                        )}
                    </Formik>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

export default ChangePassword;
