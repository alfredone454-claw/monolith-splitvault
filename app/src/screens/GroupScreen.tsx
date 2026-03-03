import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {
  Text,
  Button,
  Card,
  FAB,
  Portal,
  Dialog,
  TextInput,
  List,
} from 'react-native-paper';

interface Group {
  id: string;
  name: string;
  totalMembers: number;
}

const GroupScreen: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([
    { id: '1', name: 'Weekend Trip', totalMembers: 4 },
    { id: '2', name: 'Roommates', totalMembers: 3 },
  ]);
  const [visible, setVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  const showDialog = () => setVisible(true);
  const hideDialog = () => {
    setVisible(false);
    setNewGroupName('');
  };

  const createGroup = () => {
    if (newGroupName.trim()) {
      const newGroup: Group = {
        id: Date.now().toString(),
        name: newGroupName.trim(),
        totalMembers: 0,
      };
      setGroups([...groups, newGroup]);
      hideDialog();
    }
  };

  const renderGroup = ({ item }: { item: Group }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium">{item.name}</Text>
        <Text variant="bodySmall">{item.totalMembers} members</Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={groups}
        renderItem={renderGroup}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Create New Group</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Group Name"
              value={newGroupName}
              onChangeText={setNewGroupName}
              mode="outlined"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button onPress={createGroup} mode="contained">
              Create
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={showDialog}
        label="Create Group"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default GroupScreen;
