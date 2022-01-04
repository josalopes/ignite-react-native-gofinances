import React from 'react';
import { CurrencyInputProps } from 'react-native-currency-input';
// import { TextInputProps } from 'react-native';
import { Container } from './styles';


type Props = CurrencyInputProps;

export function CurrencyInput({...rest} : Props) {
  return (
    <Container {...rest} />
  )
}