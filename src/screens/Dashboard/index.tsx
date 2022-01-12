import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'styled-components';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { useAuth } from '../../hooks/auth';

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
  const { signOut, user } = useAuth();

  function getLastTransactionDate(
    collection: DataListProps[], 
    type: 'positive' | 'negative'
    ) {
        const filteredCollection = collection
          .filter(transaction => transaction.type === type);
          
        if (filteredCollection.length === 0) 
          return 0;
        
        const lastTransaction = new Date(Math.max.apply(Math, filteredCollection
          .map(transaction => new Date(transaction.date).getTime())));
          
        return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`
    }

    async function loadTransactions() {
      const dataKey = `@gofinances:transactions_user:${user.id}`;
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
      
      const lastIncomeFormatted = `Última entrada dia ${lastIncome}`
    
      const lastExpenseFormatted = `Última saída dia ${lastExpense}`
      
      const totalInterval = `01 a ${lastIncome}`

      setHighlightData({
        entries: {
          total: entriesTotalFormatted,
          lastTransaction: lastIncome === 0 ? 'Não há transações' : `Última entrada dia ${lastIncome}`
          // lastTransaction: lastIncomeFormatted
        },
        expenses: {
          total: expensesTotalFormatted,
          lastTransaction: lastExpense === 0 ? 'Não há transações' : `Última saída dia ${lastExpense}`
        },
        balance: balanceFormatted,
        totalInterval: lastExpense === 0 ? 'Não há transações' : `01 a ${lastExpense}`
      });
      


      setIsLoading(false);
    }

    // useEffect(() => {
    //   loadTransactions();
    // },[]);

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
              <Photo source={{ uri: user.photo }} />
              {/* <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/7139440?v=4'}} /> */}
              <User>
                <UserGreeting>Olá,</UserGreeting>
                <UserName>{user.name}</UserName>
              </User>
            </UserInfo>

            <LogoutButton onPress={signOut}>
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