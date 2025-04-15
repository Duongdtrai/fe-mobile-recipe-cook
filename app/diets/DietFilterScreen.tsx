import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useNavigation, useRoute } from "@react-navigation/native";
import API from "@/config/api";
import { toast } from "react-toastify";
import { showErrorToast } from "@/helper/toast";

const windowWidth = Dimensions.get("window").width;
const itemSize = (windowWidth - 60) / 2;

const DietFilterScreen: React.FC = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { category_id }: any = route.params;

  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [metadata, setMetadata] = useState({
    totalElements: 0,
    totalPages: 0,
    size: 10,
    page: 0,
  });
  useEffect(() => {
    fetchData(metadata.page + 1);
  }, []);

  const fetchData = async (pageToFetch: number) => {
    // if (isLoading) return;
    setIsLoading(true);
    try {
      console.log("duong");
      const response = await API.getListRecipes(+category_id, pageToFetch);
      console.log("response: ", response);
      const newData = response.data.data.data;
      const meta = response.data.data.metadata;

      setData((prev) => [...prev, ...newData]);
      setMetadata(meta);
    } catch (error) {
      showErrorToast(toast, "Error: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggle = (key: number) => {
    setSelected((prev) => (prev[0] === key ? [] : [key])); // Chỉ chọn 1 chế độ
  };

  const handleLoadMore = () => {
    if (!isLoading && metadata.page + 1 < metadata.totalPages) {
      fetchData(metadata.page + 1);
      setMetadata((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Công thưc các món ăn</Text>

      <FlatList
        data={data}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        renderItem={({ item }) => {
          const isSelected = selected.includes(item.id);
          return (
            <TouchableOpacity
              style={[styles.card, isSelected && styles.selectedCard]}
              onPress={() => toggle(item.id)} // <-- đây phải được gọi
              activeOpacity={0.8}
            >
              <Image source={{ uri: item.image }} style={styles.icon} />
              <Text style={styles.label}>{item.title}</Text>
              {isSelected && <Text style={styles.check}>✓</Text>}
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{ paddingBottom: 20 }}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={() => {
          navigation.navigate("diets/DietDetailScreen", {
            recipe_id: selected[0],
          });
        }}
        disabled={selected.length === 0}
      >
        <Text style={styles.confirmText}>Xem chi tiết</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DietFilterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: {
    width: itemSize,
    height: itemSize,
    backgroundColor: "#f7f7f7",
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    position: "relative",
  },
  selectedCard: {
    backgroundColor: "#c8f7c5",
    borderColor: "#4caf50",
    borderWidth: 2,
  },
  icon: { width: 50, height: 50, marginBottom: 10 },
  label: { fontSize: 14, fontWeight: "600", textAlign: "center" },
  check: {
    position: "absolute",
    top: 8,
    right: 10,
    fontSize: 18,
    color: "#2e7d32",
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#4caf50",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
