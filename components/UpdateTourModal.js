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
import {
  useDeleteTourUserMutation,
  useGetUserForTourQuery,
  useUpdateTourMutation,
} from "../redux/features/modules/tour/tourApi";
import { useLazyGetAllUserQuery } from "../redux/features/modules/users/userApi";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function UpdateTourModal({ tour }) {
  const [showModal, setShowModal] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm();
  const [tourUsers, settourUsers] = useState([]);
  const [allUserData, setAllUserData] = useState([]);
  const { data, isLoading, isError } = useGetUserForTourQuery(tour?._id);
  const [
    getSearchUsers,
    {
      data: fetchedAllUsers,
      isError: allUserIsError,
      isSuccess: allUserIsSuccess,
      isFetching,
    },
  ] = useLazyGetAllUserQuery();
  const [updateTour, { isSuccess: updateSuccess }] = useUpdateTourMutation();
  const [
    deleteTourUser,
    {
      isSuccess: deleteSuccess,
      data: deletedData,
      error: deleteError,
      isError: deleteIsError,
    },
  ] = useDeleteTourUserMutation();
  useEffect(() => {
    if (deleteSuccess) {
      const temp = tourUsers.filter(
        (u) => u.username !== deletedData?.data?.username
      );
      settourUsers(temp);
      // setShowModal(false);
    }
  }, [deleteSuccess]);
  useEffect(() => {
    const temp = fetchedAllUsers?.data.map((u) => {
      // console.log(u?.username);
      return { username: u?._id, name: u?.username };
    });
    setAllUserData(temp);
  }, [allUserIsSuccess, isFetching]);
  useEffect(() => {
    if (deleteIsError) {
      console.log("Delete is error", deleteError?.data?.message);
      ToastAndroid.show(deleteError?.data?.message, ToastAndroid.SHORT);
    }
  }, [deleteError]);
  useEffect(() => {
    setShowModal(false);
  }, [updateSuccess]);
  useEffect(() => {
    getSearchUsers({ searchTerm: watch("userName") });
  }, [watch("userName")]);
  useEffect(() => {
    if (data?.data?.result.length > 0) {
      const temp = data?.data?.result.map((u) => ({
        username: u.username?._id,
        name: u?.username?.username,
      }));
      settourUsers(temp);
    }
  }, [data]);

  useEffect(() => {
    if (tour?._id) {
      setValue("name", tour?.name);
      setValue("description", tour?.description);
      setValue("initialPay", tour?.initialPay.toString());
    }
  }, []);
  const onSubmit = ({ userName, ...data }) => {
    const temp = tourUsers.map((u) => u.username);
    data.id = tour?._id;
    data.usernames = temp;
    updateTour(data);
  };
  const handlePushToUser = (user) => {
    settourUsers((prev) => [...prev, user]);
    setValue("userName", "");
  };
  const handleRemoveUserFromTour = (user, i) => {
    if (user?.username === tour?.author) {
      ToastAndroid.show("You can't remove yourself", ToastAndroid.SHORT);
    } else {
      // tourUsers.splice(i, 1);
      deleteTourUser({ username: user?.username, id: tour?._id });
    }
  };
  return (
    <View className="my-2">
      <View className="flex flex-row justify-center items-center gap-5">
        <View className="my-2 flex-[2]">
          <Modal
            transparent
            visible={showModal}
            animationType="slide"
            className="w-full h-80 bg-red-400"
          >
            <View className="flex-1 justify-center items-center">
              <View className="p-4 bg-white rounded-lg shadow-lg w-8/12 mx-auto ">
                <Text className="text-xl">Name</Text>
                <Controller
                  control={control}
                  rules={{
                    required: "Name is required",
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`border-2 my-2 border-gray-600 ${
                        errors.name && "border-red-600"
                      } rounded-lg p-3`}
                      keyboardType="default"
                      placeholder="Insert name"
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

                <Text className="text-xl mt-2">Description</Text>
                <Controller
                  control={control}
                  rules={{
                    required: "Description is required",
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      multiline
                      className={`border-2 my-2 border-gray-600 ${
                        errors.description && "border-red-600"
                      } rounded-lg p-3`}
                      keyboardType="default"
                      placeholder="Write description"
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
                <Text className="text-xl mt-2">Initial Pay</Text>
                <Controller
                  control={control}
                  rules={{
                    required: "Initial pay is required",
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`border-2 my-2 border-gray-600 ${
                        errors.initialPay && "border-red-600"
                      } rounded-lg p-3`}
                      keyboardType="decimal-pad"
                      placeholder="Write amount"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                  name="initialPay"
                />
                {errors.initialPay && (
                  <Text className="text-red-600">
                    {errors.initialPay.message}
                  </Text>
                )}
                <View className="my-2">
                  <View className="flex flex-row flex-wrap flex-4 gap-3">
                    {tourUsers?.length > 0 &&
                      tourUsers.map((user, i) => (
                        <Text
                          key={i}
                          className="flex-2 bg-gray-200 rounded-lg p-2"
                          onPress={() => handleRemoveUserFromTour(user, i)}
                        >
                          <AntDesign name="closecircleo" /> {user?.name}
                        </Text>
                      ))}
                  </View>

                  <Text className="text-xl mt-2">Search username</Text>
                  <Controller
                    control={control}
                    rules={{
                      required: false,
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        className={`border-2 my-2 border-gray-600 ${
                          errors.userName && "border-red-600"
                        } rounded-lg p-3`}
                        keyboardType="default"
                        placeholder="Write amount"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                    name="userName"
                  />
                  {errors.userName && (
                    <Text className="text-red-600">
                      {errors.userName.message}
                    </Text>
                  )}
                  <View className="flex flex-row flex-wrap flex-4 gap-3">
                    {allUserData?.length > 0 ? (
                      allUserData?.map((d) => {
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
                <View className="my-2">
                  <Button
                    title="Update"
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
          <Button title="Update tour" onPress={() => setShowModal(true)} />
        </View>
      </View>
    </View>
  );
}
