import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import API from "@/config/api";
import { toast } from "react-toastify";
import { showErrorToast } from "@/helper/toast";

export const CommentSection = ({ recipe_id }: { recipe_id: number }) => {
  console.log("recipe_id: ", recipe_id);
  const [comments, setComments] = useState<any>([]);
  const [input, setInput] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    fetchData(recipe_id);
  }, [recipe_id, loading]);

  const fetchData = async (recipe_id: number) => {
    try {
      console.log(123123);
      const response = await API.getListCommentsRecipes(recipe_id);
      const mapData = response.data.data.map((item: any) => {
        return {
          id: item?.id,
          user: item?.user?.fullname,
          avatar: item?.user?.avatar,
          rating: item?.rating,
          content: item?.content,
        };
      });
      setComments(mapData);
      // setIsLoading(false);
    } catch (error) {
      // setIsLoading(false);
      showErrorToast(toast, "Error: " + error);
    }
  };

  const handleSend = async () => {
    console.log("input: ", input);
    if (!input) return;
    await API.createCommentsRecipes(recipe_id, {
      rating: rating,
      content: input,
    });
    setLoading(!loading);
    setInput("");
  };

  return (
    <View style={{ marginTop: 20, marginBottom: 20 }}>
      <Text style={styles.sectionTitle}>🗨️ Bình luận & đánh giá</Text>

      {/* Comment Input */}
      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Nhập bình luận của bạn..."
          style={styles.textInput}
        />
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Text
              key={star}
              style={{
                fontSize: 18,
                color: star <= rating ? "#ffc107" : "#ccc",
              }}
              onPress={() => setRating(star)}
            >
              ★
            </Text>
          ))}
        </View>
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={{ color: "white" }}>Gửi</Text>
        </TouchableOpacity>
      </View>

      {/* Render Comments */}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Image
              source={{
                uri:
                  item.avatar ??
                  "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg",
              }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.username}>{item.user}</Text>
              <Text style={styles.commentText}>{item.content}</Text>
              <Text style={styles.stars}>
                {"★".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
  },
  textInput: {
    backgroundColor: "#fff",
    borderRadius: 6,
    padding: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  sendButton: {
    backgroundColor: "#4caf50",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-start",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontWeight: "bold",
  },
  commentText: {
    color: "#444",
  },
  stars: {
    color: "#ffc107",
    marginTop: 4,
  },
});
