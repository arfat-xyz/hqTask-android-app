import { View, Text, ScrollView, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { Link, Slot, router } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import { ToastProvider } from "react-native-toast-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function HomeLayout() {
  const [user, setUser] = useState("user");
  const getUserData = async () => {
    const temp = await AsyncStorage.getItem("user");
    setUser(JSON.parse(temp));
  };
  getUserData();
  return (
    <>
      <ToastProvider
        placement="bottom | top"
        duration={5000}
        animationType="slide-in | zoom-in"
        animationDuration={250}
        successColor="green"
        dangerColor="red"
        warningColor="orange"
        normalColor="gray"
        textStyle={{ fontSize: 20 }}
        offset={50} // offset for both top and bottom toasts
        offsetTop={30}
        offsetBottom={40}
        swipeEnabled={true}
      >
        <Provider store={store}>
          <View className="p-2 shadow-lg">
            <View className="flex-row py-3 sticky top-0 ">
              <Text className="flex-[2]">
                <Link href={"/"} className="text-2xl">
                  <AntDesign
                    name="home"
                    className="mr-3"
                    size={24}
                    color="black"
                  />
                  Home
                </Link>
              </Text>
              {user === null ? (
                <Text className="flex-[2] text-right">
                  <Link href={"/login"} className="text-2xl">
                    <AntDesign name="login" size={24} color="black" /> Login
                  </Link>
                </Text>
              ) : (
                <Text className="flex-[2] text-right">
                  <Text
                    onPress={async () => {
                      const x = await AsyncStorage.removeItem("user");
                      router.replace("/login");
                    }}
                    className="text-2xl"
                  >
                    <AntDesign name="logout" size={24} color="black" /> Logout
                  </Text>
                </Text>
              )}
            </View>
          </View>
          <ScrollView className="p-2">
            <Slot />
          </ScrollView>
        </Provider>
      </ToastProvider>
    </>
  );
}
