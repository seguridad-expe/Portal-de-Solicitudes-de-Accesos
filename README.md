# 🔐 Portal de Solicitudes de Acceso (PoC)

Esta es una **Prueba de Concepto (PoC)** diseñada para centralizar y automatizar las solicitudes de acceso en Experimentality. El objetivo es sustituir procesos informales por un registro auditable, simple y rápido.

## 📋 Cómo funciona (Resumen)
1.  **Login Corporativo:** El sistema utiliza Google Identity Services. Solo permite el ingreso si la cuenta pertenece al dominio `@experimentality.co`.
2.  **Solicitud:** El usuario elige el aplicativo (o usa la opción "Otro" con campo dinámico) y justifica su necesidad.
3.  **Base de Datos:** Los datos se registran en tiempo real en este Sheets:
    👉 **[Hoja de Cálculo de Solicitudes](https://docs.google.com/spreadsheets/d/1LNI0WxsugOQp0QosiwmfKebX37DQ8_8sQ2Fb3kYMMPQ/edit?gid=0#gid=0)**
4.  **Notificación:** Un script de Google procesa la entrada y dispara un correo automático al responsable del área.

## 🛠️ Stack Tecnológico (KISS)
Mantenemos la solución lo más simple posible para que sea fácil de mantener:
* **Frontend:** HTML5, CSS3 y JavaScript Vanilla (sin frameworks pesados).
* **Autenticación:** Google OAuth 2.0 (GSI SDK).
* **Backend:** Google Apps Script (Servidor *serverless* integrado al Sheets).
* **CI/CD:** GitHub Actions para el despliegue automatizado y seguro.

## 🛡️ Seguridad y Validación de Dominio
Aunque es una prueba de concepto, se construyó con criterios de seguridad real:
* **Filtro de Dominio:** Al recibir el token de Google, el código valida el campo `hd` (Hosted Domain). Si no es el corporativo, la sesión se destruye inmediatamente.
* **Uso de "Secrets":** Las credenciales críticas (Client ID de Google y URL del Apps Script) no están en el código fuente. GitHub Actions las inyecta de forma segura al publicar la web, manteniendo el repositorio público pero protegido.
* **Comunicación Segura:** Se utiliza `fetch` con el parámetro `credentials: 'include'` para heredar la sesión corporativa de Google y saltar bloqueos de seguridad sin exponer datos.

## 📜 Lógica del Backend (Google Apps Script)
El "cerebro" del proyecto reside en un script vinculado al Sheets que:
* Recibe los datos vía `POST`.
* Crea automáticamente pestañas y encabezados con estilos corporativos.
* Mapea el aplicativo solicitado con su responsable correspondiente para el envío de alertas.

## 🚀 Próximos Pasos (Adopción Oficial)
Si se aprueba el uso de esta herramienta, el camino a producción es:
1.  **Clonar** este repositorio en una cuenta institucional de GitHub.
2.  **Migrar** el Apps Script a una cuenta genérica (ej: `it-admin@experimentality.co`) para oficializar el remitente de los correos.
3.  **Actualizar** los "Secrets" en la nueva ubicación de GitHub.

---
*Desarrollado como solución interna para el Comité de Seguridad de Experimentality.*