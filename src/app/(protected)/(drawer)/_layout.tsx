import { Drawer } from 'expo-router/drawer';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import { useWindowDimensions, View, StyleSheet, Pressable } from 'react-native';
import { Text, Avatar, Divider } from 'react-native-paper';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { useUserStore } from '@/stores/user.store';
import { logout as logoutService } from '@/services/auth.service';
import { useState, useMemo } from 'react';
import { drawerStaticStyles, getDrawerLayoutStyles } from '@/styles/drawerLayout.styles';

// Custom Drawer Content para personalizar la UI del drawer
function CustomDrawerContent(props: any) {
  const theme = useAppTheme();
  const themed = useMemo(() => getDrawerLayoutStyles(theme), [theme]);
  const router = useRouter();
  const { user, refreshToken, clearUser } = useUserStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);
      if (refreshToken) {
        await logoutService(refreshToken);
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      clearUser();
      setIsLoggingOut(false);
      router.replace('/login');
    }
  };

  const handlePreferences = () => {
    router.push('/(protected)/preferences');
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={drawerStaticStyles.drawerContent}>
      {/* Header del usuario */}
      <View style={[drawerStaticStyles.userSection, themed.userSection]}>
        <Avatar.Text
          size={56}
          label={`${user?.name?.[0] || 'U'}${user?.lastname?.[0] || ''}`}
          style={themed.avatar}
          labelStyle={themed.avatarLabel}
        />
        <View style={drawerStaticStyles.userInfo}>
          <Text variant="titleMedium" style={[drawerStaticStyles.userName, themed.userName]}>
            {user?.name} {user?.lastname}
          </Text>
          <Text variant="bodySmall" style={themed.userEmail}>
            {user?.email}
          </Text>
          {user?.roles && user.roles.length > 0 && (
            <View style={drawerStaticStyles.roleBadge}>
              <Text variant="labelSmall" style={themed.roleText}>
                {user.roles.includes('admin') ? 'Administrador' : 'Usuario'}
              </Text>
            </View>
          )}
        </View>
      </View>

      <Divider style={drawerStaticStyles.divider} />

      {/* Items del drawer */}
      <DrawerItemList {...props} />

      <Divider style={drawerStaticStyles.divider} />

      {/* Botón de preferencias */}
      <DrawerItem
        label="Preferencias"
        icon={({ size }) => <MaterialCommunityIcons name="cog-outline" color={themed.preferencesIcon} size={size} />}
        onPress={handlePreferences}
        labelStyle={themed.preferencesLabel}
      />

      {/* Botón de cerrar sesión */}
      <DrawerItem
        label={isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
        icon={({ size }) => <MaterialCommunityIcons name="logout" color={themed.logoutIcon} size={size} />}
        onPress={() => {
          if (isLoggingOut) return;
          void handleLogout();
        }}
        labelStyle={themed.logoutLabel}
      />
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  const theme = useAppTheme();
  const themed = useMemo(() => getDrawerLayoutStyles(theme), [theme]);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isAdmin = useUserStore((s) => s.user?.roles?.includes('admin') ?? false);

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: themed.headerStyle,
        headerTintColor: themed.headerTintColor,
        drawerActiveTintColor: themed.drawerActiveTintColor,
        drawerInactiveTintColor: themed.drawerInactiveTintColor,
        drawerActiveBackgroundColor: themed.drawerActiveBackgroundColor,
        drawerStyle: themed.drawerStyle,
        drawerType: isTablet ? 'permanent' : 'front', // Permanente en tablet, deslizable en móvil
        swipeEnabled: !isTablet, // Solo deslizable en móvil
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Dashboard',
          title: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="events"
        options={{
          drawerLabel: 'Eventos',
          title: 'Eventos',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar-star" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="pois"
        options={{
          drawerLabel: 'Puntos de interés',
          title: 'Puntos de interés',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map-marker-multiple" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="routes"
        options={{
          drawerLabel: 'Rutas',
          title: 'Rutas',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="map-marker-path" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="partners"
        options={{
          drawerLabel: 'Partners',
          title: 'Partners',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="handshake" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="users"
        options={{
          drawerLabel: 'Usuarios',
          title: 'Usuarios',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={size} />
          ),
        }}
      />
    </Drawer>
  );
}
