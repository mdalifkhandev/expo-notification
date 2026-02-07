import {
    AuthorizationStatus,
    getMessaging,
    getToken,
    requestPermission,
} from "@react-native-firebase/messaging";
import * as Notification from "expo-notifications";

export async function requestFCMPermission() {
  const messaging = getMessaging();
  await Notification.requestPermissionsAsync();
  const authStatus = await requestPermission(messaging);
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;
  return enabled;
}

export async function getFCMToken() {
  const messaging = getMessaging();
  const token = await getToken(messaging);
  console.log("FCM Token", token);
  return token;
}
