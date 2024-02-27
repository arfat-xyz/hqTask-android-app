import {
  View,
  Text,
  Modal,
  Button,
  TextInput,
  ToastAndroid,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useCreateExpenseMutation,
  useGetUserForTourQuery,
} from "../redux/features/modules/tour/tourApi";

export default function AddExpenseModal({ tour }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [allTourUsers, setAllTourUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [user, setUser] = useState({});
  const [createExpense, { isSuccess: createExpenseIsSuccess }] =
    useCreateExpenseMutation();
  const {
    isLoading: getUserForTourIsLoading,
    isSuccess: getUserForTourIsSuccess,
    data: getUserForTourData,
  } = useGetUserForTourQuery(tour?._id);
  useEffect(() => {
    const initialRun = async () => {
      const temp = await JSON.parse(await AsyncStorage.getItem("user"));
      setUser(temp);
      setSelectedUser({
        username: temp?.username,
        id: temp?._id,
      });
    };
    initialRun();
  }, []);
  function customSort(a, b) {
    if (a.id === user?._id) {
      return -1;
    } else if (b.id === user?._id) {
      return 1;
    } else {
      return 0;
    }
  }
  useEffect(() => {
    const successFunc = async () => {
      if (getUserForTourIsSuccess) {
        const temp = getUserForTourData?.data?.result.map((u) => {
          return {
            username: u?.username?.username,
            id: u?.username?._id,
          };
        });
        const x = temp.sort(customSort);
        // const removeLoginUser = temp.filter((d) => d.id !== user._id);
        // removeLoginUser.shift({ username: user?.username, id: user?._id });
        setAllTourUsers(temp);
      }
    };
    successFunc();
  }, [getUserForTourIsSuccess]);
  useEffect(() => {
    const successFunc = async () => {
      if (createExpenseIsSuccess) {
        ToastAndroid.show("Expense Successfull", ToastAndroid.SHORT);
        reset();
        setShowExpenseModal(false);
      }
    };
    successFunc();
  }, [createExpenseIsSuccess]);
  const onExpenseSubmit = async (data) => {
    data.tour = tour?._id;
    data.user = selectedUser?.id;
    console.log(
      "create expense",
      data,
      selectedUser,
      tour?.author === user?._id
    );
    createExpense(data);
  };
  return (
    <>
      <View className="my-2">
        <Modal
          transparent
          visible={showExpenseModal}
          animationType="slide"
          className="w-full h-80 bg-red-400"
        >
          <View className="flex-1 justify-center items-center">
            <View className="p-4 bg-white rounded-lg shadow-lg w-8/12 mx-auto ">
              {tour?.author === user?._id && (
                <View className="my-2">
                  <Text className="text-xl mt-2">Select user</Text>
                  <Controller
                    control={control}
                    rules={{
                      required: "Select a user is required",
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      // <TextInput
                      //   className={`border-2 border-gray-600 ${
                      //     errors.amount && "border-red-600"
                      //   } rounded-lg p-3`}
                      //   keyboardType="decimal-pad"
                      //   placeholder="Please enter amount"
                      //   onBlur={onBlur}
                      //   onChangeText={onChange}
                      //   value={value}
                      // />
                      <Picker
                        // selectedValue={"JavaScript"}
                        // onValueChange={(itemValue, itemIndex) =>
                        //   setSelectedLanguage(itemValue)
                        // }
                        selectedValue={
                          ("you're paying for : ", selectedUser?.username)
                        }
                        onValueChange={(itemValue, itemIndex) =>
                          setSelectedUser(itemValue)
                        }
                      >
                        <Picker.Item
                          className="bg-green-500"
                          label={("asdfasdf", selectedUser?.username)}
                          value={selectedUser}
                        />
                        {allTourUsers.map((u) => (
                          <Picker.Item
                            key={u?.username}
                            label={u?.username}
                            value={u}
                          />
                        ))}
                        {/* <Picker.Item label="Java" value="java" />
                      <Picker.Item label="JavaScript" value="js" /> */}
                      </Picker>
                    )}
                    name="amount"
                  />
                  {errors.amount && (
                    <Text className="text-red-600">
                      {errors.amount.message}
                    </Text>
                  )}
                </View>
              )}

              <View className="my-2">
                <Text className="text-xl mt-2">Amount</Text>
                <Controller
                  control={control}
                  rules={{
                    required: "Amount is required",
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`border-2 border-gray-600 ${
                        errors.amount && "border-red-600"
                      } rounded-lg p-3`}
                      keyboardType="decimal-pad"
                      placeholder="Please enter amount"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name="amount"
                />
                {errors.amount && (
                  <Text className="text-red-600">{errors.amount.message}</Text>
                )}
              </View>
              <View className="my-2">
                <Text className="text-xl mt-2">Description</Text>
                <Controller
                  control={control}
                  rules={{
                    required: "Description is required",
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`border-2 border-gray-600 ${
                        errors.description && "border-red-600"
                      } rounded-lg p-3`}
                      multiline
                      keyboardType="default"
                      placeholder="Please enter description"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name="description"
                />
                {errors.description && (
                  <Text className="text-red-600">
                    {errors.description.message}
                  </Text>
                )}
              </View>
              <View className="my-2">
                <Button
                  title="Create expense"
                  color={"green"}
                  onPress={handleSubmit(onExpenseSubmit)}
                />
              </View>
              <View className="my-2">
                <Button
                  title="Close"
                  color={"red"}
                  onPress={() => setShowExpenseModal(false)}
                />
              </View>
            </View>
          </View>
        </Modal>
        <Button
          title="Add expense"
          className="my-4 "
          onPress={() => setShowExpenseModal(true)}
          color={"red"}
        />
      </View>
    </>
  );
}
