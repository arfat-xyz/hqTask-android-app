import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  useDeleteSpecificTourExpenseMutation,
  useGetAllExpenseForSpecificTourQuery,
} from "../../../../redux/features/modules/tour/tourApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EditExpenses from "../../../../components/EditExpenses";

export default function DetailsPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loginUser, setLoginUser] = useState(null);
  const { slug: id } = useLocalSearchParams();
  const {
    isLoading: getAllExpenseIsLoading,
    isSuccess: getAllExpenseIsSuccess,
    data: getAllExpenseData,
  } = useGetAllExpenseForSpecificTourQuery(id, { pollingInterval: 30000 });
  const [deleteSpecificTourExpense] = useDeleteSpecificTourExpenseMutation();
  useEffect(() => {
    const getUserFromStorage = async () => {
      const tempUser = JSON.parse(await AsyncStorage.getItem("user"));
      setLoginUser(tempUser);
    };
    getUserFromStorage();
  }, []);
  const deleteExpense = (id) => {
    deleteSpecificTourExpense(id);
    setShowDeleteModal(false);
  };
  return (
    <View className="w-11/12 mx-auto overflow-scroll">
      {getAllExpenseIsLoading && (
        <ActivityIndicator
          color={"red"}
          size={30}
          className="w-full h-screen"
        />
      )}

      {getAllExpenseData?.data && (
        <View>
          <Text className="my-4 text-2xl text-center">All Expenses</Text>
          <View>
            <ScrollView horizontal>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    borderBottomWidth: 1,
                    borderBottomColor: "#ccc",
                  }}
                >
                  <View
                    className={`w-28 bg-green-600 text-white border-r-2 border-white py-2`}
                  >
                    <Text className=" text-white text-center">Username</Text>
                  </View>
                  <View
                    className={`w-28 bg-green-600 text-white border-r-2 border-white py-2`}
                  >
                    <Text className=" text-white text-center">Amount</Text>
                  </View>
                  <View
                    className={`w-56 bg-green-600 text-white border-r-2 border-white py-2`}
                  >
                    <Text className=" text-white text-center">Details</Text>
                  </View>
                  {getAllExpenseData?.data[0]?.tour?.author ===
                    loginUser?._id && (
                    <>
                      <View
                        className={`w-28 bg-green-600 text-white border-r-2 border-white py-2`}
                      >
                        <Text className=" text-white text-center">Edit</Text>
                      </View>
                      <View
                        className={`w-28 bg-green-600 text-white border-r-2 border-white py-2`}
                      >
                        <Text className=" text-white text-center">Delete</Text>
                      </View>
                    </>
                  )}
                </View>
                <FlatList
                  data={getAllExpenseData?.data}
                  keyExtractor={(_tourUser, index) => index.toString()}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        flexDirection: "row",
                        borderBottomWidth: 1,
                        borderBottomColor: "#eee",
                      }}
                    >
                      <View
                        className={`w-28 bg-gray-300 text-white border-r-2 border-white py-2`}
                      >
                        <Text className=" text-black text-center">
                          {item?.user?.username}
                        </Text>
                      </View>
                      <View
                        className={`w-28 bg-gray-300 text-black border-r-2 border-white py-2`}
                      >
                        <Text className=" text-black text-center">
                          {item?.amount}
                        </Text>
                      </View>
                      <View
                        className={`w-56 bg-gray-300 text-black border-r-2 border-white py-2`}
                      >
                        <Text className=" text-black text-center">
                          {item?.description}
                        </Text>
                      </View>
                      {getAllExpenseData?.data[0]?.tour?.author ===
                        loginUser?._id && (
                        <>
                          <EditExpenses data={item} />
                          <View
                            className={`w-28 bg-gray-300 text-black border-r-2 border-white py-2`}
                          >
                            <Text
                              onPress={() => setShowDeleteModal(true)}
                              className=" text-blue-500 underline pb-1 text-center"
                            >
                              Delete
                            </Text>
                            <Modal
                              visible={showDeleteModal}
                              animationType="slide"
                              className="w-full h-80 bg-red-400"
                              transparent
                            >
                              <View className="flex-1 justify-center items-center">
                                <View className="w-72 p-2 rounded-lg bg-gray-200">
                                  <Text className="text-xl">
                                    Are you sure? to delete{" "}
                                    {item?.user?.username}
                                    's expense
                                  </Text>
                                  <Text
                                    onPress={() => deleteExpense(item?._id)}
                                    className="bg-red-600 text-white text-center my-2 py-1 rounded-lg"
                                  >
                                    Yes
                                  </Text>
                                  <Text
                                    onPress={() => setShowDeleteModal(false)}
                                    className="bg-green-600 text-white text-center my-2 py-1 rounded-lg"
                                  >
                                    No
                                  </Text>
                                </View>
                              </View>
                            </Modal>
                          </View>
                        </>
                      )}
                    </View>
                  )}
                />
              </View>
            </ScrollView>
          </View>
          {/* <Text className="my-4 text-2xl text-center">All Deposit</Text>
          <View className="flex-row">
            <View>
              <Text>Username</Text>
            </View>
            <View>
              <Text>Amount</Text>
            </View>
            <View>
              <Text>Edit/Delete</Text>
            </View>
          </View> */}
        </View>
      )}
    </View>
  );
}
