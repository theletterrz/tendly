import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, CircleCheck as CheckCircle2, Circle, Calendar, Flag, Leaf, Clock } from 'lucide-react-native';
import { useTaskGarden } from '@/hooks/useTaskGarden';

export default function TasksScreen() {
  const { tasks, completeTask, addTask } = useTaskGarden();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    category: 'personal' as const,
  });

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      await completeTask(taskId);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    await addTask(newTask);
    setNewTask({ title: '', description: '', priority: 'medium', category: 'personal' });
    setShowAddModal(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#D97757';
      case 'medium': return '#F59E0B';
      case 'low': return '#87A96B';
      default: return '#87A96B';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'work': return '💼';
      case 'health': return '💪';
      case 'learning': return '📚';
      case 'personal': return '🏠';
      default: return '📝';
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#E8F4E6', '#F5F1E8']}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Task Garden</Text>
              <Text style={styles.subtitle}>
                {pendingTasks.length} tasks to plant • {completedTasks.length} growing
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddModal(true)}
            >
              <Plus size={24} color="#F5F1E8" />
            </TouchableOpacity>
          </View>

          {/* Pending Tasks */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ready to Plant 🌱</Text>
            {pendingTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskCard}
                onPress={() => toggleTask(task.id)}
              >
                <View style={styles.taskLeft}>
                  <Circle size={24} color="#87A96B" strokeWidth={2} />
                  <View style={styles.taskContent}>
                    <View style={styles.taskHeader}>
                      <Text style={styles.taskTitle}>{task.title}</Text>
                      <View style={styles.taskMeta}>
                        <Text style={styles.categoryEmoji}>
                          {getCategoryIcon(task.category)}
                        </Text>
                        <View 
                          style={[
                            styles.priorityIndicator, 
                            { backgroundColor: getPriorityColor(task.priority) }
                          ]} 
                        />
                      </View>
                    </View>
                    {task.description && (
                      <Text style={styles.taskDescription}>{task.description}</Text>
                    )}
                    <View style={styles.taskFooter}>
                      <View style={styles.rewardInfo}>
                        <Leaf size={14} color="#87A96B" />
                        <Text style={styles.rewardText}>+{task.compost_reward} compost</Text>
                      </View>
                      {task.due_date && (
                        <View style={styles.dueDate}>
                          <Clock size={12} color="#8B7355" />
                          <Text style={styles.dueText}>
                            {new Date(task.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Completed Tasks */}
          {completedTasks.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Growing Strong 🌿</Text>
              {completedTasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={[styles.taskCard, styles.completedTask]}
                  onPress={() => toggleTask(task.id)}
                >
                  <View style={styles.taskLeft}>
                    <CheckCircle2 size={24} color="#87A96B" />
                    <View style={styles.taskContent}>
                      <Text style={[styles.taskTitle, styles.completedTitle]}>
                        {task.title}
                      </Text>
                      <View style={styles.taskFooter}>
                        <View style={styles.rewardInfo}>
                          <Leaf size={14} color="#87A96B" />
                          <Text style={styles.rewardText}>+{task.compost_reward} earned</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Add Task Modal */}
        <Modal
          visible={showAddModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Text style={styles.cancelButton}>Cancel</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Plant New Task</Text>
              <TouchableOpacity onPress={handleAddTask}>
                <Text style={styles.saveButton}>Plant</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Task Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="What would you like to accomplish?"
                  value={newTask.title}
                  onChangeText={(text) => setNewTask({ ...newTask, title: text })}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description (optional)</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="Add some details..."
                  value={newTask.description}
                  onChangeText={(text) => setNewTask({ ...newTask, description: text })}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Priority</Text>
                <View style={styles.prioritySelector}>
                  {(['low', 'medium', 'high'] as const).map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.priorityOption,
                        newTask.priority === priority && styles.prioritySelected,
                        { borderColor: getPriorityColor(priority) }
                      ]}
                      onPress={() => setNewTask({ ...newTask, priority })}
                    >
                      <Text style={[
                        styles.priorityText,
                        newTask.priority === priority && { color: getPriorityColor(priority) }
                      ]}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <View style={styles.categorySelector}>
                  {(['personal', 'work', 'health', 'learning'] as const).map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryOption,
                        newTask.category === category && styles.categorySelected
                      ]}
                      onPress={() => setNewTask({ ...newTask, category })}
                    >
                      <Text style={styles.categoryEmoji}>
                        {getCategoryIcon(category)}
                      </Text>
                      <Text style={[
                        styles.categoryText,
                        newTask.category === category && styles.categorySelectedText
                      ]}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F1E8',
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C5F41',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
  },
  addButton: {
    backgroundColor: '#87A96B',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C5F41',
    marginBottom: 16,
  },
  taskCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(229, 221, 208, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  completedTask: {
    backgroundColor: 'rgba(135, 169, 107, 0.1)',
    borderColor: 'rgba(135, 169, 107, 0.3)',
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C5F41',
    flex: 1,
    marginRight: 8,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#87A96B',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryEmoji: {
    fontSize: 16,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rewardText: {
    fontSize: 12,
    color: '#87A96B',
    fontWeight: '500',
  },
  dueDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueText: {
    fontSize: 12,
    color: '#8B7355',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F5F1E8',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 221, 208, 0.6)',
  },
  cancelButton: {
    fontSize: 16,
    color: '#8B7355',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C5F41',
  },
  saveButton: {
    fontSize: 16,
    color: '#87A96B',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C5F41',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(229, 221, 208, 0.6)',
    color: '#2C5F41',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityOption: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  prioritySelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(229, 221, 208, 0.6)',
    minWidth: '45%',
  },
  categorySelected: {
    backgroundColor: 'rgba(135, 169, 107, 0.1)',
    borderColor: '#87A96B',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categorySelectedText: {
    color: '#87A96B',
  },
});