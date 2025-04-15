import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableWithoutFeedback, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { connect, useDispatch } from 'react-redux';
import { mapStateToProps } from '@/constants/mapStateToProps';
// import DefaultImage from '@/assets/images/avatar-default.png';
import mime from "mime";
import { setUser, updateInfoRequest, uploadImageRequest } from '@/redux/actions/userActions';
import { styleIOS } from '@/helper/styles';
import { useNavigation } from '@react-navigation/native';
import { navigateToOtherScreen } from '@/helper/func';
import API from '@/config/api';
import { HTTP_STATUS_CODE } from '@/ts/enums';
import { showErrorToast, showSuccessToast } from '@/helper/toast';
import { useToast } from 'react-native-toast-notifications';

const UpdateUserInfo = (props: any) => {
    const { user, accessToken } = props.userState;
    // const DEFAULT_IMAGE = Image.resolveAssetSource(DefaultImage).uri;
    const DEFAULT_IMAGE = "https://secure.gravatar.com/avatar/656bff31e84d0067d752e1a0077d6877?s=500&d=mm&r=g";
    const [source, setSource] = useState(user?.avatar || DEFAULT_IMAGE);
    const dispatch = useDispatch();
    const navigation = useNavigation(); 
    const toast = useToast();

    const initialValues = {
        fullname: user?.fullname || '',
        phoneNumber: user?.phoneNumber || '',
        address: user?.address || '',
    }

    const validationSchema = Yup.object().shape({
        phoneNumber: Yup.string()
            .matches(/^[0][0-9]{9}$/, 'Must be only digits and first number is 0')
            .min(10, 'Must be exactly 10 digits')
            .max(10, 'Must be exactly 10 digits')
    })

    const openImagePicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        })
        if (!result.canceled) {
            setSource(result.assets[0].uri);
            const newImageUri = "file:///" + result.assets[0].uri.split("file:/").join("");
            dispatch(uploadImageRequest({
                uri: newImageUri,
                type: mime.getType(newImageUri),
                name: user.email
            }, accessToken));
        }
    };

    const handleUpdateUserInfo = async (data: any) => {
        const response = await API.updateInfo(data);
        if (response?.data?.status === HTTP_STATUS_CODE.OK) {
            showSuccessToast(toast, "Successfully updated");
            dispatch(setUser(response?.data?.data));
        } else {
            showErrorToast(toast, "Network Error!");
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleUpdateUserInfo}
                >
                    {formikProps => (
                        <View style={styles.container}>
                            <View style={styles.avatarContainer}>
                                <Image
                                    source={{
                                        uri: source
                                    }}
                                    style={styles.avatar}
                                />
                                <TouchableOpacity>
                                    <Ionicons name="camera" size={30} color="black" onPress={openImagePicker} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styleIOS(styles.label, styles.labelIOS)}>Full Name</Text>
                                <TextInput
                                    style={styleIOS(styles.input, styles.inputIOS)}
                                    placeholder="Enter your full name"
                                    value={formikProps.values.fullname}
                                    onBlur={formikProps.handleBlur('fullname')}
                                    onChangeText={formikProps.handleChange('fullname')}
                                    clearButtonMode={'while-editing'}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styleIOS(styles.label, styles.labelIOS)}>Address</Text>
                                <TextInput
                                    style={styleIOS(styles.input, styles.inputIOS)}
                                    value={formikProps.values.address}
                                    onBlur={formikProps.handleBlur('address')}
                                    onChangeText={formikProps.handleChange('address')}
                                    placeholder="Address"
                                    clearButtonMode={'while-editing'}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <Text style={styleIOS(styles.label, styles.labelIOS)}>Phone Number</Text>
                                <TextInput
                                    style={styleIOS(styles.input, styles.inputIOS)}
                                    value={formikProps.values.phoneNumber}
                                    onBlur={formikProps.handleBlur('phoneNumber')}
                                    onChangeText={formikProps.handleChange('phoneNumber')}
                                    placeholder="Phone Number"
                                    clearButtonMode={'while-editing'}
                                />
                            </View>
                            {formikProps.touched.phoneNumber && formikProps.errors.phoneNumber && typeof formikProps.errors.phoneNumber === 'string' &&
                                <Text style={styleIOS(styles.errorText, styles.errorTextIOS)}>{formikProps.errors.phoneNumber}</Text>
                            }
                            <TouchableOpacity style={styles.button} onPress={formikProps.handleSubmit}>
                                <Text style={styleIOS(styles.buttonText, styles.buttonTextIOS)}>Save changes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => navigateToOtherScreen('change-password/index', navigation)}>
                                <Text style={styleIOS(styles.buttonText, styles.buttonTextIOS)}>Change Password</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Formik>
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
    avatarContainer: {
        marginBottom: 40,
        alignItems: 'center',
    },
    inputContainer: {
        marginBottom: 15,
        width: '100%',
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
        marginBottom: 5,
        fontSize: 16
    },
    labelIOS: {
        fontSize: 14
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 10,
    },
    input: {
        width: '100%',
        height: 40,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 5,
        fontSize: 16
    },
    inputIOS: {
        fontSize: 14
    },
    button: {
        backgroundColor: 'gold',
        width: '100%',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonTextIOS: {
        fontSize: 14
    }
});

export default connect(mapStateToProps)(UpdateUserInfo);
