import {
  View,
  Text,
  Image,
  ScrollView,
  Button,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, Redirect, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGetToursForUserQuery } from "../../../redux/features/modules/tour/tourApi";
import TourCard from "../../../components/TourCard";
export default function Home() {
  const [tourData, setTourData] = useState([]);
  const [user, setUser] = useState(null);
  const { isError, isLoading, isSuccess, data, error } =
    useGetToursForUserQuery(user?._id, { pollingInterval: 30000 });
  useEffect(() => {
    if (isSuccess) {
      setTourData(data?.data);
    }
  }, [isSuccess]);
  // useEffect(() => {
  //   const loaderScreen = () => {
  //     if (isLoading) {
  //       return <ActivityIndicator color={"red"} className="w-full h-screen" />;
  //     }
  //   };
  //   loaderScreen();
  // }, []);
  useEffect(() => {
    setTourData(data?.data);
  }, [data]);
  useEffect(() => {
    const getUserData = async () => {
      setUser(JSON.parse(await AsyncStorage.getItem("user")));
    };
    getUserData();
  }, []);
  useEffect(() => {
    if (isError) {
      console.log("This is from Error", error);
      // ToastAndroid.show(error?.data?.message, ToastAndroid.SHORT);
    }
  }, [isError]);
  return (
    <ScrollView>
      {isLoading && (
        <ActivityIndicator
          color={"red"}
          size={30}
          className="w-full h-screen"
        />
      )}
      <View className=" w-11/12 mx-auto">
        <View>
          <Link
            href={"/add-new"}
            className="bg-green-500 text-center py-2 text-white my-2 rounded-lg"
          >
            Add a tour
          </Link>
        </View>
        {tourData?.length > 0 ? (
          tourData?.map((singleTour) => (
            <TourCard
              key={singleTour?._id}
              tourData={singleTour}
              id={user?._id}
            />
          ))
        ) : (
          <Text className="text-2xl text-center">No tour Available</Text>
        )}
      </View>
    </ScrollView>
  );
}
