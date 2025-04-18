import React, { useEffect, useState } from "react";
import {
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { CommentSection } from "./CommentSection";
import API from "@/config/api";
import { toast } from "react-toastify";
import { showErrorToast } from "@/helper/toast";
import { View } from "@/components/Themed";
import LottieView from "lottie-react-native";
const DietDetailScreen: React.FC = () => {
  const route = useRoute<any>();
  const { recipe_id }: any = route.params;
  const [data, setData] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true); // Thêm state isLoading
  useEffect(() => {
    fetchData(recipe_id);
  }, [recipe_id]);

  const fetchData = async (recipe_id: number) => {
    try {
      setIsLoading(true);
      const response = await API.getRecipeDetail(recipe_id);
      setData(response.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      showErrorToast(toast, "Error: " + error);
    }
  };

  if (!data) return <Text>Không tìm thấy thông tin.</Text>;
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <LottieView
          autoPlay
          loop
          style={styles.loading}
          source={require("../../assets/animations/loading.json")} // Đảm bảo path chính xác
        />
      </View>
    );
  }
  const totalCalories =
    data?.ingredients?.reduce(
      (sum: any, item: any) => sum + item.calories,
      0
    ) || 0;
  return (
    <>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{data?.title}</Text>
        <Image source={{ uri: data?.image }} style={styles.image} />
        <Text style={styles.sectionTitle}>📖 Mô tả</Text>
        <Text style={styles.text}>{data?.description}</Text>
        <Text style={styles.sectionTitle}>🥗 Nguyên liệu</Text>
        {data?.ingredients?.map((item: any, index: number) => (
          <View key={index} style={styles.ingredientCard}>
            <Image
              source={{ uri: item.image }}
              style={styles.ingredientImage}
            />
            <View style={styles.ingredientInfo}>
              <Text style={styles.ingredientName}>{item.name}</Text>
              <Text style={styles.ingredientDesc}>{item.description}</Text>
              <Text style={styles.ingredientDetail}>
                ⚖️ {item.grams}g | 🔥 {item.calories} kcal
              </Text>
            </View>
          </View>
        ))}

        <View style={styles.totalCaloriesBox}>
          <Text style={styles.totalCaloriesText}>
            🔢 Tổng calo: {totalCalories} kcal
          </Text>
        </View>
        <CommentSection recipe_id={recipe_id} />
      </ScrollView>
    </>
  );
};

export default DietDetailScreen;

const styles = StyleSheet.create({
  ingredientCard: {
    flexDirection: "row",
    marginBottom: 14,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 10,
    elevation: 2,
  },
  ingredientImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  ingredientInfo: {
    flex: 1,
    justifyContent: "center",
  },
  ingredientName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#333",
  },
  ingredientDesc: {
    fontSize: 14,
    color: "#777",
    marginVertical: 4,
  },
  ingredientDetail: {
    fontSize: 14,
    color: "#555",
  },
  totalCaloriesBox: {
    marginTop: 24,
    padding: 14,
    backgroundColor: "#FFF3E0",
    borderRadius: 10,
    alignItems: "center",
  },
  totalCaloriesText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E65100",
  },
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#4caf50",
  },
  image: {
    width: Dimensions.get("window").width - 40,
    height: 200,
    resizeMode: "contain",
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 6,
    color: "#333",
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: "#555",
  },
  bullet: {
    fontSize: 15,
    lineHeight: 22,
    marginLeft: 10,
    color: "#444",
  },
  comment: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  commentUser: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  commentText: {
    color: "#444",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  loading: {
    width: 150,
    height: 150,
  },
});
