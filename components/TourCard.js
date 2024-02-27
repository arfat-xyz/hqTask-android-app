import {
  View,
  Text,
  Image,
  Button,
  Modal,
  TextInput,
  Pressable,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  useCreateExpenseMutation,
  useDepositForTourMutation,
  useGetUserForTourQuery,
} from "../redux/features/modules/tour/tourApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UpdateTourModal from "./UpdateTourModal";
import { Link } from "expo-router";
import { Picker } from "@react-native-picker/picker";
import AddExpenseModal from "./AddExpenseModal";

export default function TourCard({ tourData, id }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [showModal, setShowModal] = useState(false);
  const { tour, expense, deposit, username } = tourData;
  const [submitDeposit, { isError, isLoading, isSuccess, error }] =
    useDepositForTourMutation();

  useEffect(() => {
    if (isError) {
      ToastAndroid.show(error?.message, ToastAndroid.SHORT);
    }
  }, [isError]);
  useEffect(() => {
    const successFunc = async () => {
      if (isSuccess) {
        ToastAndroid.show("Deposit Successfull", ToastAndroid.SHORT);
        reset();
        setShowModal(false);
      }
    };
    successFunc();
  }, [isSuccess]);

  const onSubmit = async (data) => {
    // createUser(data);
    const user = await JSON.parse(await AsyncStorage.getItem("user"));
    data.tour = tour?._id;
    data.username = username?._id;
    submitDeposit(data);
  };

  return (
    <View className="bg-gray-300 min-h-[200px] p-2 rounded-lg my-2">
      <Image
        className="w-[100%] h-[250px] mx-auto "
        source={{ uri: tour?.image }}
      />
      <Text className="text-2xl my-2">{tour?.name}</Text>
      <Text className="text-sm">{tour?.description}</Text>
      <View className="flex flex-row gap-4 my-2">
        <Text
          className={`flex-[2] ${
            deposit < tour?.initialPay ? "bg-red-500" : "bg-green-800"
          } text-white text-center py-2 rounded-lg`}
        >
          Initial Amount: {tour?.initialPay}
        </Text>
        <Text
          className={`flex-[2] bg-green-500  text-white text-center py-2 rounded-lg`}
        >
          You paid : {deposit + expense}
        </Text>
      </View>
      <Text className={`bg-red-500 text-white text-center py-2 rounded-lg`}>
        Tour total expense: {expense}
      </Text>
      <View>
        <View className="my-2">
          {/* <Button title="Deposit" className="my-4 flex-2" /> */}

          <View className="my-2">
            <Modal
              transparent
              visible={showModal}
              animationType="slide"
              className="w-full h-80 bg-red-400"
            >
              <View className="flex-1 justify-center items-center">
                <View className="p-4 bg-white rounded-lg shadow-lg w-8/12 mx-auto ">
                  <Text className="text-xl mt-2">Amount</Text>
                  <Controller
                    control={control}
                    rules={{
                      required: "Amount is required",
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        className={`border-2 border-gray-600 ${
                          errors.deposit && "border-red-600"
                        } rounded-lg p-3`}
                        keyboardType="decimal-pad"
                        placeholder="Please enter amount"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                    name="deposit"
                  />
                  {errors.deposit && (
                    <Text className="text-red-600">
                      {errors.deposit.message}
                    </Text>
                  )}
                  <View className="my-2">
                    <Button
                      title="Deposit"
                      color={"green"}
                      onPress={handleSubmit(onSubmit)}
                    />
                  </View>
                  <View className="my-2">
                    <Button
                      title="Close"
                      color={"red"}
                      onPress={() => setShowModal(false)}
                    />
                  </View>
                </View>
              </View>
            </Modal>
            <Button title="Deposit" onPress={() => setShowModal(true)} />
          </View>
          {tour?._id && <AddExpenseModal tour={tour} />}
          {id === tour?.author && <UpdateTourModal tour={tour} />}
          <View className="flex flex-row justify-center items-center gap-5">
            <View className="my-2 flex-[2]">
              <Link
                href={`/details/${tour?._id}`}
                className="text-center p-2 bg-blue-400 text-white"
              >
                VIEW DETAILS
              </Link>
              {/* <Button title="View details" className="my-4" /> */}
            </View>
            <View className="my-2 flex-[2]">
              <Link
                href={`/summary/${tour?._id}`}
                className="text-center p-2 bg-blue-400 text-white"
              >
                SUMARY
              </Link>
              {/* <Button title="View details" className="my-4" /> */}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
