import styled, { css } from "styled-components/native";
import { RectButton } from 'react-native-gesture-handler';
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

interface IconProps {
  type: 'positive' | 'negative';
}

interface ContainerProps {
  type: 'positive' | 'negative';
  isActive: boolean;
}

export const Container = styled.View<ContainerProps>`
  width: 48%;
  height: ${RFValue(56)}px;

  border-width: ${({ isActive }) => isActive ? 0 : 1.5}px; 
  border-style: solid ;
  border-color: rgba(150, 156, 179, 0.2);
  border-radius: 5px;
  
  ${({ isActive, type }) => isActive && type === 'positive' && css`
  background-color: : ${({ theme }) => theme.colors.success_light};
  `}
  
  ${({ isActive, type }) => isActive && type === 'negative' && css`
  background-color: : ${({ theme }) => theme.colors.attention_light};
  `}
  `;

export const Button = styled(RectButton)`
  flex-direction: row;
  align-items: center;
  justify-content: center;

  padding-left: 16px;
`;

export const Icon = styled(Feather)<IconProps>`
  font-size: ${RFValue(20)}px;
  margin-right: 14px;

  color: ${({ theme, type }) => 
    type === 'positive' ? theme.colors.success : theme.colors.attention};

`;

export const Title = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.regular};

  color: ${({ theme }) => theme.colors.title};

`;