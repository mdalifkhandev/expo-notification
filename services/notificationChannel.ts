import * as Notification from "expo-notifications";
import { Platform } from "react-native";

export async function createNotificationChannel() {
  if (Platform.OS === "android") {
    await Notification.setNotificationChannelAsync("default", {
      name: "Default Notification",
      importance: Notification.AndroidImportance.HIGH,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });

    await Notification.setNotificationChannelAsync("bookings", {
      name: "Booking Notifications",
      importance: Notification.AndroidImportance.HIGH,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
    });

    await Notification.setNotificationChannelAsync("chat", {
      name: "Chat Messages",
      importance: Notification.AndroidImportance.HIGH,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
    });
  }
}
