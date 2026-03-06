import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import {
  FlatList,
  View,
  RefreshControl,
} from 'react-native';
import { Portal, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import {
  useActiveUsersQuery,
  useDisabledUsersQuery,
  useDisableUserMutation,
  useEnableUserMutation,
} from '@/hooks/queries/users';
import { UserCardApp } from '@/components/users';
import {
  AnimatedFABApp,
  CommonDialogApp,
  CountBadgeApp,
  SegmentedButtonGroupApp,
  type SegmentedButtonOption,
} from '@/components/common';
import { useSnackbarStore } from '@/stores/snackbar.store';
import type { BackendUser } from '@/types/User';
import { usersStaticStyles, getUsersStyles } from '@/styles/users.styles';

// ================== CHIP OPTIONS ==================
type UserFilter = 'active' | 'disabled';

const FILTER_OPTIONS: SegmentedButtonOption<UserFilter>[] = [
  { value: 'active', label: 'Activos', icon: 'account-check' },
  { value: 'disabled', label: 'Deshabilitados', icon: 'account-cancel' },
];

// ================== TIPOS INTERNOS ==================
interface DialogConfig {
  visible: boolean;
  user: BackendUser | null;
  profileUuid: string;
  isActive: boolean;
  displayName: string;
}

const DIALOG_INITIAL: DialogConfig = {
  visible: false,
  user: null,
  profileUuid: '',
  isActive: false,
  displayName: '',
};

// ================== SCREEN ==================

export default function UsersScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getUsersStyles(theme), [theme]);
  const router = useRouter();

  const [filter, setFilter] = useState<UserFilter>('active');
  const [isExtended, setIsExtended] = useState(true);
  const [isFABVisible, setIsFABVisible] = useState(false);
  const [togglingUserId, setTogglingUserId] = useState<number | null>(null);
  const [dialog, setDialog] = useState<DialogConfig>(DIALOG_INITIAL);
  const showSnackbar = useSnackbarStore((state) => state.show);

  // Queries
  const {
    data: activeUsers,
    isLoading: isLoadingActive,
    isFetching: isFetchingActive,
    error: errorActive,
    refetch: refetchActive,
  } = useActiveUsersQuery();

  const {
    data: disabledUsers,
    isLoading: isLoadingDisabled,
    isFetching: isFetchingDisabled,
    error: errorDisabled,
    refetch: refetchDisabled,
  } = useDisabledUsersQuery();

  // Mutations
  const disableMutation = useDisableUserMutation();
  const enableMutation = useEnableUserMutation();

  // Datos actuales según filtro
  const users = filter === 'active' ? (activeUsers ?? []) : (disabledUsers ?? []);
  const isLoading = filter === 'active' ? isLoadingActive : isLoadingDisabled;
  const isFetching = filter === 'active' ? isFetchingActive : isFetchingDisabled;
  const error = filter === 'active' ? errorActive : errorDisabled;
  const refetch = filter === 'active' ? refetchActive : refetchDisabled;

  // Mostrar FAB al entrar en la pantalla
  useFocusEffect(
    useCallback(() => {
      setIsFABVisible(true);
      return () => setIsFABVisible(false);
    }, []),
  );

  // Abrir diálogo de confirmación
  const handleToggleStatus = (user: BackendUser, profileUuid: string) => {
    const isActive = user.status === 'active';
    const displayName =
      [user.profile?.name, user.profile?.lastname].filter(Boolean).join(' ') ||
      user.email;

    setDialog({ visible: true, user, profileUuid, isActive, displayName });
  };

  // Confirmar acción desde el diálogo
  const handleConfirmToggle = async () => {
    if (!dialog.user || !dialog.profileUuid) return;

    const { isActive, displayName, profileUuid } = dialog;
    setDialog((prev) => ({ ...prev, visible: false }));

    try {
      setTogglingUserId(dialog.user.id);
      if (isActive) {
        await disableMutation.mutateAsync(profileUuid);
        showSnackbar({
          message: `"${displayName}" ha sido deshabilitado correctamente.`,
          variant: 'success',
        });
      } else {
        await enableMutation.mutateAsync(profileUuid);
        showSnackbar({
          message: `"${displayName}" ha sido habilitado correctamente.`,
          variant: 'success',
        });
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Error al cambiar el estado del usuario.';
      showSnackbar({ message: msg, variant: 'error' });
    } finally {
      setTogglingUserId(null);
    }
  };

  // Cancelar diálogo
  const handleCancelDialog = () => setDialog(DIALOG_INITIAL);

  // Label del diálogo según estado
  const dialogLabel = dialog.isActive ? 'Deshabilitar' : 'Habilitar';
  const dialogMessage = dialog.isActive
    ? `¿Estás seguro de que quieres deshabilitar la cuenta de "${dialog.displayName}"? El usuario no podrá acceder a la aplicación.`
    : `¿Estás seguro de que quieres habilitar la cuenta de "${dialog.displayName}"? El usuario recuperará el acceso a la aplicación.`;

  // Scroll handler para animar el FAB
  const handleScroll = ({ nativeEvent }: any) => {
    const currentPos = Math.floor(nativeEvent?.contentOffset?.y) ?? 0;
    setIsExtended(currentPos <= 0);
  };

  // Renderizar cada tarjeta de usuario
  const renderUser = ({ item }: { item: BackendUser }) => (
    <UserCardApp
      user={item}
      onToggleStatus={(profileUuid) => handleToggleStatus(item, profileUuid)}
      isTogglingStatus={togglingUserId === item.id}
    />
  );

  // Estado vacío / error / cargando
  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={usersStaticStyles.emptyContainer}>
          <Text variant="bodyLarge" style={themed.emptyText}>
            Cargando usuarios...
          </Text>
        </View>
      );
    }
    if (error) {
      return (
        <View style={usersStaticStyles.emptyContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={80}
            color={theme.colors.error}
          />
          <Text
            variant="bodyLarge"
            style={{ color: theme.colors.error, textAlign: 'center' }}
          >
            {error instanceof Error ? error.message : 'Error al cargar usuarios'}
          </Text>
        </View>
      );
    }
    return (
      <View style={usersStaticStyles.emptyContainer}>
        <MaterialCommunityIcons
          name={filter === 'active' ? 'account-group-outline' : 'account-off-outline'}
          size={80}
          color={theme.colors.onSurfaceVariant}
        />
        <Text variant="bodyLarge" style={themed.emptyText}>
          {filter === 'active'
            ? 'No hay usuarios activos'
            : 'No hay usuarios deshabilitados'}
        </Text>
      </View>
    );
  };

  return (
    <View style={[usersStaticStyles.container, themed.container]}>
      {/* ── Barra de filtros ── */}
      <View style={[usersStaticStyles.segmentedSection, themed.segmentedSection]}>
        <SegmentedButtonGroupApp<UserFilter>
          options={FILTER_OPTIONS}
          selected={filter}
          onSelect={setFilter}
          density="small"
        />
      </View>

      {/* ── Contador ── */}
      {!isLoading && (
        <View style={usersStaticStyles.countRow}>
          <CountBadgeApp
            count={users.length}
            label={filter === 'active' ? 'usuarios' : 'bloqueados'}
            icon="account-group"
          />
        </View>
      )}

      {/* ── Lista de usuarios ── */}
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUser}
        contentContainerStyle={[usersStaticStyles.listContent, themed.listContent]}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        onScroll={handleScroll}
        scrollEventThrottle={16}
        ListEmptyComponent={renderEmpty}
      />

      {/* ── Diálogo de confirmación ── */}
      <CommonDialogApp
        visible={dialog.visible}
        title={`${dialogLabel} usuario`}
        message={dialogMessage}
        cancelText="Cancelar"
        confirmText={dialogLabel}
        onCancel={handleCancelDialog}
        onConfirm={handleConfirmToggle}
        confirmLoading={togglingUserId !== null}
        confirmVariant={dialog.isActive ? 'danger' : 'secondary'}
      />

      {/* ── Portal: FAB ── */}
      <Portal>
        <AnimatedFABApp
          icon="account-plus"
          label="Nuevo validador"
          extended={isExtended}
          visible={isFABVisible}
          onPress={() => router.push('/(protected)/(drawer)/users/create')}
          animateFrom="right"
          iconMode="dynamic"
        />
      </Portal>

    </View>
  );
}
