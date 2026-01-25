import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Switch, Text } from 'react-native-paper';
import { useAppTheme, useThemeContext } from '@/providers/ThemeProvider';
import { preferencesStaticStyles, getPreferencesStyles } from '@/styles/preferences.styles';

export default function PreferencesScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const themed = useMemo(() => getPreferencesStyles(theme), [theme]);
  const { isDark, setIsDark } = useThemeContext();

  return (
    <View style={[preferencesStaticStyles.container, themed.container]}>
      <View style={preferencesStaticStyles.header}>
        <Pressable style={preferencesStaticStyles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={themed.backButtonIcon} />
        </Pressable>
        <Text variant="titleMedium" style={[preferencesStaticStyles.title, themed.title]}>
          Preferencias
        </Text>
      </View>

      <View
        style={[preferencesStaticStyles.card, themed.card]}
      >
        <View style={preferencesStaticStyles.row}>
          <View>
            <Text style={[preferencesStaticStyles.rowTitle, themed.rowTitle]}>
              Tema oscuro
            </Text>
            <Text style={[preferencesStaticStyles.rowSubtitle, themed.rowSubtitle]}>
              Activa el modo oscuro en la app.
            </Text>
          </View>
          <Switch value={isDark} onValueChange={setIsDark} />
        </View>
      </View>
    </View>
  );
}
