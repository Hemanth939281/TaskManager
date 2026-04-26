import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import API from "../services/api";

export default function EditTaskScreen({ route, navigation }) {
  const { task } = route.params;

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  const [loading, setLoading] = useState(false);

  const updateTask = async () => {
    try {
      setLoading(true);

      await API.put(`/tasks/${task._id}`, {
        title,
        description,
      });

      Alert.alert("Success", "Task updated");

      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Task</Text>

      <TextInput
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />

      <Button
        title={loading ? "Updating..." : "Update Task"}
        onPress={updateTask}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, marginBottom: 20 },
  input: { borderWidth: 1, marginBottom: 15, padding: 10 },
});