import { Badge } from "react-native-elements";
import { useState, useEffect, useRef } from "react";
import TabBar from "./TabBar";
import { View, StyleSheet } from "react-native";
import { connect, useDispatch } from "react-redux";
import { mapStateToProps } from "@/constants/mapStateToProps";
import * as Notifications from "expo-notifications";
import { setNotRead } from "@/redux/actions/notificationActions";

const CustomTabBar = (props: any) => {
  const { routesState } = props;
  const { notRead } = props.notificationsState;
  const [badgeValue, setBadgeValue] = useState(notRead);

  const dispatch = useDispatch();
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  const styles = StyleSheet.create({
    containerStyle: {
      position: "absolute",
      top: 5,
      right: 52,
      backgroundColor: "red",
      borderRadius: 15,
      minWidth: 25,
      minHeight: 25,
      justifyContent: "center",
      alignItems: "center",
    },
    badgeStyle: {
      backgroundColor: "transparent",
      borderWidth: 0,
    },
    textStyle: {
      fontSize: 12,
      color: "white",
    },
  });

  useEffect(() => {
    setBadgeValue(notRead);
  }, [notRead]);

  // useEffect(() => {
  //   notificationListener.current =
  //   Notifications.addNotificationReceivedListener(() => {
  //     dispatch(setNotRead(badgeValue + 1));
  //   });
  // }, [])

  return (
    <View>
      <TabBar state={routesState} />
      {badgeValue !== 0 && (
        <Badge
          value={badgeValue > 99 ? "99+" : badgeValue}
          status="error"
          containerStyle={styles.containerStyle}
          badgeStyle={styles.badgeStyle}
          textStyle={styles.textStyle}
        />
      )}
    </View>
  );
};

export default connect(mapStateToProps)(CustomTabBar);
