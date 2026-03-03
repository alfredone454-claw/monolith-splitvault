import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {
  Text,
  Card,
  Avatar,
  List,
  Divider,
  Chip,
  Button,
} from 'react-native-paper';

interface Balance {
  id: string;
  name: string;
  amount: number; // Positive = owes you, Negative = you owe
  avatar?: string;
}

const BalanceScreen: React.FC = () => {
  const [balances, setBalances] = useState<Balance[]>([
    { id: '1', name: 'You', amount: 0 },
    { id: '2', name: 'Alice', amount: -25.5 }, // You owe Alice
    { id: '3', name: 'Bob', amount: 15.75 }, // Bob owes you
    { id: '4', name: 'Charlie', amount: 30.0 }, // Charlie owes you
    { id: '5', name: 'Dave', amount: -10.0 }, // You owe Dave
  ]);

  const totalOwed = balances.reduce((sum, b) => sum + Math.max(0, b.amount), 0);
  const totalOwe = balances.reduce((sum, b) => sum + Math.abs(Math.min(0, b.amount)), 0);
  const netBalance = totalOwed - totalOwe;

  const renderBalanceItem = ({ item }: { item: Balance }) => {
    const isOwed = item.amount > 0;
    const isOwe = item.amount < 0;

    return (
      <List.Item
        title={item.name}
        description={isOwed ? 'Owes you' : isOwe ? 'You owe' : 'Settled up'}
        left={(props) => (
          <Avatar.Text {...props} label={item.name.charAt(0)} />
        )}
        right={() => (
          <View style={styles.amountContainer}>
            <Text
              variant="titleMedium"
              style={[
                styles.amount,
                isOwed && styles.owed,
                isOwe && styles.owe,
              ]}
            >
              {isOwed ? '+' : ''}${Math.abs(item.amount).toFixed(2)}
            </Text>
            {isOwed && (
              <Chip compact style={styles.chip}>
                Collect
              </Chip>
            )}
            {isOwe && (
              <Chip compact style={styles.chip}>
                Pay
              </Chip>
            )}
          </View>
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.summaryTitle}>
            Group Balance Summary
          </Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text variant="bodySmall">You are owed</Text>
              <Text variant="headlineSmall" style={styles.positive}>
                ${totalOwed.toFixed(2)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text variant="bodySmall">You owe</Text>
              <Text variant="headlineSmall" style={styles.negative}>
                ${totalOwe.toFixed(2)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryItem}>
              <Text variant="bodySmall">Your balance</Text>
              <Text
                variant="headlineSmall"
                style={netBalance >= 0 ? styles.positive : styles.negative}
              >
                {netBalance >= 0 ? '+' : ''}${netBalance.toFixed(2)}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Member Balances
      </Text>

      <FlatList
        data={balances}
        renderItem={renderBalanceItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Divider />}
      />

      {netBalance !== 0 && (
        <Button
          mode="contained"
          style={styles.settleButton}
          icon={netBalance > 0 ? 'cash-check' : 'cash-multiple'}
        >
          {netBalance > 0 ? 'Request All Payments' : 'Settle All Debts'}
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    marginBottom: 16,
    elevation: 2,
  },
  summaryTitle: {
    textAlign: 'center',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
  },
  positive: {
    color: '#4CAF50',
  },
  negative: {
    color: '#F44336',
  },
  sectionTitle: {
    marginBottom: 8,
    marginLeft: 4,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    marginRight: 8,
  },
  owed: {
    color: '#4CAF50',
  },
  owe: {
    color: '#F44336',
  },
  chip: {
    marginLeft: 4,
  },
  settleButton: {
    marginTop: 16,
  },
});

export default BalanceScreen;
