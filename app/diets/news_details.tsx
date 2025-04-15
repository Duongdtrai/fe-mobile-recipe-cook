import React, { useEffect, useState } from "react";
import {
  View, Text, Image, TextInput, Platform, TouchableWithoutFeedback, Keyboard, Button, StyleSheet, ScrollView, FlatList, TouchableOpacity, Modal, KeyboardAvoidingView
}
  from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { showErrorToast } from "@/helper/toast";
import API from "@/config/api";
import { connect } from "react-redux";
import { mapStateToProps } from "@/constants/mapStateToProps";
import { useToast } from "react-native-toast-notifications";
// import DefaultImage from "../../assets/images/avatar-default.png";
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { set } from "date-fns";

interface UserDetailsProps {
  userState: any;
}

const Matches_Details: React.FC<UserDetailsProps> = (props) => {
  const user = props.userState.user;

  const toast = useToast();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const [newsData, setNewsData] = useState<any>();
  const [comments, setComments] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [commentText, setCommentText] = useState<string>("");
  const [editingComment, setEditingComment] = useState<any>(null); // Thêm state để lưu comment đang chỉnh sửa
  const [editedCommentText, setEditedCommentText] = useState<string>(""); // Thêm state để lưu nội dung mới của comment
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  // const DEFAULT_IMAGE = Image.resolveAssetSource(DefaultImage).uri;
  const DEFAULT_IMAGE = "https://secure.gravatar.com/avatar/656bff31e84d0067d752e1a0077d6877?s=500&d=mm&r=g";

  const formatDateTime = (dateTimeString: string) => {
    const dateTime = new Date(dateTimeString);
    const now = new Date();
    const diffMs = now.getTime() - dateTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) {
      return "Vừa xong";
    } else {
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

      if (diffDays > 0) {
        return `${diffDays} ngày trước`;
      } else if (diffHours > 0) {
        return `${diffHours} giờ trước`;
      } else {
        return `${diffMins} phút trước`;
      }
    }
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       navigation.setOptions({ title: "News Detail" });
  //       const newsResponse = await API.getDetailNews(route?.params?.newsId);
  //       const newsData = newsResponse.data.data;
  //       setNewsData(newsData);

  //       const commentResponse = await API.getListComments(
  //         route?.params?.newsId,
  //         page,
  //       );
  //       const commentsData = commentResponse?.data?.data?.data;
  //       setComments(commentsData.map((comment: any) => ({ ...comment, likes: 0 })));
  //       setTotalPages(commentResponse?.data?.data?.metadata?.totalPages);
  //     } catch (error) {
  //       showErrorToast(toast, "Error" + error);
  //     }
  //   };
  //   fetchData();
  // }, [route.params?.newsId, page]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        navigation.setOptions({ title: "News Detail" });
        const newsResponse = await API.getDetailNews(route?.params?.newsId);
        const newsData = newsResponse.data.data;
        setNewsData(newsData);
  
        const commentResponse = await API.getListComments(
          route?.params?.newsId,
          page,
        );
        const newCommentsData = commentResponse?.data?.data?.data;
        
        // Thêm các bình luận mới vào cuối danh sách hiện có
        setComments(prevComments => [...prevComments, ...newCommentsData.map((comment: any) => ({ ...comment, likes: 0 }))]);
  
        setTotalPages(commentResponse?.data?.data?.metadata?.totalPages);
      } catch (error) {
        showErrorToast(toast, "Error" + error);
      }
    };
    fetchData();
  }, [route.params?.newsId, page]);
  

  const renderCommentItem = ({ item }: any) => (
    <View style={styles.commentItem}>
      <View style={styles.userAvatarContainer}>
        <Image source={{ uri: item.userAvatar }} style={styles.userAvatar} />
      </View>
      <View style={styles.commentContent}>
        <Text style={styles.userEmail}>{item.userEmail}</Text>
        <Text style={styles.commentText}>{item.content}</Text>
        <View style={styles.detailContainer}>
          <Text style={styles.createdAt}>{formatDateTime(item.createdAt)}</Text>
          <View style={styles.likesContainer}>
            {user.id !== undefined && (
              <TouchableOpacity
                style={styles.likeButton}
                onPress={() => handleLike(item)}
              >
                {item.reacts.some((react: any) => react.userId === user.id) ? (
                  <AntDesign name="like1" size={20} color="gold" />
                ) : (
                  <AntDesign name="like2" size={20} color="gold" />
                )}
              </TouchableOpacity>
            )}
            <Text style={styles.likesCount}>
              {item.reacts ? item.reacts.length : 0}
            </Text>
          </View>
        </View>

        {user.email === item.userEmail && (
          <>
            {/* Nút sửa */}
            <View style={{ display: "flex", flexDirection: "row" }}>
              {/* Nút sửa */}
              <TouchableOpacity onPress={() => handleEdit(item)}>
                <Text>Sửa</Text>
              </TouchableOpacity>

              {/* Khoảng cách giữa 2 nút */}
              <View style={{ width: 10 }} />

              {/* Nút xóa */}
              <TouchableOpacity onPress={() => handleDeleteComment(item)}>
                <Text>Xóa</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );

  const handleEdit = (comment: any) => {
    setEditingComment(comment); // Lưu thông tin comment đang chỉnh sửa vào state
    setEditedCommentText(comment.content); // Hiển thị nội dung hiện tại của comment trong modal
    setShowEditModal(true); // Hiển thị modal chỉnh sửa
  };

  const handleSaveEdit = async () => {
    try {
      // Gửi yêu cầu chỉnh sửa comment đến API
      const response = await API.editComment({
        id: editingComment.id,
        content: editedCommentText,
        userId: user.id,
        newsId: route?.params?.newsId,
      });
      const updatedComments = comments.map((c: any) => {
        if (c.id === editingComment.id) {
          return { ...c, content: editedCommentText };
        }
        return c;
      });
      setComments(updatedComments);
      setShowEditModal(false); // Đóng modal sau khi chỉnh sửa thành công
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleLike = async (comment: any) => {
    try {

      // Determine the new status based on the current status
      let newStatus = !comment.liked;
      console.log("reacts:", comment.reacts)
      for (let i = 0; i < comment.reacts.length; i++) {
        if (comment.reacts[i].userId === user.id) {
          newStatus = false;
          setComments(comments.map((c: any) => {
            if (c.id === comment.id) {
              // Toggles the liked status
              c.liked = newStatus;

              // If it's liked, add react, otherwise remove it
              const reacts = (c.reacts || []).filter((react: any) => react.userId !== user.id);

              return { ...c, reacts };
            }
            return c;
          }));
        }
      }

      // Gửi yêu cầu like/unlike comment đến API
      await API.likeComment({ commentId: comment.id, status: newStatus });

      const updatedComments = comments.map((c: any) => {
        if (c.id === comment.id) {
          // Toggles the liked status
          c.liked = newStatus;

          // If it's liked, add react, otherwise remove it
          const updatedReact = {
            userId: user?.id,
            avatar: user?.avatar,
            fullName: user?.fullName,
          };
          const reacts = newStatus
            ? [...(c.reacts || []), updatedReact]
            : (c.reacts || []).filter((react: any) => react.userId !== user.id);

          return { ...c, reacts };
        }
        return c;
      });

      setComments(updatedComments);
    } catch (error) {
      // Xử lý trường hợp lỗi khi gửi yêu cầu
      console.error("Error toggling like status:", error);
    }
  };

  const handleDeleteComment = async (comment: any) => {
    try {
      console.log("Delete comment:", comment.id);
      // Gửi yêu cầu xóa comment đến API
      const response = await API.deleteComment(comment.id);

      // Nếu xóa thành công, cập nhật lại danh sách comment bằng cách loại bỏ comment đã bị xóa
      const updatedComments = comments.filter((c: any) => c.id !== comment.id);
      setComments(updatedComments);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleCommentButtonPress = async () => {
    if (commentText.trim() === "") {
      alert("Vui lòng nhập nội dung bình luận.");
      return;
    }
    try {
      // Gửi request để đăng comment
      const response = await API.postComment({
        newsId: route?.params?.newsId,
        content: commentText,
      });
      const newComment = response.data.data;
      newComment.userAvatar = user.avatar || DEFAULT_IMAGE;
      newComment.userEmail = user.email;
      newComment.fullName = user.fullName;
      newComment.reacts = [];
      setComments([newComment, ...comments]);
      setCommentText("");
    } catch (error) {
      showErrorToast(toast, "Error" + error);
    }
  };

  if (!newsData) {
    return (
      <View style={styles.container}>
        {/* <Text>Loading...</Text> */}
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <ScrollView
        keyboardShouldPersistTaps={"always"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.scrollViewContent}>
            <Text style={styles.title}>{newsData.title}</Text>
            <Image source={{ uri: newsData.imageUrl }} style={styles.image} />
            <Text style={styles.createdTime}>
              {formatDateTime(newsData.createdTime)}
            </Text>
            <Text style={styles.textContent}>{newsData.textContent}</Text>
            <Text style={styles.commentsTitle}>Bình luận</Text>
            <FlatList
              style={{ width: "100%" }}
              data={comments}
              renderItem={renderCommentItem}
              keyExtractor={(item) => item.id}
              onEndReachedThreshold={0.3}
              scrollEnabled={false}
            />
            {page <= totalPages - 1 && (
              <TouchableOpacity
                onPress={() => {
                  setPage(page + 1);
                  console.log("page:", page, "totalPages:", totalPages);
                  console.log("comments:", comments);
                }}
                style={styles.loadMoreButton}
              >
                <Text style={styles.loadMoreButtonText}>
                  Xem thêm Bình luận trước đó
                </Text>
              </TouchableOpacity>
            )}
            {user.id !== undefined && (
              <View style={styles.commentContainer}>
                <View style={styles.userAvatarContainer}>
                  <Image
                    source={{ uri: user.avatar }}
                    style={styles.userAvatar}
                  />
                </View>
                <View style={styles.commentInputContainer}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Nhập bình luận của bạn..."
                    onChangeText={setCommentText}
                    value={commentText}
                    multiline
                  />
                  <TouchableOpacity
                    onPress={handleCommentButtonPress}
                    style={styles.postButton}
                  >
                    <Entypo name="paper-plane" size={36} color="gold" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {/* Modal chỉnh sửa comment */}
            <Modal
              visible={showEditModal}
              animationType="slide"
              transparent={true}
              onRequestClose={() => setShowEditModal(false)}
            >
              <View style={styles.modalBackground}>
                <View style={styles.modalContent}>
                  <TextInput
                    // style={styles.input}
                    value={editedCommentText}
                    onChangeText={setEditedCommentText}
                    multiline
                    style={styles.commentEditInput}
                  />
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      onPress={() => setShowEditModal(false)}
                      style={[styles.modalButton, styles.cancelButton]}
                    >
                      <Text style={styles.buttonText}>Hủy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleSaveEdit}
                      style={[styles.modalButton, styles.saveButton]}
                    >
                      <Text style={styles.buttonText}>Lưu</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 300,
    marginBottom: 10,
    borderRadius: 10,
  },
  createdTime: {
    fontSize: 12,
    color: "#777",
    marginBottom: 10,
  },
  textContent: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "justify",
    marginBottom: 20,
  },
  commentsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
  },
  commentItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  userAvatarContainer: {
    marginTop: 3,
    marginLeft: 10,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentContent: {
    width: "100%",
    flex: 1,
    backgroundColor: "#F0F2F5",
    borderRadius: 8,
    padding: 10,
    marginLeft: 10,
  },
  userEmail: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
  },
  commentText: {
    fontSize: 16,
    width: "100%",
    marginBottom: 5,
  },
  detailContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },

  likesContainer: {
    display: "flex",
    flexDirection: "row",
  },
  likeButton: {
    color: "blue",
    fontSize: 15,
    marginRight: 5,
  },
  likesCount: {
    color: "#777",
    fontSize: 14,
    marginRight: 10,
  },
  createdAt: {
    color: "#777",
    fontSize: 12,
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    // marginLeft: 15,
  },
  commentInputContainer: {
    flex: 1,
    marginLeft: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F0F2F5",
    borderRadius: 10,
  },
  commentInput: {
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#F0F2F5",
  },

  postButton: {
    margin: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#F0F2F5",
    borderRadius: 10,
  },
  postButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "80%",
    height: "30%",
    padding: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  commentEditInput: {
    flex: 1,
    height: 60,
    width: "80%",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#F0F2F5",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    padding: 5, // Giảm padding để làm cho nút nhỏ hơn
    borderRadius: 5,
    width: "20%", // Giảm kích thước nút
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc", // Màu xám cho nút hủy
    marginRight: 10, // Khoảng cách giữa nút hủy và nút lưu
  },
  saveButton: {
    backgroundColor: "gold", // Màu vàng cho nút lưu
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadMoreButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "gold",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    width: "100%",
  },
  loadMoreButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default connect(mapStateToProps)(Matches_Details);
