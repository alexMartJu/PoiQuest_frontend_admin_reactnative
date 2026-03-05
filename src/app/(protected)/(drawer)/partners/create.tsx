import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { useAppTheme } from '@/providers/ThemeProvider';
import { CityForm, OrganizerForm, SponsorForm } from '@/components/partners';
import { createPartnerStaticStyles, getCreatePartnerStyles } from '@/styles/partners.styles';

type PartnerType = 'cities' | 'organizers' | 'sponsors';

const TYPE_TITLE: Record<PartnerType, string> = {
  cities: 'Nueva ciudad',
  organizers: 'Nuevo organizador',
  sponsors: 'Nuevo patrocinador',
};

export default function CreatePartnerScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getCreatePartnerStyles(theme), [theme]);
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: PartnerType }>();
  const partnerType = (type as PartnerType) ?? 'cities';

  const handleCancel = () => router.back();

  const renderForm = () => {
    if (partnerType === 'organizers') {
      return <OrganizerForm isCreating onCancel={handleCancel} />;
    }
    if (partnerType === 'sponsors') {
      return <SponsorForm isCreating onCancel={handleCancel} />;
    }
    return <CityForm isCreating onCancel={handleCancel} />;
  };

  return (
    <View style={[createPartnerStaticStyles.container, themed.container]}>
      <View style={createPartnerStaticStyles.header}>
        <Pressable style={createPartnerStaticStyles.backButton} onPress={handleCancel}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={theme.colors.primary} />
        </Pressable>
        <Text variant="titleMedium" style={[createPartnerStaticStyles.title, themed.title]}>
          {TYPE_TITLE[partnerType]}
        </Text>
      </View>
      {renderForm()}
    </View>
  );
}

