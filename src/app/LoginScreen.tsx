import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  IconButton,
  HelperText,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useAppTheme, AppTheme } from '../theme';
import { validateLoginForm, validateEmail, validatePassword } from '../utils/validators';
import { spacing, borderRadius } from '../theme';

export const LoginScreen = () => {
  const theme = useAppTheme();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [touched, setTouched] = useState<{ email: boolean; password: boolean }>({
    email: false,
    password: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (touched.email) {
      setEmailError(validateEmail(text));
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (touched.password) {
      setPasswordError(validatePassword(text));
    }
  };

  const handleEmailBlur = () => {
    setTouched(prev => ({ ...prev, email: true }));
    setEmailError(validateEmail(email));
  };

  const handlePasswordBlur = () => {
    setTouched(prev => ({ ...prev, password: true }));
    setPasswordError(validatePassword(password));
  };

  const handleLogin = async () => {
    // Validar todos los campos
    const validation = validateLoginForm(email, password);
    setEmailError(validation.errors.email || '');
    setPasswordError(validation.errors.password || '');
    setTouched({ email: true, password: true });

    if (!validation.isValid) return;

    setIsLoading(true);
    // Simular llamada a API
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Login exitoso:', { email, password });
    } catch (error) {
      console.error('Error en login:', error);
      setEmailError('Credenciales inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  const { width } = useWindowDimensions();
  const isTablet = width >= 600;
  const styles = createStyles(theme, isTablet);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo y título */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <View style={styles.logoPlaceholder}>
                <MaterialCommunityIcons name="map-marker" size={40} color={theme.colors.primary} />
              </View>
            </View>
            <Text variant="headlineLarge" style={[styles.title, { color: theme.colors.secondary }]}>
              Poi<Text variant="headlineLarge" style={{ color: theme.colors.primary }}>Quest</Text>
            </Text>
            <Text variant="bodyMedium" style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Inicia sesión para continuar
            </Text>
          </View>

          {/* Tabs de Login / Registrarse */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'login' && styles.activeTab,
                { borderColor: theme.colors.outline },
              ]}
              onPress={() => setActiveTab('login')}
              activeOpacity={0.7}
              hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            >
              <Text
                variant="labelLarge"
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === 'login'
                        ? theme.colors.primary
                        : theme.colors.onSurfaceVariant,
                  },
                ]}
              >
                Iniciar sesión
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'register' && styles.activeTab,
                { borderColor: theme.colors.outline },
              ]}
              onPress={() => setActiveTab('register')}
              activeOpacity={0.7}
              hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            >
              <Text
                variant="labelLarge"
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === 'register'
                        ? theme.colors.primary
                        : theme.colors.onSurfaceVariant,
                  },
                ]}
              >
                Registrarse
              </Text>
            </TouchableOpacity>
          </View>

          {/* Formulario */}
          <View style={styles.formContainer}>
            {/* Campo Email */}
            <View style={styles.inputContainer}>
              <TextInput
                mode="outlined"
                label="Email"
                value={email}
                onChangeText={handleEmailChange}
                onBlur={handleEmailBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                error={touched.email && !!emailError}
                left={<TextInput.Icon icon="email-outline" style={isTablet ? styles.iconCentered : undefined} />}
                style={[styles.input, { backgroundColor: theme.colors.surface }]}
                contentStyle={isTablet ? styles.inputContent : undefined}
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
                textColor={theme.colors.onSurface}
                disabled={isLoading}
              />
              {touched.email && emailError ? (
                <HelperText type="error" visible={true}>
                  {emailError}
                </HelperText>
              ) : null}
            </View>

            {/* Campo Contraseña */}
            <View style={styles.inputContainer}>
              <TextInput
                mode="outlined"
                label="Contraseña"
                value={password}
                onChangeText={handlePasswordChange}
                onBlur={handlePasswordBlur}
                secureTextEntry={!showPassword}
                autoComplete="password"
                error={touched.password && !!passwordError}
                left={<TextInput.Icon icon="lock-outline" style={isTablet ? styles.iconCentered : undefined} />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    onPress={() => setShowPassword(!showPassword)}
                    style={isTablet ? styles.iconCentered : undefined}
                  />
                }
                style={[styles.input, { backgroundColor: theme.colors.surface }]}
                contentStyle={isTablet ? styles.inputContent : undefined}
                outlineColor={theme.colors.outline}
                activeOutlineColor={theme.colors.primary}
                textColor={theme.colors.onSurface}
                disabled={isLoading}
              />
              {touched.password && passwordError ? (
                <HelperText type="error" visible={true}>
                  {passwordError}
                </HelperText>
              ) : null}
            </View>

            {/* Olvidaste tu contraseña */}
            <Pressable
              onPress={() => console.log('Recuperar contraseña')}
              hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
              accessibilityRole="button"
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
            >
              <Text variant="bodySmall" style={[styles.forgotPassword, { color: theme.colors.onSurfaceVariant }]}> 
                ¿Olvidaste tu contraseña?
              </Text>
            </Pressable>

            {/* Botón de Login */}
            <Button
              mode="contained"
              onPress={handleLogin}
              loading={isLoading}
              disabled={isLoading}
              style={[styles.loginButton, { backgroundColor: theme.colors.primary }]}
              contentStyle={styles.loginButtonContent}
              labelStyle={styles.loginButtonLabel}
              buttonColor={theme.colors.primary}
              textColor={theme.colors.onPrimary}
            >
              Iniciar sesión
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const createStyles = (theme: AppTheme, isTablet: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      alignItems: isTablet ? 'center' : 'stretch',
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xxl * 1.5,
      paddingBottom: spacing.xl,
      alignItems: isTablet ? 'center' : 'stretch',
    },
    header: {
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    logoContainer: {
      marginBottom: spacing.md,
    },
    logoPlaceholder: {
      width: 80,
      height: 80,
      borderRadius: borderRadius.md,
      backgroundColor: theme.colors.onPrimary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoIcon: {
      fontSize: 40,
    },
    title: {
      marginBottom: spacing.xs,
      textAlign: 'center',
    },
    subtitle: {
      textAlign: 'center',
    },
    tabsContainer: {
      flexDirection: 'row',
      marginBottom: spacing.lg,
      borderRadius: borderRadius.md,
      backgroundColor: theme.appPalette.surface,
      padding: 4,
      width: isTablet ? 480 : '100%',
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.md,
      alignItems: 'center',
      borderRadius: borderRadius.sm,
    },
    activeTab: {
      backgroundColor: theme.appPalette.background,
    },
    tabText: {},
    formContainer: {
      width: '100%',
      maxWidth: isTablet ? 480 : '100%',
      paddingHorizontal: isTablet ? spacing.md : 0,
    },
    inputContainer: {
      marginBottom: spacing.md,
    },
    input: {
      height: isTablet ? 56 : undefined,
    },
    inputContent: {
      height: isTablet ? 56 : undefined,
      justifyContent: 'center',
    },
    iconCentered: {
      alignSelf: 'center',
    },
    forgotPassword: {
      textAlign: 'right',
      marginBottom: spacing.lg,
      marginTop: -spacing.sm,
    },
    loginButton: {
      marginTop: spacing.md,
      borderRadius: borderRadius.md,
      minWidth: isTablet ? 220 : undefined,
    },
    loginButtonContent: {
      paddingVertical: isTablet ? spacing.md : spacing.sm,
      paddingHorizontal: spacing.lg,
    },
    loginButtonLabel: {},
  });

export default LoginScreen;
