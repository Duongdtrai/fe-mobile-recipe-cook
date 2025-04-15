import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import {
  convertToken,
  getItem,
  navigateToOtherScreen,
  storeItem,
} from "@/helper/func";
import { useToast } from "react-native-toast-notifications";
import { loginSuccess } from "@/redux/actions/userActions";
import { login } from "@/services/userServices";
import { styleIOS } from "@/helper/styles";
import LottieView from "lottie-react-native";
import { showErrorToast } from "@/helper/toast";
import { HTTP_STATUS_CODE } from "@/ts/enums";
import { changeTab } from "@/redux/actions/tabActions";
import { Formik } from "formik";
import * as Yup from "yup";
import { Ionicons } from "@expo/vector-icons";

const LoginScreen = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const toast = useToast();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 10,
      backgroundColor: "#FFFFFF",
    },
    scrollViewContainer: {
      marginTop: 30,
      width: "100%",
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    logo: {
      width: 200,
      height: 200,
      marginBottom: 10,
    },
    logoIOS: {
      width: 150,
      height: 150,
    },
    title: {
      fontSize: 25,
      fontWeight: "bold",
      marginBottom: 20,
    },
    inputContainer: {
      marginBottom: 15,
      width: "100%",
    },
    label: {
      marginBottom: 5,
      fontSize: 16,
    },
    labelIOS: {
      fontSize: 14,
    },
    input: {
      width: "100%",
      height: 40,
      borderWidth: 1,
      borderColor: "#CCCCCC",
      paddingHorizontal: 10,
      borderRadius: 5,
      marginBottom: 5,
      fontSize: 16,
    },
    inputIOS: {
      fontSize: 14,
    },
    forgotPasswordContainer: {
      alignSelf: "flex-end",
      marginBottom: 10,
    },
    forgotPassword: {
      color: "black",
      fontSize: 16,
    },
    forgotPasswordIOS: {
      fontSize: 14,
    },
    signInButton: {
      backgroundColor: !loading ? "gold" : "#FFD70080",
      borderColor: "gold",
      borderWidth: 1,
      paddingVertical: 10,
      borderRadius: 5,
      alignItems: "center",
      width: "100%",
      marginBottom: 10,
    },
    signInButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
      zIndex: 100,
    },
    buttonTextIOS: {
      fontSize: 14,
    },
    orContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    orLine: {
      flex: 1,
      height: 1,
      backgroundColor: "gray",
    },
    orText: {
      marginHorizontal: 10,
      fontWeight: "bold",
      fontSize: 16,
    },
    orTextIOS: {
      fontSize: 14,
    },
    signUpButton: {
      borderColor: "gold",
      borderWidth: 1,
      paddingVertical: 10,
      borderRadius: 5,
      alignItems: "center",
      width: "100%",
    },
    signUpButtonText: {
      color: "gold",
      fontWeight: "bold",
      fontSize: 16,
    },
    loading: {
      width: 80,
      height: 80,
      position: "absolute",
      top: -20,
      left: "50%",
      zIndex: 1,
    },
    errorText: {
      color: "red",
      width: "100%",
      textAlign: "left",
      marginBottom: 10,
    },
    icon: {
      position: "absolute",
      padding: 5,
      top: 30,
      right: 4,
    },
  });

  const handleSignIn = async (data: any) => {
    setLoading(true);
    const loginData = {
      email: data?.email,
      password: data?.password,
      notifyToken: await getItem("token_notify"),
    };
    const response = await login(loginData);
    if (response?.status === HTTP_STATUS_CODE.OK) {
      await storeItem("token", response?.data?.accessToken);
      setLoading(false);
      dispatch(changeTab(0));
      dispatch(loginSuccess(response?.data));
      navigateToOtherScreen("diets/index", navigation);
    } else {
      setLoading(false);
      showErrorToast(toast, "Email hoặc password không đúng");
    }
  };

  const handleForgotPassword = () => {
    navigateToOtherScreen("forgot-password/index", navigation);
  };

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required")
      .matches(
        /^(?=.*[A-Z])(?=.*[0-9])/,
        "Password must contain at least one uppercase letter and one number"
      ),
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
      >
        <ScrollView
          style={styles.scrollViewContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Image
              source={{
                uri: "https://www.huongnghiepaau.com/wp-content/uploads/2023/11/icon-40-mon-an.png",
              }}
              style={styleIOS(styles.logo, styles.logoIOS)}
            />
            <Text style={styles.title}>Ứng dụng hướng dẫn nấu ăn</Text>
          </View>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSignIn}
          >
            {(formikProps) => (
              <View style={styles.container}>
                {/* Username Input */}
                <View style={styles.inputContainer}>
                  <Text style={styleIOS(styles.label, styles.labelIOS)}>
                    Email
                  </Text>
                  <TextInput
                    style={styleIOS(styles.input, styles.inputIOS)}
                    placeholder="Nhập email của bạn"
                    value={formikProps.values.email}
                    onChangeText={formikProps.handleChange("email")}
                    onBlur={formikProps.handleBlur("email")}
                    keyboardType="email-address"
                    clearButtonMode={"while-editing"}
                  />
                  {formikProps.touched.email && formikProps.errors.email && (
                    <Text style={styles.errorText}>
                      {formikProps.errors.email}
                    </Text>
                  )}
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                  <Text style={styleIOS(styles.label, styles.labelIOS)}>
                    Mật khẩu
                  </Text>
                  <TextInput
                    style={styleIOS(styles.input, styles.inputIOS)}
                    placeholder="Nhập mật khẩu của bạn"
                    value={formikProps.values.password}
                    onChangeText={formikProps.handleChange("password")}
                    onBlur={formikProps.handleBlur("password")}
                    secureTextEntry={!showPassword}
                    textContentType="oneTimeCode"
                  />
                  <TouchableOpacity
                    style={styles.icon}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off" : "eye"}
                      size={16}
                      color="black"
                    />
                  </TouchableOpacity>
                  {formikProps.touched.password &&
                    formikProps.errors.password && (
                      <Text style={styles.errorText}>
                        {formikProps.errors.password}
                      </Text>
                    )}
                </View>

                {/* Sign In Button */}
                <TouchableOpacity
                  style={styles.signInButton}
                  disabled={loading}
                  onPress={formikProps.handleSubmit}
                >
                  <Text
                    style={styleIOS(
                      styles.signInButtonText,
                      styles.buttonTextIOS
                    )}
                  >
                    Đăng nhập
                  </Text>
                  {loading && (
                    <LottieView
                      autoPlay
                      loop
                      style={styles.loading}
                      source={require("../../assets/animations/loading.json")}
                    />
                  )}
                </TouchableOpacity>
                {/* Or Separator */}
                <View style={styles.orContainer}>
                  <View style={styles.orLine} />
                  <Text style={styleIOS(styles.orText, styles.orTextIOS)}>
                    or
                  </Text>
                  <View style={styles.orLine} />
                </View>

                {/* Sign Up Button */}
                <TouchableOpacity
                  disabled={loading}
                  style={styles.signUpButton}
                  onPress={() =>
                    navigateToOtherScreen("sign-up/index", navigation)
                  }
                >
                  <Text
                    style={styleIOS(
                      styles.signUpButtonText,
                      styles.buttonTextIOS
                    )}
                  >
                    Đăng ký
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
