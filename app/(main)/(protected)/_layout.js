import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Redirect, Slot, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProtectedRoute = () => {
  const [user, setUser] = useState("string");
  useEffect(() => {
    const getUserData = async () => {
      setUser(JSON.parse(await AsyncStorage.getItem("user")));
      // await AsyncStorage.removeItem("user");
    };
    getUserData();
  }, []);
  useEffect(() => {
    if (user === null) {
      router.replace("/login");
    }
  }, [user]);
  return (
    <View>
      <Slot />
    </View>
  );
};

export default ProtectedRoute;
