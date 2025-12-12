# PoiQuest - Frontend Admin (React Native)

Aplicación móvil de administración para PoiQuest desarrollada con React Native y Expo.

## 📱 Cambios Principales Implementados

### 1. **Pantalla de Login**
- ✅ Implementación de la vista inicial de login
- ✅ Diseño con tabs para "Iniciar sesión" y "Registrarse"
- ✅ Campos de entrada para email y contraseña con validación
- ✅ Opción de mostrar/ocultar contraseña
- ✅ Botón de recuperación de contraseña
- ✅ Validación de formularios en tiempo real
- ✅ Estados de carga durante el proceso de login

### 2. **Estructura del Proyecto**
Se ha reorganizado el proyecto siguiendo las mejores prácticas de React Native:

```
├── src/
│   ├── app/              # Pantallas de la aplicación
│   │   └── LoginScreen.tsx
│   ├── components/       # Componentes reutilizables
│   ├── hooks/            # Custom hooks
│   ├── services/         # Servicios API
│   ├── types/            # Tipos TypeScript
│   ├── utils/            # Utilidades y validadores
│   │   └── validators.ts
│   └── theme.ts          # Configuración de tema MD3
├── assets/               # Recursos estáticos
├── App.tsx               # Componente raíz
└── package.json
```

### 3. **Integración de React Native Paper**
- ✅ Biblioteca de componentes Material Design 3 integrada
- ✅ Componentes configurados: TextInput, Button, Text, HelperText
- ✅ Temas personalizados para modo claro y oscuro
- ✅ Iconos de Material Community Icons

### 4. **Sistema de Temas**
Adaptación del tema de Flutter a React Native con:
- **Paleta de colores** completa (light/dark)
- **Tipografía** consistente con el diseño original
- **Espaciado** estandarizado
- **Border radius** configurables
- Colores personalizados:
  - Primary: `#111827` (texto principal)
  - Secondary: `#16A34A` (estado activo - verde)
  - Warning: `#FACC15` (dorado/logros)
  - Danger: `#DC2626` (acciones destructivas - rojo)
  - Background: `#F9FAFB` (fondo general)
  - Surface: `#FFFFFF` (tarjetas, superficies)

### 5. **Validaciones**
Sistema de validación robusto en `validators.ts`:
- ✅ Validación de formato de email
- ✅ Validación de contraseña (mínimo 6 caracteres)
- ✅ Validación de contraseña fuerte (opcional)
- ✅ Validación completa del formulario de login
- ✅ Sanitización de inputs

### Fuentes
La aplicación carga las fuentes `Roboto` en `App.tsx` usando `@expo-google-fonts/roboto` y `expo-font`. Se usan las variantes `Roboto_400Regular`, `Roboto_500Medium` y `Roboto_700Bold` para mantener la consistencia tipográfica.

## 🚀 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar la aplicación
npm start

# Para ejecutar en Android
npm run android

# Para ejecutar en iOS
npm run ios
```

## 📦 Dependencias Principales

- **expo**: Framework para React Native
- **react-native-paper**: Biblioteca de componentes Material Design 3
- **react-native-safe-area-context**: Manejo de áreas seguras
- **@expo/vector-icons**: Iconos para la interfaz (incluido en proyectos Expo)
- **@expo-google-fonts/roboto** y **expo-font**: Carga y gestión de fuentes Roboto
- **react-native-web**: Soporte para ejecución en web (Expo web)

## 🎨 Características del Diseño

- **Material Design 3**: Componentes modernos siguiendo las últimas guías de diseño
- **Tema oscuro**: Soporte completo para modo oscuro (preparado para futuras implementaciones)
- **Accesibilidad**: Componentes accesibles con soporte para lectores de pantalla
- **Responsive**: Diseño adaptable a diferentes tamaños de pantalla
- **Animaciones**: Transiciones suaves en inputs y botones

## 🔧 Próximas Funcionalidades

- [ ] Navegación entre pantallas (React Navigation)
- [ ] Integración con API backend
- [ ] Almacenamiento local
- [ ] Gestión de estado global
- [ ] Pantallas adicionales (Home, Registro, Recuperación de contraseña)
- [ ] Implementación de tema oscuro dinámico
- [ ] Autenticación con tokens JWT
- [ ] Manejo avanzado de errores

## 👨‍💻 Desarrollo

Este proyecto sigue las convenciones de nomenclatura y estructura de React Native:
- **PascalCase** para componentes
- **camelCase** para funciones y variables
- **UPPER_CASE** para constantes
- **Tipado estricto** con TypeScript

## 📄 Licencia

Ver archivo [LICENSE](LICENSE) para más detalles.
