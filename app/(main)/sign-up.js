import { View, Text, TextInput, Button, ToastAndroid } from "react-native";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useCreateUserMutation } from "../../redux/features/modules/users/userApi";
import { useToast } from "react-native-toast-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const SignUp = () => {
  const toast = useToast();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [createUser, { isError, isLoading, isSuccess, error, data }] =
    useCreateUserMutation();
  useEffect(() => {
    if (isError) {
      console.log("This is from Error", error?.data?.message);
      ToastAndroid.show(error?.data?.message, ToastAndroid.SHORT);
    }
  }, [isError]);
  useEffect(() => {
    const successFunc = async () => {
      if (isSuccess) {
        ToastAndroid.show("Sign up successfull", ToastAndroid.SHORT);
        await AsyncStorage.setItem("user", JSON.stringify(data?.data));
        router.replace("/");
      }
    };
    successFunc();
  }, [isSuccess]);
  const onSubmit = (data) => {
    createUser(data);
  };
  return (
    <View className="w-11/12 bg-gray-100 mx-auto p-3">
      <Text className="text-4xl text-center my-3">Sign Up</Text>
      <View className=" my-3">
        <Text className="text-xl mb-1">Username</Text>
        <Controller
          control={control}
          rules={{
            required: "Username is required",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`border-2 border-gray-600 ${
                errors.username && "border-red-600"
              } rounded-lg p-3`}
              keyboardType="default"
              placeholder="Please enter an unique username"
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
      </View>
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
              placeholder="Please enter your name"
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
        <Text className="text-xl mb-1">Email</Text>
        <Controller
          control={control}
          rules={{
            required: "Email is required",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`border-2 border-gray-600 ${
                errors.email && "border-red-600"
              } rounded-lg p-3`}
              keyboardType="email-address"
              placeholder="Please enter your e-mail"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="email"
        />
        {errors.email && (
          <Text className="text-red-600">{errors.email.message}</Text>
        )}
      </View>
      <View className=" my-3">
        <Text className="text-xl mb-1">Password</Text>
        <Controller
          control={control}
          rules={{
            required: "Password is required",
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className={`border-2 border-gray-600 ${
                errors.password && "border-red-600"
              } rounded-lg p-3`}
              secureTextEntry={true}
              keyboardType="visible-password"
              placeholder="Please enter your password"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="password"
        />
        {errors.password && (
          <Text className="text-red-600">{errors.password.message}</Text>
        )}
      </View>
      <View className="my-3">
        <Button
          className="rounded-3xl bg-lime-500"
          title="Sign Up"
          onPress={handleSubmit(onSubmit)}
        />
      </View>
      <View>
        <Text>
          Already Signup?{" "}
          <Link className="text-blue-500" href={"/login"}>
            Login
          </Link>
        </Text>
      </View>
    </View>
  );
};

export default SignUp;
