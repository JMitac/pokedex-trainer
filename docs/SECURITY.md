# Seguridad Mobile — OWASP Mobile Top 10

> Análisis de seguridad del proyecto Pokédex Trainer.
> Referencia: OWASP Mobile Application Security Verification Standard (MASVS)

---

## OWASP Mobile Top 10 — Estado del proyecto

### M1 — Improper Credential Usage

**Estado: ✅ Mitigado**

- No se almacenan credenciales en texto plano
- `expo-secure-store` usa Keychain (iOS) y Keystore (Android) respaldados por hardware
- Ningún dato sensible pasa por `AsyncStorage` sin cifrar

### M2 — Inadequate Supply Chain Security

**Estado: ⚠️ Parcialmente mitigado**

- Dependencias auditadas con `npm audit`
- Se recomienda agregar Snyk o Dependabot para monitoreo continuo
- Lockfile (`package-lock.json`) commiteado para builds reproducibles

### M3 — Insecure Authentication/Authorization

**Estado: ✅ N/A para esta versión**

No hay autenticación de servidor en esta versión. Para una versión con auth:
- Usar tokens JWT con expiración corta
- Almacenar refresh tokens en `expo-secure-store`
- Implementar certificate pinning con `react-native-ssl-pinning`

### M4 — Insufficient Input/Output Validation

**Estado: ✅ Mitigado**

- Validación con yup en todos los campos del formulario
- Edad mínima de 10 años validada en schema
- Email validado con regex de yup
- `maxLength` en todos los inputs de texto

### M5 — Insecure Communication

**Estado: ✅ Mitigado**

- Todas las comunicaciones sobre HTTPS (PokéAPI usa TLS)
- Cliente HTTP centralizado — todos los requests pasan por interceptores
- Para producción se recomienda agregar certificate pinning

### M6 — Inadequate Privacy Controls

**Estado: ✅ Mitigado**

- Permisos de cámara y galería solicitados en el momento de uso (not at launch)
- Los permisos se documentan en `app.json` con mensajes descriptivos
- No se recopilan datos de usuario fuera del dispositivo

### M7 — Insufficient Binary Protections

**Estado: ⚠️ Pendiente para producción**

Para el build de producción se recomienda:
- Ofuscación del bundle JS con `react-native-obfuscating-transformer`
- ProGuard activado en el build de Android
- Deshabilitar el debugger en producción (Expo lo hace automáticamente)

### M8 — Security Misconfiguration

**Estado: ✅ Mitigado**

- `__DEV__` controla el logging — en producción no hay logs de HTTP
- El Dev Playground no aparece en producción (dead code elimination)
- `app.json` no contiene secrets ni API keys

### M9 — Insecure Data Storage

**Estado: ✅ Mitigado**

- Datos del trainer en `AsyncStorage` (no sensibles — nombre, email, distrito)
- Para datos sensibles futuros: usar `expo-secure-store`
- No se cachean tokens, contraseñas ni datos financieros

### M10 — Insufficient Cryptography

**Estado: ✅ N/A para esta versión**

No se implementa cifrado custom. Se delega en:
- El Keychain/Keystore del OS para datos en reposo
- TLS para datos en tránsito

---

## Recomendaciones para contexto near-bank

Si este aplicativo manejara datos financieros reales:

1. **Certificate Pinning** — verificar el certificado del servidor en cada request
2. **Root/Jailbreak Detection** — alertar al usuario si el dispositivo está comprometido
3. **Screenshot Prevention** — `FLAG_SECURE` en Android para pantallas con datos sensibles
4. **Biometric Auth** — `expo-local-authentication` para autenticación con huella/Face ID
5. **Session Timeout** — cerrar sesión automáticamente tras inactividad
6. **Audit Logging** — registrar accesos y modificaciones de datos sensibles

---

## Herramientas de análisis estático

Para integrar en el pipeline de CI/CD:

```yaml
# .github/workflows/security.yml
- name: SonarQube Analysis
  run: npx sonar-scanner

- name: npm audit
  run: npm audit --audit-level=moderate

- name: Dependency check
  run: npx snyk test
```
