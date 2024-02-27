import { View, Text, TextInput, Button, ToastAndroid } from "react-native";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, router } from "expo-router";
import { useLoginMutation } from "../../redux/features/modules/users/userApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loginUser, { isError, isLoading, data, isSuccess, error }] =
    useLoginMutation();
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
    loginUser(data);
  };
  return (
    <View className="w-11/12 bg-gray-100 mx-auto p-3">
      <Text className="text-4xl text-center my-3">Login</Text>
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
      </View>
      <View className=" my-3">
        <Text className="text-xl mb-1">Passowrd</Text>
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
          title="Login"
          onPress={handleSubmit(onSubmit)}
        />
      </View>
      <View>
        <Text>
          Don’t have an account yet?{" "}
          <Link className="text-blue-500" href={"/sign-up"}>
            Sign up
          </Link>
        </Text>
      </View>
    </View>
  );
};

export default Login;
