import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import { useUserStore } from '@/stores/user.store';
import { useMemo } from 'react';
import { dashboardStaticStyles, getDashboardStyles } from '@/styles/dashboard.styles';

export default function DashboardScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getDashboardStyles(theme), [theme]);
  const { user } = useUserStore();

  return (
    <View style={[dashboardStaticStyles.container, themed.container]}>
      <View style={dashboardStaticStyles.centerContent}>
        <MaterialCommunityIcons name="view-dashboard-outline" size={110} color={themed.iconColor} />
        <Text variant="headlineLarge" style={[dashboardStaticStyles.title, themed.title]}>
          Dashboard
        </Text>
        <Text variant="bodyLarge" style={[dashboardStaticStyles.subtitle, themed.subtitle]}>
          Bienvenido/a, {user?.name}
        </Text>
      </View>
    </View>
  );
}

