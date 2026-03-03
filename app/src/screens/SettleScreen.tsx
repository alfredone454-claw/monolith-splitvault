import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Button,
  Card,
  TextInput,
  RadioButton,
  List,
  Chip,
  Portal,
  Dialog,
  SegmentedButtons,
  Divider,
} from 'react-native-paper';

type PaymentMethod = 'cash' | 'venmo' | 'paypal' | 'other';

interface Debt {
  id: string;
  name: string;
  amount: number;
  avatar?: string;
}

const SettleScreen: React.FC = () => {
  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', name: 'Charlie', amount: 30.0 },
    { id: '2', name: 'Dave', amount: 15.0 },
  ]);

  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  const totalDebt = debts.reduce((sum, d) => sum + d.amount, 0);

  const openPaymentDialog = (debt: Debt) => {
    setSelectedDebt(debt);
    setAmount(debt.amount.toFixed(2));
    setDialogVisible(true);
  };

  const hideDialog = () => {
    setDialogVisible(false);
    setSelectedDebt(null);
    setAmount('');
    setNote('');
  };

  const processPayment = () => {
    setDialogVisible(false);
    setConfirmationVisible(true);
  };

  const completePayment = () => {
    if (selectedDebt) {
      const paymentAmount = parseFloat(amount) || 0;
      const remaining = selectedDebt.amount - paymentAmount;
      
      setDebts(debts.map(d => 
        d.id === selectedDebt.id 
          ? { ...d, amount: Math.max(0, remaining) }
          : d
      ));
    }
    setConfirmationVisible(false);
    setSelectedDebt(null);
    setAmount('');
    setNote('');
  };

  const markAsSettled = (id: string) => {
    setDebts(debts.map(d => 
      d.id === id ? { ...d, amount: 0 } : d
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.summaryCard}>
        <Card.Content>
          <Text variant="bodySmall">Total you owe</Text>
          <Text variant="displaySmall" style={styles.totalAmount}>
            ${totalDebt.toFixed(2)}
          </Text>
        </Card.Content>
      </Card>

      <Text variant="titleMedium" style={styles.sectionTitle}>
        Outstanding Debts
      </Text>

      {debts.length === 0 || debts.every(d => d.amount === 0) ? (
        <Card style={styles.emptyCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.emptyText}>
              All settled up! 🎉