import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';

import { 
  Container, 
  Icon, 
  Title, Button
} from './styles';

const icons = {
  positive: 'arrow-up-circle',
  negative: 'arrow-down-circle'
}

interface Props extends RectButtonProps {
  title: string;
  type: 'positive' | 'negative';
  isActive: boolean;
  // onPress: () => void;
}

export function TransactionTypeButton({ 
  title, 
  type, 
  isActive, 
  ...rest 
}: Props) {
  return (
    <Container 
      type={type}
      isActive={isActive}
      >
      <Button
        // onPress={onPress}
        {...rest} 
      >
        <Icon 
          name={icons[type]}
          type={type}
          isActive={isActive}
        />
        <Title>
          {title}
        </Title>
      </Button>
    </Container>
  )
}