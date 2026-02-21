import React, { useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAppTheme } from '@/providers/ThemeProvider';
import { UserForm } from '@/components/users';
import { createUserStaticStyles, getCreateUsersStyles } from '@/styles/users.styles';

export default function CreateUserScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getCreateUsersStyles(theme), [theme]);
  const router = useRouter();

  return (
    <View style={[createUserStaticStyles.container, themed.container]}>
      <View style={createUserStaticStyles.header}>
        <Pressable
          style={createUserStaticStyles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={22}
            color={theme.colors.primary}
          />
        </Pressable>
        <Text
          variant="titleMedium"
          style={[createUserStaticStyles.title, themed.title]}
        >
          Registrar validador
        </Text>
      </View>
      <UserForm onCancel={() => router.back()} />
    </View>
  );
}
