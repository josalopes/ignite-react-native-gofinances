import React from 'react';
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
  Title
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard() {
  const data: DataListProps[] = [
    {
      id: '1',
      type: "income",
      title: "Desenvolvimento de site",
      amount: "R$ 12.000,00",
      category: { name: "Vendas", icon: "dollar-sign"},
      date: "13/04/2020"
    },
    {
      id: '2',
      type: "outcome",
      title: "Hamburgeria Pietro",
      amount: "R$ 59,00",
      category: { name: "Alimentação", icon: "coffee"},
      date: "10/04/2020"
    },
    {
      id: '3',
      type: "outcome",
      title: "Aluguel apartamento",
      amount: "R$ 1.200,00",
      category: { name: "Casa", icon: "shopping-bag"},
      date: "30/04/2020"
    }
  ]

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/7139440?v=4'}} />
            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Josafá</UserName>
            </User>
          </UserInfo>
          <Icon name="power"/>
        </UserWrapper>
      </Header>

      <HighlightCards>
        <HighlightCard 
          type="up"
          title="Entradas"
          amount="R$ 17.000,00"
          lastTransaction="Última entrada: dia 13 de abril"
        />
        <HighlightCard 
          type="down"
          title="Saídas"
          amount="R$ 17.000,00"
          lastTransaction="Última saída: dia 3 de abril"
        />
        <HighlightCard 
          type="total"
          title="Total"
          amount="R$ 16.141,00"
          lastTransaction="De 1 a 16 de abril"
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
    </Container>
  )
}