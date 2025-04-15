import { Button, Platform, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { showErrorToast } from "@/helper/toast";
import { useToast } from "react-native-toast-notifications";
import API from "@/config/api";
import { convertToken, storeItem } from "@/helper/func";
import { useDispatch } from "react-redux";
import { setNotifyStatus, setToken } from "@/redux/actions/userActions";
import { HTTP_STATUS_CODE } from "@/ts/enums";
import { setNotRead } from "@/redux/actions/notificationActions";
import DietFilterScreen from "./diets";
import CategoryScreen from "./diets";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootScreen() {
  const toast = useToast();
  const dispatch = useDispatch();

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "c1f55d74-e5b2-467b-aead-8a8a74310ccc",
        })
      ).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }
    return token;
  };

  useEffect(() => {
    console.log("Registering for push notifications...");
    registerForPushNotificationsAsync()
      .then(async (token) => {
        console.log("token: ", token);
        dispatch(setToken(token));

        // set total notifications is not read
        const response = await API.getNotifications({
          token: convertToken(token as string),
          page: 0,
          size: 1,
        });
        if (response?.data?.status === HTTP_STATUS_CODE.OK) {
          const totalNotRead = response?.data?.data?.metadata?.totalNoIsRead;
          dispatch(setNotRead(totalNotRead));
        }

        await storeItem("token_notify", token as string);
        const tokenResponse = await API.createTokenService({ token });
        dispatch(setNotifyStatus(tokenResponse?.data?.data?.isNotify));
      })
      .catch((err) => showErrorToast(toast, err));
  }, []);

  return <CategoryScreen />;
}
