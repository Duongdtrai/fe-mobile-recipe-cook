import { useEffect, useState } from "react";
import { mapStateToProps } from "@/constants/mapStateToProps";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
} from "react-native";
import { connect, useDispatch } from "react-redux";
import API from "@/config/api";
import { HTTP_STATUS_CODE } from "@/ts/enums";
import {
  setNotRead,
  setNotifications,
} from "@/redux/actions/notificationActions";
import { convertDifferenceTime, convertToken, getItem } from "@/helper/func";
import { useNavigation } from "@react-navigation/native";
import { changeTab } from "@/redux/actions/tabActions";
import { setNotifyStatus } from "@/redux/actions/userActions";
import { showErrorToast, showSuccessToast } from "@/helper/toast";
import { useToast } from "react-native-toast-notifications";

const Notifications = (props: any) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      width: "100%",
      paddingHorizontal: 10,
      backgroundColor: "#FFFFFF",
    },
    itemContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      marginVertical: 2,
      position: "relative",
      paddingHorizontal: 5,
    },
    contentContainer: {
      width: "70%",
      marginTop: 5,
      marginLeft: 10,
    },
    contentTitle: {
      fontSize: 18,
      fontWeight: "bold",
    },
    content: {
      fontSize: 16,
    },
    image: {
      width: 70,
      height: 60,
      marginTop: 10,
    },
    time: {
      position: "absolute",
      top: 5,
      right: 10,
      fontWeight: "400",
      fontSize: 14,
    },
    isReadSignal: {
      width: 15,
      height: 15,
      backgroundColor: "#23629f",
      borderRadius: 10,
      position: "absolute",
      right: 20,
      top: "50%",
    },
    loadMoreButton: {
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#23629f",
      padding: 10,
      marginTop: 20,
      borderRadius: 5,
    },
    loadMoreButtonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    emptyNotiText: {
      fontSize: 16,
      textAlign: "center",
      fontStyle: "italic",
    }
  });

  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const toast = useToast();

  const { notifyToken, isNotify } = props.userState;
  const { data, notRead } = props.notificationsState;

  const [notiList, setNotiList] = useState([...data]);
  const [totalNotRead, setTotalNotRead] = useState(notRead);
  const [page, setPage] = useState(0);
  const [isEnabled, setIsEnabled] = useState<boolean>(isNotify);

  useEffect(() => {
    const fetchNoti = async () => {
      const response = await API.getNotifications({
        token: convertToken(notifyToken),
        page: page,
        size: 10,
      });
      if (response?.data?.status === HTTP_STATUS_CODE.OK) {
        const listData = response?.data?.data?.data;
        const totalNotRead = response?.data?.data?.metadata?.totalNoIsRead;
        if (page === 0) {
          dispatch(setNotifications(listData));
          dispatch(setNotRead(totalNotRead));
          setNotiList(listData);
          setTotalNotRead(totalNotRead);
        } else {
          dispatch(setNotifications([...data, ...listData]));
          setNotiList([...notiList, ...listData]);
        }
      }
    };
    fetchNoti();
  }, [page]);

  const handleClickItem = async (item: any) => {
    navigation.navigate("news/news_details", { newsId: item.newsId });
    dispatch(changeTab(-1));
    try {
      const response = await API.updateStatus({
        token: convertToken(notifyToken),
        id: item.id,
      });
      if (response?.data?.status === HTTP_STATUS_CODE.OK) {
        const newList = notiList.map((noti: any) => {
          if (noti.id === item.id) {
            return { ...noti, isRead: true };
          }
          return noti;
        });
        dispatch(setNotifications(newList));
        if (!item.isRead) {
          dispatch(setNotRead(totalNotRead - 1));
          setTotalNotRead(totalNotRead - 1);
        }
        setNotiList(newList);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const renderItem = ({ item, index }: any) => {
    const timeDiff = convertDifferenceTime(item.createdAt);

    return (
      <TouchableOpacity
        key={index}
        style={styles.itemContainer}
        onPress={() => handleClickItem(item)}
      >
        <View style={styles.itemContainer}>
          <Image
            source={{
              uri: item.image,
            }}
            style={styles.image}
          />
          <View style={styles.contentContainer}>
            <Text style={styles.contentTitle}>{item.title}</Text>
            <Text style={styles.content}>{item.body}</Text>
          </View>
          <Text style={styles.time}>{timeDiff}</Text>
          {!item.isRead && <View style={styles.isReadSignal} />}
        </View>
      </TouchableOpacity>
    );
  };

  const toggleSwitch = async () => {
    const response = await API.updateSetting({
      token: await getItem("token_notify"),
      isNotify: !isEnabled,
    });

    if (response?.data?.status === HTTP_STATUS_CODE.OK) {
      setIsEnabled((previousState) => !previousState);
      showSuccessToast(toast, "Setting notification updated successfully");
      dispatch(setNotifyStatus(!isEnabled));
    } else {
      showErrorToast(toast, "Network error");
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View
          style={{
            marginVertical: 20,
            alignItems: "center",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginRight: 10,
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 18, marginLeft: 10 }}>
            Tùy chỉnh thông báo
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
            style={{ transform: [{ scaleX: 0.9 }, { scaleY: 0.8 }] }}
          />
        </View>
        {notiList.map((item: any, index: number) =>
          renderItem({ item, index })
        )}
        {notiList.length > 0 ? (
          <TouchableOpacity
            onPress={() => setPage(page + 1)}
            style={styles.loadMoreButton}
          >
            <Text style={styles.loadMoreButtonText}>
              Xem thêm thông báo trước đó
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.emptyNotiText}>Không có thông báo nào</Text>
        )}
      </View>
    </ScrollView>
  );
};

export default connect(mapStateToProps)(Notifications);
