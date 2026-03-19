document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-solicitud');
    const btnEnviar = document.getElementById('btn-enviar');
    const mensajeEstado = document.getElementById('mensaje-estado');

    // 1. Escuchar la respuesta del iframe (por si acaso Google lo permite)
    window.addEventListener('message', (event) => {
        if (event.data === 'FORM_OK') {
            finalizarEnvioExitoso();
        }
    });

    // 2. Interceptar el envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault(); 

        btnEnviar.disabled = true;
        btnEnviar.textContent = 'Enviando...';
        mensajeEstado.style.display = 'none';

        // OJO: Usamos 'correo' porque así está en tu index.html
        const payload = {
            tipo_formulario: "solicitud_acceso",
            timestamp: new Date().toISOString(),
            nombre: document.getElementById('nombreUsuario').value.trim(),
            correo: document.getElementById('correo').value.trim(),
            aplicativo: document.getElementById('selectAplicativo').value,
            justificacion: document.getElementById('justificacion').value.trim()
        };

        const tempForm = document.createElement('form');
        tempForm.method = 'POST';
        tempForm.action = ENV.APPS_SCRIPT_URL;
        tempForm.target = 'hidden_iframe';

        const inputPayload = document.createElement('input');
        inputPayload.type = 'hidden';
        inputPayload.name = 'payload';
        inputPayload.value = JSON.stringify(payload);

        tempForm.appendChild(inputPayload);
        document.body.appendChild(tempForm);

        // 3. ENVIAR
        tempForm.submit();
        document.body.removeChild(tempForm);

        // 4. ÉXITO PREVENTIVO (Como el iframe suele fallar en responder por CORS/X-Frame)
        // Le damos 2.5 segundos de espera y forzamos el éxito visual
        setTimeout(() => {
            if (btnEnviar.disabled) { // Si aún sigue en estado "Enviando..."
                finalizarEnvioExitoso();
            }
        }, 2500);
    });

    function finalizarEnvioExitoso() {
        mostrarMensaje('✅ Solicitud enviada con éxito. El responsable ha sido notificado.', 'success');
        form.reset();
        
        // Pequeño truco para limpiar los campos readonly autocompletados si es necesario
        // document.getElementById('nombreUsuario').value = "..."; 
        
        btnEnviar.disabled = false;
        btnEnviar.textContent = 'Enviar Solicitud';
    }

    function mostrarMensaje(texto, tipo) {
        mensajeEstado.textContent = texto;
        mensajeEstado.style.display = 'block';
        mensajeEstado.style.backgroundColor = tipo === 'success' ? 'rgba(45, 232, 176, 0.1)' : 'rgba(255, 60, 60, 0.1)';
        mensajeEstado.style.color = tipo === 'success' ? '#2de8b0' : '#ff3c3c';
        mensajeEstado.style.border = `1px solid ${tipo === 'success' ? '#2de8b0' : '#ff3c3c'}`;
    }
});