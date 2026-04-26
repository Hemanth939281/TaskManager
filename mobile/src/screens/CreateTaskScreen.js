import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from "react-native";
import { useState } from "react";
import API from "../services/api";

export default function CreateTaskScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(false);

  const createTask = async () => {
    try {
      setLoading(true);
      await API.post("/tasks", { title, description, assignedTo });
      Alert.alert("Success", "Task created successfully");
      setTitle("");
      setDescription("");
      setAssignedTo("");
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Create Task</Text>
      <Text style={styles.subtitle}>Fill in the details below</Text>

      <Text style={styles.label}>Title</Text>
      <TextInput
        placeholder="Task title"
        placeholderTextColor="#adb5bd"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        placeholder="What needs to be done?"
        placeholderTextColor="#adb5bd"
        value={description}
        onChangeText={setDescription}
        style={[styles.input, styles.textArea]}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />

      <Text style={styles.label}>Assign To (User ID)</Text>
      <TextInput
        placeholder="User ID"
        placeholderTextColor="#adb5bd"
        value={assignedTo}
        onChangeText={setAssignedTo}
        style={styles.input}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={createTask}
        disabled={loading}
        activeOpacity={0.85}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Create Task</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a1a2e",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 28,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#dee2e6",
    backgroundColor: "#fff",
    marginBottom: 18,
    padding: 13,
    borderRadius: 10,
    fontSize: 15,
    color: "#212529",
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  button: {
    backgroundColor: "#4361ee",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: "#a0aec0",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
    letterSpacing: 0.4,
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: 10,
  },
  cancelText: {
    color: "#6c757d",
    fontSize: 14,
    fontWeight: "500",
  },
});