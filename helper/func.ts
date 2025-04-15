import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

export const navigateToOtherScreen = (path: string, navigation: any) => {
  navigation.navigate(path);
};

export const storeItem = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log(error);
  }
};

export const getItem = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.log(error);
  }
};

export const removeItem = async (key: string) => {
  try {
    return await AsyncStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
};

export const returnDateFuture = () => {
  const currentDate = new Date();
  const futureDate = new Date(currentDate);
  futureDate.setMonth(currentDate.getMonth() + 2);
  const dateListFuture = getDateRange(currentDate, futureDate);
  return dateListFuture;
};

export const returnDatePast = () => {
  const currentDate = new Date();
  const pastDate = new Date(currentDate);
  pastDate.setMonth(currentDate.getMonth() - 2);
  const dateListPast = getDateRange(pastDate, currentDate);
  return dateListPast;
};

export const formatDate = (date: Date) => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = date.getFullYear().toString();
  return `${year}/${day}/${month}`;
};


export const getDateRange = (startDate: Date, endDate: Date) => {
  const dateList = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dateList.push(formatDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dateList;
};

export const convertDifferenceTime = (startDate: Date) => {
  const targetDate = moment(startDate);

  // console.log('before: ' + targetDate.format("DD/MM/YYYY hh:mm:ss"));
  
  const currentDate = moment();

  // console.log('current: ' + currentDate.format("DD/MM/YYYY hh:mm:ss"));
  

  const diffInMins = currentDate.diff(targetDate, 'minutes');
  const diffInHours = currentDate.diff(targetDate, 'hours');
  const diffInDays = currentDate.diff(targetDate, 'days');

  if (diffInMins < 1) {
    return 'Vừa xong';
  } else if (diffInMins < 60) {
    return `${diffInMins} phút trước`;
  } else if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  } else if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  } else {
    return targetDate.format('YYYY-MM-DD');
  }
}

export const convertToken = (token: string) => {
  let encodeToken = token.replace("[", "%5B");
  return encodeToken.replace("]", "%5D");
}
