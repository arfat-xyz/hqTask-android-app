import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useGetSpecificTourUsersQuery } from "../../../../redux/features/modules/tour/tourApi";

export default function Summary() {
  const { id } = useLocalSearchParams();
  const [userAndTour, setUserAndTour] = useState([]);
  const [eachPersonExpense, setEachPersonExpense] = useState(0);
  const { isLoading, isError, isSuccess, data } = useGetSpecificTourUsersQuery(
    id,
    { pollingInterval: 30000 }
  );
  const allHeadingTitles = ["Username", "Expense", "Deposit", "Have to pay"];
  useEffect(() => {
    if (isSuccess) {
      setUserAndTour(data?.data?.result);
      setEachPersonExpense(
        (data?.data?.totalExpense / data?.data?.result.length).toFixed(2)
      );
    }
  }, [isSuccess]);
  return (
    <View className="w-11/12 mx-auto overflow-scroll">
      {isLoading && (
        <ActivityIndicator
          color={"red"}
          size={30}
          className="w-full h-screen"
        />
      )}
      {isSuccess && (
        <View>
          <Text className="text-2xl text-center my-2">Tour Sumary</Text>
          <View>
            <Text className="text-lg">
              Total Expense : {data?.data?.totalExpense}{" "}
            </Text>
            <Text className="text-lg">
              Total Deposit : {data?.data?.totalDeposit}{" "}
            </Text>
            <Text className="text-lg">
              Expense per head : {eachPersonExpense}
            </Text>
          </View>
          <View className="flex-1 flex-row mt-3">
            {allHeadingTitles.map((title, i) => (
              <View
                key={i}
                className="w-1/4 bg-green-400 py-2 border-r-2 border-white"
              >
                <Text className="text-center">{title}</Text>
              </View>
            ))}

            {/* <View className="w-1/4 bg-green-400 py-2 border-r-2 border-white">
              <Text className="text-center">Expense</Text>
            </View>
            <View className="w-1/4 bg-green-400 py-2 border-r-2 border-white">
              <Text className="text-center">Have to pay</Text>
            </View> */}
          </View>
          <View>
            {userAndTour.map((singleData, i) => (
              <View key={i} className="flex-1 flex-row">
                <View className="w-1/4">
                  <Text className="text-center">
                    {singleData.username?.username}
                  </Text>
                </View>
                <View className="w-1/4">
                  <Text className="text-center">{singleData.expense}</Text>
                </View>
                <View className="w-1/4">
                  <Text className="text-center">{singleData.deposit}</Text>
                </View>
                <View className="w-1/4">
                  <Text className="text-center">
                    {(
                      eachPersonExpense -
                      (singleData.expense + singleData?.deposit)
                    ).toFixed()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
