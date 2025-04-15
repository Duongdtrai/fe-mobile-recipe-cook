import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
} from "react-native";
import { connect, useDispatch } from "react-redux";
import { mapStateToProps } from "@/constants/mapStateToProps";
// import DefaultImage from "@/assets/images/avatar-default.png";
import { styleIOS } from "@/helper/styles";
import { useNavigation } from "@react-navigation/native";
import { getItem, navigateToOtherScreen, removeItem } from "@/helper/func";
import { Divider } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import API from "@/config/api";
import { useToast } from "react-native-toast-notifications";
import { HTTP_STATUS_CODE } from "@/ts/enums";
import { showErrorToast, showSuccessToast } from "@/helper/toast";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { setNotifyStatus, setUser } from "@/redux/actions/userActions";
import { changeTab } from "@/redux/actions/tabActions";

const AccountSetting = (props: any) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      width: "100%",
      alignItems: "center",
      paddingHorizontal: 10,
      backgroundColor: "#FFFFFF",
      position: "relative",
    },
    avatarContainer: {
      marginBottom: 40,
      alignItems: "center",
    },
    itemContainer: {
      marginVertical: 10,
      paddingHorizontal: 10,
      width: "90%",
    },
    item: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: 150,
      height: 150,
      borderRadius: 75,
      marginBottom: 20,
    },
    userName: {
      fontWeight: "bold",
      fontSize: 18,
    },
    divider: {
      width: "100%",
      marginTop: 15,
    },
    icon: {
      width: "15%",
    },
    text: {
      width: "80%",
      fontSize: 18,
      fontWeight: "bold",
    },
  });

  const navigation = useNavigation<any>();
  const toast = useToast();
  const dispatch = useDispatch();
  const { user, isNotify } = props.userState;
  // const DEFAULT_IMAGE = Image.resolveAssetSource(DefaultImage).uri;
  const DEFAULT_IMAGE = "https://secure.gravatar.com/avatar/656bff31e84d0067d752e1a0077d6877?s=500&d=mm&r=g";

  const [isEnabled, setIsEnabled] = useState<boolean>(isNotify);
  const [showDialog, setShowDialog] = useState(false);

  const settingsItem = [
    {
      icon: "person-outline",
      text: "My account",
      path: "user-information/index",
    },
    {
      icon: "lock-closed-outline",
      text: "Change password",
      path: "change-password/index",
    },
    // {
    //   icon: "notifications-outline",
    //   text: "Notifications",
    //   path: "",
    // },
    {
      icon: "trash-bin-outline",
      text: "Delete account",
      path: "",
    },
    {
      icon: "log-out-outline",
      text: "Log out",
      path: "",
    },
  ];

  const toggleSwitch = async () => {
    const response = await API.updateSetting({
        token: await getItem("token_notify"),
        isNotify: !isEnabled
    })

    if (response?.data?.status === HTTP_STATUS_CODE.OK) {
        setIsEnabled((previousState) => !previousState);
        showSuccessToast(toast, "Setting notification updated successfully");
        dispatch(setNotifyStatus(!isEnabled));
    } else {
        showErrorToast(toast, "Network error");
    }
  };

  const handleLogOut = async () => {
    const response = await API.logout();
    if (response?.status === HTTP_STATUS_CODE.OK) {
      await removeItem("token");
      dispatch(setUser({}));
      navigateToOtherScreen("index", navigation);
    } else {
      showErrorToast(toast, "Log out failed!");
    }
  };

  const handleDeleteAccount = async () => {
    const response = await API.deleteAccount();
    if (response?.data?.status === HTTP_STATUS_CODE.OK) {
      await removeItem("token");
      dispatch(setUser({}));
      dispatch(changeTab(0));
      navigateToOtherScreen("index", navigation);
    } else {
      showErrorToast(toast, "Network error!");
    }
  };

  const handleClickItem = (item: any) => {
    switch (item?.text) {
      case "Log out":
        dispatch(changeTab(0));
        handleLogOut();
        break;
      case "Delete account":
        setShowDialog(true);
        break;
      case "Notifications":
        toggleSwitch();
        break;
      default:
        navigateToOtherScreen(item?.path, navigation);
        break;
    }
  };

  const renderItem = ({ item, index }: any) => {
    return (
      <View style={styles.itemContainer} key={index}>
        <TouchableOpacity
          style={styles.item}
          onPress={() => handleClickItem(item)}
        >
          <Ionicons
            name={item?.icon}
            size={30}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.text}>{item?.text}</Text>
          {item.icon === "notifications-outline" ? (
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
              style={{ position: "absolute", right: -10 }}
            />
          ) : (
            <Ionicons
              name="arrow-forward"
              size={30}
              color="black"
              style={styles.icon}
            />
          )}
        </TouchableOpacity>
        <Divider style={styles.divider} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {showDialog && (
        <ConfirmationDialog
          visible={showDialog}
          onCancel={() => setShowDialog(false)}
          onConfirm={handleDeleteAccount}
          title="Delete your account?"
        />
      )}
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: user.avatar ?? DEFAULT_IMAGE,
            cache: "reload",
          }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>
          {user.fullname}
        </Text>
      </View>
      {settingsItem.map((item: any, index: number) =>
        renderItem({ item, index })
      )}
    </View>
  );
};

export default connect(mapStateToProps)(AccountSetting);
