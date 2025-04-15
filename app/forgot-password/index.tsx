import { forgotPassword } from '@/services/userServices';
import { styleIOS } from '@/helper/styles';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, Platform, Keyboard, KeyboardAvoidingView } from 'react-native';
import { HTTP_STATUS_CODE } from '@/ts/enums';

const ForgotPassword = () => {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

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
            marginBottom: 15,
            width: '90%',
        },
        image: {
            width: 120,
            height: 120,
            marginBottom: 20,
        },
        infoText: {
            fontSize: 18,
            fontWeight: 'bold',
            width: '90%',
            textAlign: 'center',
            marginVertical: 70
        },
        infoTextIOS: {
            width: "90%"
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
            marginBottom: 40,
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
            overflow: 'hidden',
            position: 'relative',
        },
        buttonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
            zIndex: 100,
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

    const handleSendOTP = async () => {
        setLoading(true);
        const response = await forgotPassword({ email: email });
        if (response?.status === HTTP_STATUS_CODE.OK) {
            setLoading(false);
            navigation.navigate('forgot-password/otp', {
                email: email
            });
        } else {
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
                            source={require('../../assets/images/lock.png')}
                            style={styles.image}
                        />
                    </View>
                    <Text style={styleIOS(styles.infoText, styles.infoTextIOS)}>
                        Please enter your email address to recieve a verification code
                    </Text>
                    <View style={styles.inputContainer}>
                        <Text style={styleIOS(styles.label, styles.labelIOS)}>Email address</Text>
                        <TextInput
                            style={styleIOS(styles.input, styles.inputIOS)}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>
                    <TouchableOpacity disabled={loading} style={styles.button} onPress={handleSendOTP}>
                        <Text style={styleIOS(styles.buttonText, styles.buttonTextIOS)}>Send</Text>
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
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
};

export default ForgotPassword;
