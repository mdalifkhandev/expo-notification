import { getFCMToken, requestFCMPermission } from "@/services/fcm";
import { createNotificationChannel } from "@/services/notificationChannel";
import { getApps } from "@react-native-firebase/app";
import {
  getInitialNotification,
  getMessaging,
  onMessage,
} from "@react-native-firebase/messaging";
import * as Notifications from "expo-notifications";
import { router, Stack } from "expo-router";
import { useEffect } from "react";

if (getApps().length === 0) {
  // React Native Firebase is initialized natively in Expo dev/build.
}

export default function RootLayout() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  useEffect(() => {
    async function setup() {
      try {
        await createNotificationChannel();
        const granted = await requestFCMPermission();
        if (!granted) {
          console.log("❌ Notification permission denied");
          return;
        }
        const token = await getFCMToken();
      } catch (error) {
        console.error("Firebase setup error:", error);
      }
    }
    setup();
  }, []);

  useEffect(() => {
    try {
      const messaging = getMessaging();
      const unsubscribe = onMessage(messaging, async (remoteMessage) => {
        console.log("📬 Foreground notification received:", remoteMessage);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: remoteMessage.notification?.title || "New Notification",
            body: remoteMessage.notification?.body || "",
            data: remoteMessage.data,
            sound: "default",
          },
          trigger: null,
        });
      });
      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error("Foreground notification setup error:", error);
    }
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log("📱 Notification interaction:", response);
        const screen = response.notification.request.content.data.screen;
        if (screen) {
          router.push(screen as any);
        } else {
          router.push("/");
        }
      },
    );
    return () => subscription.remove();
  }, [router]);

  useEffect(() => {
    async function checkInitalNotification() {
      try {
        const messaging = getMessaging();
        const remoteMessage = await getInitialNotification(messaging);

        if (remoteMessage) {
          console.log(
            "📱 App opened from killed state via notification:",
            remoteMessage,
          );
          const screen = remoteMessage.data?.screen;
          if (screen) {
            router.push(screen as any);
          } else {
            router.push("/");
          }
        }
      } catch (error) {
        console.error("Initial notification check error:", error);
      }
    }

    checkInitalNotification();
  }, [router]);

  return <Stack />;
}
