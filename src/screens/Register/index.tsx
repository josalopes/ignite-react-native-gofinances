import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  TouchableWithoutFeedback, 
  Keyboard, 
  Alert
} from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useForm } from 'react-hook-form';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';

import { Button } from '../../components/Form/Button';
import { CurrencyInputForm } from '../../components/Form/CurrencyInputForm';
import { InputForm } from '../../components/Form/InputForm';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { CategorySelect } from '../../screens/CategorySelect';
import { 
  Container, 
  Header, 
  Title, 
  Form, 
  Fields,
  Buttons 
} from './styles';

interface FormData {
  description: string;
  amount: number;
}

const schema = Yup.object().shape({
  description: Yup
    .string()
    .required('A descrição é obrigatória'),
  amount: Yup
    .number()  
    .typeError('Informe um valor numérico')
    .positive('O valor não pode ser negativo')
    .required('O valor é obrigatório')
})

export function Register() {
  const dataKey = '@gofinances:transactions';
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const navigation = useNavigation();
  
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  function handleTransactionTypeSelect(type: 'positive' | 'negative') {
    setTransactionType(type);
  }
  
  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true);
  }
  
  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false);
  }

  async function handleRegister(form: FormData) {
    if (!transactionType) 
      return Alert.alert('Selecione o tipo da transação');
    
    if (category.key === 'category') 
      return Alert.alert('Selecione a categoria da transação');

    const newTransaction = {
      id: String(uuid.v4()),
      description: form.description,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date()
    }

    try {
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];
      const dataFormatted = [
        ...currentData,
        newTransaction
      ]

      await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));      
    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível salvar!')
    }

    reset();
    setTransactionType('');
    setCategory({
      key: 'category',
      name: 'Categoria',
    });
    navigation.navigate('Listagem');

  }

  useEffect(() => {
    // async function loadData() {
    //   const data = await AsyncStorage.getItem(dataKey);
    //   console.log(JSON.parse(data!));
    // }
    // loadData();
    
    // async function removeAll() {
    //   await AsyncStorage.removeItem(dataKey);
    // }

    // removeAll();
  }, [])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>
            Cadastro
          </Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name="description"
              control={control}
              placeholder="Descrição"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.description && errors.description.message}
              />
            <CurrencyInputForm
              name="amount"
              control={control}
              placeholder="Valor"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />

            <Buttons>
              <TransactionTypeButton 
                title="Receita"
                type="positive"
                onPress={() => handleTransactionTypeSelect('positive')}
                isActive={transactionType === 'positive'}
              />
              <TransactionTypeButton 
                title="Despesa"
                type="negative"
                onPress={() => handleTransactionTypeSelect('negative')}
                isActive={transactionType === 'negative'}
              />
            </Buttons>  
            
            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>
          
          <Button 
            title="Enviar"
            onPress={handleSubmit(handleRegister)}
          />

        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect 
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
}