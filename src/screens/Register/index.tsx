import React, { useState } from 'react';

import { Button } from '../../components/Form/Button';
import { Input } from '../../components/Form/Input';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { 
  Container, 
  Header, 
  Title, 
  Form, 
  Fields,
  Buttons 
} from './styles';

export function Register() {
  const [transactionType, setTransactionType] = useState('');

  function handleTransactionTypeSelect(type: string) {
    setTransactionType(type);
  }

  return (
    <Container>
      <Header>
        <Title>
          Cadastro
        </Title>
      </Header>

      <Form>
        <Fields>
          <Input 
            placeholder="Descrição"
          />
          <Input 
            placeholder="Valor"
          />

          <Buttons>
            <TransactionTypeButton 
              title="Entrada"
              type="up"
              onPress={() => handleTransactionTypeSelect('up')}
              isActive={transactionType === 'up'}
            />
            <TransactionTypeButton 
              title="Saída"
              type="down"
              onPress={() => handleTransactionTypeSelect('down')}
              isActive={transactionType === 'down'}
            />
          </Buttons>  
        </Fields>

        <Button title="Enviar"/>

      </Form>
    </Container>
  )
}