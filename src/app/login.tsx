import { useState, useMemo } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, Image, ImageSourcePropType } from 'react-native';
import { router } from 'expo-router';
import { Card, Text, TextInput } from 'react-native-paper';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/providers/ThemeProvider';
import { loginStaticStyles, getLoginStyles } from '@/styles/login.styles';
import { TextInputApp, ButtonApp } from '@/components/common';
import { loginSchema, LoginFormValues } from '@/schemas/auth.schema';
import { login as loginService } from '@/services/auth.service';
import { useUserStore } from '@/stores/user.store';
import { useSnackbarStore } from '@/stores/snackbar.store';

export default function LoginScreen() {
  const theme = useAppTheme();
  const themed = useMemo(() => getLoginStyles(theme), [theme]);
  const { setUser, setTokens } = useUserStore();
  const showSnackbar = useSnackbarStore((state) => state.show);
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await loginService(data);

      // Si el usuario no tiene rol 'admin', mostrar mensaje y no continuar
      if (!response.roles || !response.roles.includes('admin')) {
        showSnackbar({ message: 'Tu cuenta no tiene permisos de administrador', variant: 'error' });
        return;
      }

      // Guardar tokens
      if (response.accessToken && response.refreshToken) {
        setTokens({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        });
      }

      // Guardar usuario
      setUser({
        userId: response.userId,
        name: response.name,
        lastname: response.lastname,
        email: response.email,
        avatarUrl: response.avatarUrl,
        bio: response.bio,
        roles: response.roles,
      });

      // Navegar al dashboard
      router.replace('/(protected)/(drawer)');
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || 'No se pudo iniciar sesión';
      showSnackbar({ message, variant: 'error' });
    }
  };

  // Componente `Logo`: usa un icono por defecto o una imagen pasada por `source`.
  // Pasar `source` permitirá reemplazar fácilmente el logo en el futuro.
  const Logo = ({ size = 64, source }: { size?: number; source?: ImageSourcePropType }) => {
    const containerStyle = {
      width: size,
      height: size,
      borderRadius: size / 2,
      justifyContent: 'center',
      alignItems: 'center',
    } as any;

    if (source) {
      return (
        <View style={[containerStyle, { overflow: 'hidden', backgroundColor: 'transparent' }]}>
          <Image source={source} style={{ width: size, height: size }} resizeMode="cover" />
        </View>
      );
    }

    return (
      <View style={[containerStyle, themed.logoBackground]}> 
        <MaterialCommunityIcons
          name="map-marker-star"
          size={Math.floor(size * 0.5)}
          color={theme.colors.onPrimary}
        />
      </View>
    );
  };

  return (
    <View style={[loginStaticStyles.container, themed.container]}> 
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={loginStaticStyles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={loginStaticStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Card style={loginStaticStyles.card} mode="elevated">
            <Card.Content>
              {/* Logo + Marca */}
              <View style={loginStaticStyles.logoRow}>
                <Logo size={64} />
                <View style={loginStaticStyles.logoTextContainer}>
                  <Text variant="titleLarge" style={[loginStaticStyles.brandText, themed.brandText]}>
                    <Text style={themed.brandSecondary}>Poi</Text>
                    <Text style={themed.brandPrimary}>Quest</Text>
                  </Text>
                </View>
              </View>

              {/* Título */}
              <Text variant="displaySmall" style={[loginStaticStyles.greeting, themed.greeting]}>
                Hola,
              </Text>
              <Text variant="displaySmall" style={[loginStaticStyles.title, themed.title, themed.titleText]}>
                Inicia sesión
              </Text>

              <Text variant="bodyMedium" style={[loginStaticStyles.subtitle, themed.subtitle]}> 
                Panel de administración de PoiQuest
              </Text>

              {/* Campo Email */}
              <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInputApp
                    label="Email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    errorText={errors.email?.message}
                    left={<TextInput.Icon icon="email-outline" color={theme.colors.secondary} />}
                    disabled={isSubmitting}
                  />
                )}
              />

              {/* Campo Contraseña */}
              <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInputApp
                    label="Contraseña"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showPassword}
                    autoComplete="password"
                    textContentType="password"
                    errorText={errors.password?.message}
                    left={<TextInput.Icon icon="lock-outline" color={theme.colors.secondary} />}
                    right={
                      <TextInput.Icon
                        icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        onPress={() => setShowPassword(!showPassword)}
                        color={theme.colors.secondary}
                        forceTextInputFocus={false}
                      />
                    }
                    disabled={isSubmitting}
                  />
                )}
              />

              {/* Botón de Login */}
              <ButtonApp
                icon="login"
                onPress={handleSubmit(onSubmit)}
                loading={isSubmitting}
                disabled={isSubmitting}
                style={loginStaticStyles.loginButton}
                buttonColor={theme.colors.primary}
                textColor={theme.colors.onPrimary}
                accessibilityLabel="Iniciar sesión en PoiQuest Admin"
                accessibilityHint="Inicia sesión con tu cuenta de administrador"
              >
                Iniciar sesión
              </ButtonApp>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}