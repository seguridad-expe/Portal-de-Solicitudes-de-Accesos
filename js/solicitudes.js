document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-solicitud');
    const iframe = document.getElementById('hidden_iframe');
    const btnEnviar = document.getElementById('btn-enviar');
    const mensajeEstado = document.getElementById('mensaje-estado');

    // Escuchar la respuesta del iframe (Apps Script enviará 'FORM_OK' o 'FORM_ERROR')
    window.addEventListener('message', (event) => {
        if (event.data === 'FORM_OK') {
            mostrarMensaje('✅ Solicitud enviada con éxito. El responsable ha sido notificado.', 'success');
            form.reset();
            btnEnviar.disabled = false;
            btnEnviar.textContent = 'Enviar Solicitud';
        } else if (typeof event.data === 'string' && event.data.startsWith('FORM_ERROR')) {
            mostrarMensaje('❌ Hubo un error al enviar la solicitud. Intenta de nuevo.', 'error');
            btnEnviar.disabled = false;
            btnEnviar.textContent = 'Enviar Solicitud';
        }
    });

    // Interceptar el envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que la página recargue

        btnEnviar.disabled = true;
        btnEnviar.textContent = 'Enviando...';
        mensajeEstado.style.display = 'none';

        // 1. Armar el objeto JSON de la solicitud
        const payload = {
            tipo_formulario: "solicitud_acceso",
            timestamp: new Date().toISOString(),
            nombre: document.getElementById('nombreUsuario').value.trim(),
            correo: document.getElementById('correoUsuario').value.trim(),
            aplicativo: document.getElementById('selectAplicativo').value,
            justificacion: document.getElementById('justificacion').value.trim()
        };

        // 2. Crear un formulario temporal en memoria para enviarlo al iframe
        const tempForm = document.createElement('form');
        tempForm.method = 'POST';
        // ENV.APPS_SCRIPT_URL debe estar definido en tu js/env.js
        tempForm.action = ENV.APPS_SCRIPT_URL;
        tempForm.target = 'hidden_iframe';

        const inputPayload = document.createElement('input');
        inputPayload.type = 'hidden';
        inputPayload.name = 'payload';
        inputPayload.value = JSON.stringify(payload);

        tempForm.appendChild(inputPayload);
        document.body.appendChild(tempForm);

        // 3. Enviar y destruir el formulario temporal
        tempForm.submit();
        document.body.removeChild(tempForm);
    });

    // Función auxiliar para mostrar mensajes
    function mostrarMensaje(texto, tipo) {
        mensajeEstado.textContent = texto;
        mensajeEstado.style.display = 'block';
        // Usamos colores de la paleta: verde neón para éxito, rojo para error
        mensajeEstado.style.backgroundColor = tipo === 'success' ? 'rgba(45, 232, 176, 0.1)' : 'rgba(255, 60, 60, 0.1)';
        mensajeEstado.style.color = tipo === 'success' ? '#2de8b0' : '#ff3c3c';
        mensajeEstado.style.border = `1px solid ${tipo === 'success' ? '#2de8b0' : '#ff3c3c'}`;
    }
});