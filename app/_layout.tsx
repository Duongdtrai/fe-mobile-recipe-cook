import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useNavigation } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo, useState } from "react";
import { ToastProvider } from "react-native-toast-notifications";
import { Provider, connect, useDispatch } from "react-redux";
import { store } from "@/redux/store";
import React from "react";
import { useColorScheme } from "@/components/useColorScheme";
import { ROUTE_PATH } from "@/ts/enums";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Button,
  Image,
} from "react-native";
import { navigateToOtherScreen } from "@/helper/func";
import CustomTabBar from "@/components/CustomTabBar";
// import DefaultImage from '@/assets/images/avatar-default.png';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { changeTab } from "@/redux/actions/tabActions";

export { ErrorBoundary } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
};

export default RootLayout;

const routesState = {
  routes: [
    {
      key: ROUTE_PATH.home,
      name: "Trang chủ",
      iconName: "home",
    },
    // {
    //   key: ROUTE_PATH.favouriteTeam,
    //   name: "Favourite Team",
    //   iconName: "heart",
    // },
    // {
    //   key: ROUTE_PATH.matchesResult,
    //   name: "User's information",
    //   iconName: "calendar",
    // },
    // {
    //   key: ROUTE_PATH.notifications,
    //   name: "Notifications",
    //   iconName: "notifications",
    // },
  ],
};

const renderLoginButton = (store: any) => {
  const user = store.getState().user.user;
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  // const DEFAULT_IMAGE = Image.resolveAssetSource(DefaultImage).uri;
  const DEFAULT_IMAGE =
    "https://secure.gravatar.com/avatar/656bff31e84d0067d752e1a0077d6877?s=500&d=mm&r=g";

  const styles = StyleSheet.create({
    container: {
      flexDirection: "column",
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
    },
    divider: {
      marginVertical: 5,
    },
  });

  return !user.id ? (
    <View>
      <Button
        title="Login"
        onPress={() => {
          navigation.navigate(ROUTE_PATH.login);
          dispatch(changeTab(-1));
        }}
        color="green"
      />
    </View>
  ) : (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            navigateToOtherScreen("account-setting/index", navigation);
            dispatch(changeTab(-1));
          }}
        >
          <Image
            source={{
              uri: user?.avatar || DEFAULT_IMAGE,
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

function RootLayoutNav({ user }: any) {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <ToastProvider>
            <Stack>
              <Stack.Screen
                name={ROUTE_PATH.home}
                options={{
                  title: "Trang chủ",
                  headerLeft: () => <></>,
                  headerRight: () => renderLoginButton(store),
                }}
              />
              <Stack.Screen
                name={ROUTE_PATH.login}
                options={{ title: "Đăng nhập" }}
              />
              <Stack.Screen
                name={ROUTE_PATH.signUp}
                options={{
                  title: "User's information",
                  headerRight: () => renderLoginButton(store),
                }}
              />
              {/* <Stack.Screen
                name={ROUTE_PATH.favouriteTeam}
                options={{
                  title: "Favourite team",
                  headerRight: () => renderLoginButton(store),
                }}
              />
              <Stack.Screen
                name={ROUTE_PATH.teamDetails}
                options={{
                  title: "Team Details",
                  headerRight: () => renderLoginButton(store),
                }}
              />
              <Stack.Screen
                name={ROUTE_PATH.matchesResult}
                options={{
                  title: "Matches",
                  headerRight: () => renderLoginButton(store),
                }}
              />
              <Stack.Screen
                name={ROUTE_PATH.matchesDetail}
                options={{
                  title: "Matches detail",
                  headerRight: () => renderLoginButton(store),
                }}
              />
              <Stack.Screen
                name={ROUTE_PATH.matchesTeams}
                options={{
                  title: "Matches Teams",
                  headerRight: () => renderLoginButton(store),
                }}
              />
              <Stack.Screen
                name={ROUTE_PATH.matchesScheduleTeam}
                options={{
                  title: "Matches Schedule Teams",
                  headerRight: () => renderLoginButton(store),
                }}
              /> */}
              {/* <Stack.Screen
                name={ROUTE_PATH.newDetail}
                options={{
                  title: "News detail",
                  // headerLeft: () => <></>,
                  headerRight: () => renderLoginButton(store),
                }}
              /> */}
              <Stack.Screen
                name={ROUTE_PATH.dietFilterScreen}
                options={{
                  title: "Danh sách công thức các món ăn",
                  // headerLeft: () => <></>,
                  headerRight: () => renderLoginButton(store),
                }}
              />
              <Stack.Screen
                name={ROUTE_PATH.dietDetailScreenDetail}
                options={{
                  title: "Công thức chi tiết",
                  // headerLeft: () => <></>,
                  headerRight: () => renderLoginButton(store),
                }}
              />
              <Stack.Screen
                name={ROUTE_PATH.userInformation}
                options={{ title: "Thông tin user" }}
              />
              {/* <Stack.Screen
                name={ROUTE_PATH.forgotPassword}
                options={{ title: "Forgot password" }}
              /> */}
              {/* <Stack.Screen name={ROUTE_PATH.otp} options={{ title: "OTP" }} /> */}
              <Stack.Screen
                name={ROUTE_PATH.changePassword}
                options={{ title: "Thay đổi mật khẩu" }}
              />
              {/* <Stack.Screen
                name={ROUTE_PATH.accountSetting}
                options={{
                  title: "Account setting",
                  headerLeft: () => <></>,
                }}
              /> */}
              {/* <Stack.Screen
                name={ROUTE_PATH.notifications}
                options={{
                  title: "Notifications",
                  headerRight: () => renderLoginButton(store),
                  // headerLeft: () => <></>,
                }}
              /> */}
              <Stack.Screen
                name={ROUTE_PATH.notFound}
                options={{ title: "Not found" }}
              />
            </Stack>
            <CustomTabBar routesState={routesState} />
          </ToastProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </Provider>
  );
}
