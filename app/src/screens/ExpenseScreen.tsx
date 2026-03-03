import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Button,
  Card,
  TextInput,
  Divider,
  Checkbox,
  Chip,
  SegmentedButtons,
  List,
} from 'react-native-paper';

type SplitType = 'equal' | 'percentage' | 'manual';

interface Member {
  id: string;
  name: string;
  amount: number;
  selected: boolean;
}

const ExpenseScreen: React.FC = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [splitType, setSplitType] = useState<SplitType>('equal');
  const [paidBy, setPaidBy] = useState('You');
  const [paidByMenuVisible, setPaidByMenuVisible] = useState(false);

  // Mock members - would come from group context
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: 'You', amount: 0, selected: true },
    { id: '2', name: 'Alice', amount: 0, selected: true },
    { id: '3', name: 'Bob', amount: 0, selected: true },
    { id: '4', name: 'Charlie', amount: 0, selected: false },
  ]);

  const toggleMember = (id: string) => {
    setMembers(members.map(m => 
      m.id === id ? { ...m, selected: !m.selected } : m
    ));
  };

  const selectedMembers = members.filter(m => m.selected);
  const totalAmount = parseFloat(amount) || 0;

  const calculateSplit = () => {
    if (selectedMembers.length === 0 || totalAmount === 0) return;
    
    const splitAmount = totalAmount / selectedMembers.length;
    setMembers(members.map(m => ({
      ...m,
      amount: m.selected ? splitAmount : 0,
    })));
  };

  const addExpense = () => {
    // TODO: Implement expense creation
    console.log('Adding expense:', { description, amount, splitType, paidBy });
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            style={styles.input}
          />
          
          <TextInput
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            mode="outlined"
            keyboardType="decimal-pad"
            style={styles.input}
            left={<TextInput.Affix text="$" />}
          />

          <Text variant="labelLarge" style={styles.label}>Split Type</Text>
          <SegmentedButtons
            value={splitType}
            onValueChange={(value) => setSplitType(value as SplitType)}
            buttons={[
              { value: 'equal', label: 'Equal' },
              { value: 'percentage', label: '%' },
              { value: 'manual', label: 'Custom' },
            ]}
            style={styles.segmentedButtons}
          />

          <Text variant="labelLarge" style={styles.label}>Paid By</Text>
          <Chip icon="account" style={styles.paidByChip}>
            {paidBy}
          </Chip>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Split With</Text>
          <List.Section>
            {members.map((member) => (
              <List.Item
                key={member.id}
                title={member.name}
                left={() => (
                  <Checkbox
                    status={member.selected ? 'checked' : 'unchecked'}
                    onPress={() => toggleMember(member.id)}
                  />
                )}
                right={() => member.selected && amount ? (
                  <Text variant="bodyMedium">
                    ${((parseFloat(amount) || 0) / selectedMembers.length).toFixed(2)}
                  </Text>
                ) : null}
              />
            ))}
          </List.Section>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={addExpense}
        style={styles.addButton}
        disabled={!description || !amount}
      >
        Add Expense
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  label: {
    marginTop: 8,
    marginBottom: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  paidByChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  addButton: {
    marginVertical: 16,
  },
});

export default ExpenseScreen;
