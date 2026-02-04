import { FontAwesome } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () => (
          <BlurView
            intensity={60}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.7)",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Varningar i Sverige",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome
              name="exclamation-triangle"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="lokal"
        options={{
          title: "Varningar i lokal område (län)",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="map-marker" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Inställningar",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="gear" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "rgba(20, 30, 40, 0.25)",
    borderTopWidth: 0,
    position: "absolute",
  },
});
