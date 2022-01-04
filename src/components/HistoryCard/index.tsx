import React from 'react';
import { 
  Container,
  Title,
  Amount,
} from './styles';

interface Category {
  name: string;
  icon: string;
}

export interface HistoryCardProps {
  title: string;
  amount: string;
  color: string;
}

interface Props {
  data: HistoryCardProps;
}

export function HistoryCard({ title, amount, color }: HistoryCardProps) {
  return (
    <Container color={color}>
      <Title>{title}</Title>
      <Amount>{amount}</Amount>
    </Container>
  );
}