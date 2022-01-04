import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'styled-components';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';


import { 
  Container, 
  Header, 
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  TransactionsList,
  Title,
  LogoutButton,
  LoadContainer
} from './styles';
import theme from '../../global/styles/theme';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  total: string;
  lastTransaction: string;
}
interface HighlightData {
  entries: HighlightProps;
  expenses: HighlightProps;
  balance: string;
  totalInterval: string;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);
  const theme = useTheme();

  function getLastTransactionDate(
    collection: DataListProps[], 
    type: 'positive' | 'negative'
    ) {
        const lastTransaction = new Date(Math.max.apply(Math, collection
          .filter(transaction => transaction.type === type)
          .map(transaction => new Date(transaction.date).getTime())))
        return lastTransaction;  
    }

    async function loadTransactions() {
      const dataKey = '@gofinances:transactions';
      const response = await AsyncStorage.getItem(dataKey);
      const transactions = response ? JSON.parse(response) : [];

      let entriesTotal = 0;
      let expensesTotal = 0;

      const transactionsFormatted: DataListProps[] = transactions
        .map((item: DataListProps) => {

          if (item.type === 'positive') {
            entriesTotal += Number(item.amount);
          } else {
            expensesTotal += Number(item.amount);
          }

          const amount = Number(item.amount)
            .toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            });

            const date = Intl.DateTimeFormat('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit'
            }).format(new Date(item.date));

            return {
              id: item.id,
              description: item.description,
              amount,
              type: item.type,
              category: item.category,
              date
            }
        });
      setData(transactionsFormatted);

      const entriesTotalFormatted = entriesTotal
        .toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });
      
      const expensesTotalFormatted = expensesTotal
      .toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });

      const balance = entriesTotal - expensesTotal;
      const balanceFormatted = balance
        .toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        });

      const lastIncome = getLastTransactionDate(transactions, 'positive');
      const lastExpense = getLastTransactionDate(transactions, 'negative');

      const lastIncomeFormatted = `Última entrada dia ${lastIncome.getDate()} de ${lastIncome.toLocaleString(
        'pt-BR', { month: 'long' })}`
      
      const lastExpenseFormatted = `Última entrada dia ${lastExpense.getDate()} de ${lastExpense.toLocaleString(
      'pt-BR', { month: 'long' })}`
      
      const totalInterval = `01 a ${lastIncome.getDate()} de ${lastIncome.toLocaleString(
      'pt-BR', { month: 'long' })}`

      setHighlightData({
        entries: {
          total: entriesTotalFormatted,
          lastTransaction: lastIncomeFormatted
        },
        expenses: {
          total: expensesTotalFormatted,
          lastTransaction: lastExpenseFormatted
        },
        balance: balanceFormatted,
        totalInterval
      });

      setIsLoading(false);
    }

    useEffect(() => {
      loadTransactions();
    },[]);

    useFocusEffect(useCallback(() => {  
      loadTransactions();
    }, []))

  return (
    <Container>
      {
      isLoading ? 
        <LoadContainer>
          <ActivityIndicator 
            color={theme.colors.primary} 
            size="large"
          />
        </LoadContainer> :
      <>  
        <Header>
          <UserWrapper>
            <UserInfo>
              <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/7139440?v=4'}} />
              <User>
                <UserGreeting>Olá,</UserGreeting>
                <UserName>Josafá</UserName>
              </User>
            </UserInfo>

            <LogoutButton onPress={() => {}}>
              <Icon name="power"/>
            </LogoutButton>
          </UserWrapper>
        </Header>

        <HighlightCards>
          <HighlightCard 
            type="up"
            title="Entradas"
            amount={highlightData.entries.total}
            lastTransaction={highlightData.entries.lastTransaction}
          />
          <HighlightCard 
            type="down"
            title="Saídas"
            amount={highlightData.expenses.total}
            lastTransaction={highlightData.expenses.lastTransaction}
          />
          <HighlightCard 
            type="total"
            title="Saldo"
            amount={highlightData.balance}
            lastTransaction={highlightData.totalInterval}
          />
        </HighlightCards>

        <Transactions>
          <Title>Listagem</Title>

          <TransactionsList 
            data={data}
            keyExtractor={item => item.id}
            renderItem={({ item }) => <TransactionCard data={item} />}
          />
        </Transactions>
    </>
    }  
    </Container>
  )
}