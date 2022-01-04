import React from 'react';
import { TextInputProps } from 'react-native';
import { Control, Controller } from 'react-hook-form';

import { Container, Error } from './styles';
import { CurrencyInput } from '../CurrencyInput';

interface Props extends TextInputProps {
  control: Control;
  name: string;
  error: string
}

export function CurrencyInputForm({control, name, error, ...rest}: Props) {
  return (
    <Container>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value }}) => (
          <CurrencyInput 
            onChangeValue={onChange}
            value={value}
            prefix="R$ "
            delimiter="."
            separator=","
            precision={2}
            {...rest}
          />
          )}
          name={name}
        />
        {error && <Error>{ error }</Error>}
    </Container>
  )
}