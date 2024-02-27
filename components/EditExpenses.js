import { View, Text, Modal, Button, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useUpdateSpecificTourExpenseMutation } from "../redux/features/modules/tour/tourApi";

export default function EditExpenses({ data }) {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [showModal, setShowModal] = useState(false);
  const [updateSpecificTourExpense, { isSuccess, isError, error }] =
    useUpdateSpecificTourExpenseMutation();
  useEffect(() => {
    setValue("amount", data?.amount.toString());
    setValue("description", data?.description);
  }, []);
  useEffect(() => {
    setShowModal(false);
  }, [isSuccess]);
  useEffect(() => {
  }, [isError]);
  const onSubmit = (updateData) => {
    updateData.id = data?._id;
    updateSpecificTourExpense(updateData);
  };
  return (
    <>
      <View
        className={`w-28 bg-gray-300 text-black border-r-2 border-white py-2`}
      >
        <Text
          onPress={() => setShowModal(true)}
          className=" text-blue-500 underline pb-1 text-center"
        >
          Edit
        </Text>
      </View>
      <Modal
        visible={showModal}
        animationType="slide"
        className="w-full h-80 bg-red-400"
        transparent
      >
        <View className="flex-1 justify-center items-center ">
          <View className="p-4 rounded-lg shadow-lg w-8/12 mx-auto bg-gray-200">
            <View className="my-2">
              <Text className="text-xl">Amount</Text>
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
              <Text className="text-xl">Description</Text>
              <Controller
                control={control}
                rules={{
                  required: "Description is required",
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    multiline
                    className={`border-2 border-gray-600 ${
                      errors.description && "border-red-600"
                    } rounded-lg p-3`}
                    keyboardType="decimal-pad"
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
                title="Update Expense"
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
    </>
  );
}
