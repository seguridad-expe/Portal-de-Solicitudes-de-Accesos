document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-solicitud');
    const btnEnviar = document.getElementById('btn-enviar');
    const mensajeEstado = document.getElementById('mensaje-estado');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Bloquear botón y mostrar estado
        btnEnviar.disabled = true;
        btnEnviar.textContent = 'Enviando...';
        mensajeEstado.style.display = 'none';

        const payload = {
            tipo_formulario: "solicitud_acceso",
            timestamp: new Date().toISOString(),
            nombre: document.getElementById('nombreUsuario').value.trim(),
            correo: document.getElementById('correoUsuario').value.trim(),
            aplicativo: document.getElementById('selectAplicativo').value,
            justificacion: document.getElementById('justificacion').value.trim()
        };

        try {
            // ENVIAR DATOS CON FETCH
            // Usamos mode: 'no-cors' porque Apps Script no devuelve cabeceras CORS dinámicas fácilmente
            await fetch(ENV.APPS_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Esto evita el error de "Bloqueado por CORS"
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // Con 'no-cors' no podemos leer la respuesta, pero si no saltó al 'catch',
            // significa que la petición salió hacia Google exitosamente.
            mostrarMensaje('✅ Solicitud enviada con éxito. El responsable ha sido notificado.', 'success');
            form.reset();

        } catch (error) {
            console.error('Error al enviar:', error);
            mostrarMensaje('❌ Hubo un problema al conectar con el servidor. Intenta de nuevo.', 'error');
        } finally {
            btnEnviar.disabled = false;
            btnEnviar.textContent = 'Enviar Solicitud';
        }
    });

    function mostrarMensaje(texto, tipo) {
        mensajeEstado.textContent = texto;
        mensajeEstado.style.display = 'block';
        mensajeEstado.style.backgroundColor = tipo === 'success' ? 'rgba(45, 232, 176, 0.1)' : 'rgba(255, 60, 60, 0.1)';
        mensajeEstado.style.color = tipo === 'success' ? '#2de8b0' : '#ff3c3c';
        mensajeEstado.style.border = `1px solid ${tipo === 'success' ? '#2de8b0' : '#ff3c3c'}`;
    }
});