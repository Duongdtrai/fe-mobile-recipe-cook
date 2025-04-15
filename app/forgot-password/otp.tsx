import { forgotPassword, verifyOTP } from '@/services/userServices';
import { navigateToOtherScreen } from '@/helper/func';
import { styleIOS } from '@/helper/styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import React, { useState, useRef } from 'react';
import { useToast } from "react-native-toast-notifications";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import { showErrorToast, showSuccessToast } from '@/helper/toast';
import { HTTP_STATUS_CODE } from '@/ts/enums';

const Otp = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const inputRefs = useRef<TextInput[]>([]);
    const toast = useToast();

    const [loading, setLoading] = useState<boolean>(false);
    const [currentFocusIndex, setCurrentFocusIndex] = useState<number>(0);
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);

    const email = route?.params?.email;

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
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
        inputContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '70%',
            alignSelf: 'center',
            marginBottom: 60,
        },
        inputContainerIOS: {
            width: '90%'
        },
        image: {
            width: 120,
            height: 120,
            marginBottom: 20,
        },
        infoText: {
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            marginVertical: 70,
            width: '70%'
        },
        infoTextIOS: {
            width: '90%',
            fontSize: 18,
            marginVertical: 60,
        },
        resendText: {
            fontSize: 16,
            color: 'black',
            marginTop: 20
        },
        resendTextIOS: {
            fontSize: 14
        },
        input: {
            width: 50,
            height: 50,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            textAlign: 'center',
            fontSize: 20,
        },
        button: {
            backgroundColor: !loading ? 'gold' : '#FFD70080',
            width: '80%',
            height: 40,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
        },
        buttonIOS: {
            width: '90%',
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
        underline: {
            backgroundColor: 'black',
            width: 76,
            height: 2
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

    const handleSendAgain = async () => {
        setLoading(true);
        const response = await forgotPassword({ email: email });
        if (response?.status === HTTP_STATUS_CODE.OK) {
            setLoading(false);
            showSuccessToast(toast, "Send OTP code success, check your email to get it!");
        } else {
            setLoading(false);
            showErrorToast(toast, "Can not send OTP code!");
        }
        const newOtp = ['', '', '', '', '', ''];
        setCurrentFocusIndex(0);
        setOtp(newOtp);
    }

    const handleOTPChange = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);
        if (text.length === 1 && index < otp.length - 1) {
            inputRefs.current[index + 1].focus();
            setCurrentFocusIndex(index + 1);
        }
    };

    const handelDeleteOTP = (index: any) => {
        if (index === 0) return;
        if (index === 5 && otp[index].length > 0) {
            const newOtp = [...otp];
            newOtp[index] = '';
            setOtp(newOtp);
            return;
        }
        if (otp[index].length > 0) {
            inputRefs.current[index - 1].focus();
        } else {
            const newOtp = [...otp];
            newOtp[index - 1] = '';
            setOtp(newOtp);
            inputRefs.current[index - 1].focus();
        }
        setCurrentFocusIndex(index - 1);
    }

    const handleVerify = async () => {
        setLoading(true);
        const response = await verifyOTP({
            email: email,
            otp: otp.join("")
        })
        if (response?.status === HTTP_STATUS_CODE.OK) {
            showSuccessToast(toast, "Change password successfully! Check your emaili to get a new password");
            setTimeout(() => {
                setLoading(false);
                navigateToOtherScreen('login/index', navigation);
            }, 3000);
        } else {
            showErrorToast(toast, "Wrong OTP code or it was expired!");
            setLoading(false);
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >
                <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Image
                            source={require('../../assets/images/email.png')}
                            style={styles.image}
                        />
                    </View>
                    <Text
                        style={styleIOS(styles.infoText, styles.infoTextIOS)}
                    >
                        Please enter the 6 digits code send to {email}
                    </Text>
                    <View style={styleIOS(styles.inputContainer, styles.inputContainerIOS)}>
                        {[...Array(6)].map((_, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputRefs.current[index] = ref as TextInput)}
                                style={styles.input}
                                maxLength={1}
                                keyboardType="numeric"
                                onChangeText={(text) => handleOTPChange(text, index)}
                                onFocus={() => {
                                    if (index != currentFocusIndex) {
                                        inputRefs.current[currentFocusIndex].focus();
                                    }
                                }}
                                onKeyPress={({ nativeEvent }) => {
                                    if (nativeEvent.key === 'Backspace') {
                                        handelDeleteOTP(index);
                                    }
                                }}
                                value={otp[index]}
                            />
                        ))}
                    </View>
                    <TouchableOpacity disabled={loading} style={styleIOS(styles.button, styles.buttonIOS)} onPress={handleVerify}>
                        <Text style={styleIOS(styles.buttonText, styles.buttonTextIOS)}>Verify</Text>
                        {loading &&
                            <LottieView
                                autoPlay
                                loop
                                style={styles.loading}
                                source={require('../../assets/animations/loading.json')}
                            />
                        }
                    </TouchableOpacity>
                    <TouchableOpacity disabled={loading} onPress={handleSendAgain}>
                        <Text style={styleIOS(styles.resendText, styles.resendTextIOS)}>Send again?</Text>
                        <View style={styles.underline}></View>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

export default Otp;
