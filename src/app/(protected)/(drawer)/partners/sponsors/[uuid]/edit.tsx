import { useMemo } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppTheme } from '@/providers/ThemeProvider';
import { useSponsorDetailQuery } from '@/hooks/queries/partners';
import { SponsorForm } from '@/components/partners';
import { partnerEditStaticStyles, getPartnerEditStyles } from '@/styles/partners.styles';

export default function SponsorEditScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getPartnerEditStyles(theme), [theme]);
  const router = useRouter();
  const { uuid } = useLocalSearchParams<{ uuid: string }>();

  const { data: sponsor, isLoading } = useSponsorDetailQuery(uuid);

  if (isLoading) {
    return (
      <View style={[partnerEditStaticStyles.centerContainer, themed.container]}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={themed.container}>
      <View style={partnerEditStaticStyles.header}>
        <Pressable style={partnerEditStaticStyles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={theme.colors.primary} />
        </Pressable>
        <Text variant="titleMedium" style={[partnerEditStaticStyles.title, themed.title]}>
          Editar patrocinador
        </Text>
      </View>
      <SponsorForm sponsor={sponsor} onSuccess={() => router.back()} onCancel={() => router.back()} />
    </View>
  );
}
