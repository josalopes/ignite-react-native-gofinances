import styled, { css } from "styled-components/native";
import { TouchableOpacity } from 'react-native';
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

interface IconProps {
  type: 'up' | 'down';
}

interface ContainerProps {
  type: 'up' | 'down';
  isActive: boolean;
}

export const Container = styled(TouchableOpacity)<ContainerProps>`
  flex-direction: row;

  width: 48%;
  height: ${RFValue(56)}px;
  border-width: ${({ isActive }) => isActive ? 0 : 1.5}px; 
  border-style: solid ;
  border-color: ${({ theme }) => theme.colors.text};
  border-radius: 5px;
  
  padding-left: 18px;
  align-items: center;

  ${({ isActive, type }) => isActive && type === 'up' && css`
    background-color: : ${({ theme }) => theme.colors.success_light};
  `}
  
  ${({ isActive, type }) => isActive && type === 'down' && css`
    background-color: : ${({ theme }) => theme.colors.attention_light};
  `}
`;

export const Icon = styled(Feather)<IconProps>`
  font-size: ${RFValue(20)}px;
  margin-right: 14px;

  color: ${({ theme, type }) => 
    type === 'up' ? theme.colors.success : theme.colors.attention};

`;

export const Title = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.regular};

  color: ${({ theme }) => theme.colors.title};

`;