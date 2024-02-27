import { View, Text, TextInput, Button, ToastAndroid } from "react-native";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useLazyGetAllUserQuery } from "../../../redux/features/modules/users/userApi";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useCreateTourMutation } from "../../../redux/features/modules/tour/tourApi";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
export default function AddNew() {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const [selectedUser, setSelectedUser] = useState([]);
  const [users, setUsers] = useState([]);
  const [author, setAuthor] = useState(null);
  const [
    getAllUser,
    {
      data: userData,
      isSuccess: userDataSuccess,
      isFetching: userDataIsFetching,
    },
  ] = useLazyGetAllUserQuery();
  const [
    createTour,
    {
      isSuccess: createTourSuccess,
      isError: createTourIsError,
      error: createTourError,
    },
  ] = useCreateTourMutation();
  useEffect(() => {
    const getUserData = async () => {
      setAuthor(JSON.parse(await AsyncStorage.getItem("user")));
    };
    getUserData();
  }, []);
  useEffect(() => {
  }, [createTourIsError]);
  useEffect(() => {
    if (createTourSuccess) {
      ToastAndroid.show("Tour is created", ToastAndroid.SHORT);
      router.replace("/");
    }
  }, [createTourSuccess]);
  useEffect(() => {
    getAllUser({ searchTerm: watch("username") });
  }, [watch("username")]);
  useEffect(() => {
    if (userData?.data?.length > 0) {
      const temp = userData?.data.map((u) => ({
        username: u?._id,
        name: u?.username,
      }));
      setUsers(temp);
    }
  }, [userDataSuccess, userDataIsFetching]);
  const onSubmit = ({ username, ...data }) => {
    if (!(selectedUser.length > 1)) {
      ToastAndroid.show("Minimum 2 friends requied", ToastAndroid.SHORT);
    } else {
      const temp = selectedUser.map((u) => u.username);
      data.author = author?._id;
      data.usernames = temp;
      createTour(data);
    }
  };
  const handlePushToUser = (user) => {
    setSelectedUser((prev) => [...prev, user]);
    setValue("username", "");
  };
  const handleRemoveUserFromTour = (user, i) => {
    setSelectedUser((prev) => prev.filter((u) => u.username !== user.username));
  };
  return (
    <View className="w-11/12 m-auto bg-gray-200 p-4">
      <Text className="text-3xl text-center my-2">Add new Tour</Text>
      <View className=" my-3">
        <Text className="text-xl mb-1">Name</Text>
        <Controller
          control={control}
          rules={{
            required: "Name is required",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`border-2 border-gray-600 ${
                errors.name && "border-red-600"
              } rounded-lg p-3`}
              keyboardType="default"
              placeholder="Please enter your tour name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="name"
        />
        {errors.name && (
          <Text className="text-red-600">{errors.name.message}</Text>
        )}
      </View>
      <View className=" my-3">
        <Text className="text-xl mb-1">Description</Text>
        <Controller
          control={control}
          rules={{
            required: "Description is required",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`border-2 border-gray-600 ${
                errors.name && "border-red-600"
              } rounded-lg p-3`}
              keyboardType="default"
              placeholder="Please enter your tour description"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="description"
        />
        {errors.description && (
          <Text className="text-red-600">{errors.description.message}</Text>
        )}
      </View>
      <View className=" my-3">
        <Text className="text-xl mb-1">Image link</Text>
        <Controller
          control={control}
          rules={{
            required: "Image link is required",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`border-2 border-gray-600 ${
                errors.name && "border-red-600"
              } rounded-lg p-3`}
              keyboardType="default"
              placeholder="Please enter your image link"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="image"
        />
        {errors.image && (
          <Text className="text-red-600">{errors.image.message}</Text>
        )}
      </View>
      <View className=" my-3">
        <Text className="text-xl mb-3">Username</Text>
        <View className="flex flex-row flex-wrap flex-4 gap-3">
          {selectedUser?.length > 0 &&
            selectedUser.map((user, i) => (
              <Text
                key={i}
                className="flex-2 bg-gray-200 rounded-lg p-2"
                onPress={() => handleRemoveUserFromTour(user, i)}
              >
                <AntDesign name="closecircleo" /> {user?.name}
              </Text>
            ))}
        </View>

        <Controller
          control={control}
          rules={{
            required: false,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`border-2 border-gray-600 ${
                errors.name && "border-red-600"
              } rounded-lg p-3`}
              keyboardType="default"
              placeholder="Please enter your username"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="username"
        />
        {errors.username && (
          <Text className="text-red-600">{errors.username.message}</Text>
        )}
        <View className="flex flex-row flex-wrap flex-4 gap-3">
          {users?.length > 0 ? (
            users?.map((d) => {
              return (
                <Text
                  key={d?.name}
                  className="flex-2 bg-gray-200 rounded-lg p-2"
                  onPress={() => handlePushToUser(d)}
                >
                  {d.name}
                </Text>
              );
            })
          ) : (
            <Text>No user available</Text>
          )}
        </View>
      </View>
      <View className=" my-3">
        <Text className="text-xl mb-1">Initial pay</Text>
        <Controller
          control={control}
          rules={{
            required: "Initial pay is required",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`border-2 border-gray-600 ${
                errors.name && "border-red-600"
              } rounded-lg p-3`}
              keyboardType="decimal-pad"
              placeholder="Please enter initial amount"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="initialPay"
        />
        {errors.initialPay && (
          <Text className="text-red-600">{errors.initialPay.message}</Text>
        )}
      </View>
      <View className="my-3">
        <Button
          className="rounded-3xl bg-lime-500"
          title="Add new tour"
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </View>
  );
}
