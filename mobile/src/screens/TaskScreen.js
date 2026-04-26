import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert, TextInput } from "react-native";
import { useState, useCallback } from "react";
import API from "../services/api";
import { getToken, removeToken } from "../utils/storage";
import { jwtDecode } from "jwt-decode";
import { useFocusEffect } from "@react-navigation/native";

export default function TaskScreen({ navigation }) {
  const [tasks, setTasks] = useState([]);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const handleLogout = async () => {
  Alert.alert("Logout", "Are you sure you want to logout?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Logout",
      style: "destructive",
      onPress: async () => {
        await removeToken();
        navigation.replace("Login");
      },
    },
  ]);
};

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data.data);
    } catch (err) {
      Alert.alert("Error", err.response?.data || err.message);
    }
  };

  const updateStatus = async (id) => {
    try {
      setUpdatingId(id);
      await API.put(`/tasks/${id}/status`, { status: "completed" });
      fetchTasks();
      Alert.alert("Success", "Task marked as completed");
    } catch (err) {
      Alert.alert("Error", err.response?.data || err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteTask = (id) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setDeletingId(id);
            await API.delete(`/tasks/${id}`);
            fetchTasks();
            Alert.alert("success", "Task deleted successfuly");
          } catch (err) {
            Alert.alert("Error", err.response?.data || err.message);
          } finally {
            setDeletingId(null);
          }
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        try {
          const token = await getToken();
          if (token) {
            const decoded = jwtDecode(token);
            setUserRole(decoded.role);
          }
        } catch (err) {
          console.log("Token decode error:", err);
        }
      };

      loadUser();
      fetchTasks();
    }, [])
  );

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = filter === "all" || task.status === filter;
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

            {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {userRole === "admin" ? "Admin Panel" : "My Workspace"}
          </Text>
          <Text style={styles.title}>
            {userRole === "admin" ? "All Tasks" : "My Tasks"}
          </Text>
        </View>
        <View style={styles.headerRight}>
          {userRole === "admin" && (
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate("CreateTask")}
              activeOpacity={0.85}
            >
              <Text style={styles.createButtonText}>＋ New Task</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.85}
          >
            <Text style={styles.logoutButtonText}>⎋ Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by title or description..."
          placeholderTextColor="#adb5bd"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")} activeOpacity={0.7}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {["all", "pending", "completed"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
            activeOpacity={0.8}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === "all" ? "All" : f === "pending" ? "⏳ Pending" : "✓ Done"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.taskCount}>
        {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
        {filter !== "all" ? ` ${filter}` : " total"}
        {search.length > 0 ? ` for "${search}"` : ""}
      </Text>

      {/* Task Cards */}
      {filteredTasks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>No tasks found</Text>
          <Text style={styles.emptySubText}>
            {search.length > 0 ? `No results for "${search}"` : `No ${filter !== "all" ? filter : ""} tasks yet`}
          </Text>
        </View>
      ) : (
        filteredTasks.map((task) => (
          <View key={task._id} style={styles.card}>

            {/* Title + Badge */}
            <View style={styles.cardTop}>
              <View style={styles.cardMatter}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskDescription}>{task.description}</Text>
              </View>
              <View style={[styles.badge, task.status === "completed" ? styles.badgeDone : styles.badgePending]}>
                <Text style={[styles.badgeText, task.status === "completed" ? styles.badgeDoneText : styles.badgePendingText]}>
                  {task.status === "completed" ? "✓ Done" : "⏳ Pending"}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>

              {task.status !== "completed" && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.completeBtn, updatingId === task._id && styles.btnDisabled]}
                  onPress={() => updateStatus(task._id)}
                  disabled={!!updatingId}
                  activeOpacity={0.85}
                >
                  {updatingId === task._id
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={styles.completeBtnText}>✔  Complete</Text>
                  }
                </TouchableOpacity>
              )}

              {userRole === "admin" && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.editBtn]}
                  onPress={() => navigation.navigate("EditTask", { task })}
                  activeOpacity={0.85}
                >
                  <Text style={styles.editBtnText}>✎  Edit</Text>
                </TouchableOpacity>
              )}

              {userRole === "admin" && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn, deletingId === task._id && styles.btnDisabled]}
                  onPress={() => deleteTask(task._id)}
                  disabled={!!deletingId}
                  activeOpacity={0.85}
                >
                  {deletingId === task._id
                    ? <ActivityIndicator color="#e63946" size="small" />
                    : <Text style={styles.deleteBtnText}>🗑  Delete</Text>
                  }
                </TouchableOpacity>
              )}

            </View>
          </View>
        ))
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  content: {
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  greeting: {
    fontSize: 13,
    color: "#6c757d",
    fontWeight: "500",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a1a2e",
  },
  createButton: {
    backgroundColor: "#4361ee",
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
    shadowColor: "#4361ee",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  // Search
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#212529",
  },
  clearIcon: {
    fontSize: 14,
    color: "#adb5bd",
    fontWeight: "700",
    paddingLeft: 8,
  },

  filterContainer: {
    flexDirection: "row",
    backgroundColor: "#e9ecef",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  filterBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  filterBtnActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  filterText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6c757d",
  },
  filterTextActive: {
    color: "#4361ee",
  },

  taskCount: {
    fontSize: 13,
    color: "#adb5bd",
    marginBottom: 14,
  },

  emptyContainer: {
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#495057",
    fontWeight: "600",
    marginBottom: 4,
  },
  emptySubText: {
    fontSize: 13,
    color: "#adb5bd",
  },

  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    width: "100%",
  },
  cardMatter: {
    flex: 1,
    marginRight: 10,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#212529",
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 13,
    fontWeight: "300",
    color: "#6c757d",
    lineHeight: 18,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  badgePending: { backgroundColor: "#fff8e1" },
  badgeDone: { backgroundColor: "#e8f5e9" },
  badgeText: { fontSize: 11, fontWeight: "700" },
  badgePendingText: { color: "#e65100" },
  badgeDoneText: { color: "#2e7d32" },
  divider: {
    height: 1,
    backgroundColor: "#f1f3f5",
    marginBottom: 12,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  completeBtn: {
    backgroundColor: "#4361ee",
    shadowColor: "#4361ee",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  completeBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  editBtn: {
    backgroundColor: "#f0f4ff",
    borderWidth: 1.5,
    borderColor: "#4361ee",
  },
  editBtnText: {
    color: "#4361ee",
    fontWeight: "700",
    fontSize: 13,
  },
  deleteBtn: {
    backgroundColor: "#fff0f0",
    borderWidth: 1.5,
    borderColor: "#e63946",
  },
  deleteBtnText: {
    color: "#e63946",
    fontWeight: "700",
    fontSize: 13,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  headerRight: {
  flexDirection: "row",
  alignItems: "center",
  gap: 8,
},
logoutButton: {
  backgroundColor: "#fff0f0",
  borderWidth: 1.5,
  borderColor: "#e63946",
  paddingHorizontal: 12,
  paddingVertical: 9,
  borderRadius: 10,
},
logoutButtonText: {
  color: "#e63946",
  fontWeight: "700",
  fontSize: 13,
},
});