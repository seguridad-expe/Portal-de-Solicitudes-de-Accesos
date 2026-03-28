document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-solicitud");
  const btnEnviar = document.getElementById("btn-enviar");
  const mensajeEstado = document.getElementById("mensaje-estado");
  const selectApp = document.getElementById("selectAplicativo");
  
  // Elementos para la opción "Otro"
  const grupoOtro = document.getElementById("grupo-otro-aplicativo");
  const inputOtro = document.getElementById("otroAplicativo");
  
  // Elementos para el correo del responsable (Nuevo)
  const grupoCorreo = document.getElementById("grupo-correo-responsable");
  const inputCorreoManual = document.getElementById("correoResponsableManual");

  // --- Lógica Visual: Mostrar/Ocultar campos al seleccionar "Otro" ---
  selectApp.addEventListener("change", () => {
    if (selectApp.value === "Otro") {
      // Mostramos el campo para escribir la App y el campo del Correo
      grupoOtro.style.display = "block";
      grupoCorreo.style.display = "block"; 
      
      // Los volvemos obligatorios
      inputOtro.required = true;
      inputCorreoManual.required = true;
    } else {
      // Ocultamos ambos campos
      grupoOtro.style.display = "none";
      grupoCorreo.style.display = "none";
      
      // Quitamos la obligatoriedad y limpiamos lo que hayan escrito
      inputOtro.required = false;
      inputCorreoManual.required = false;
      inputOtro.value = "";
      inputCorreoManual.value = "";
    }
  });

  // --- Lógica de Envío ---
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    btnEnviar.disabled = true;
    btnEnviar.textContent = "Enviando...";
    mensajeEstado.style.display = "none";

    // Determinamos el nombre del aplicativo final
    const aplicativoSeleccionado = selectApp.value;
    const aplicativoFinal = (aplicativoSeleccionado === "Otro") 
      ? `Otro: ${inputOtro.value.trim()}` 
      : aplicativoSeleccionado;

    // Construimos el paquete de datos (Payload) con TODOS los campos nuevos
    const payload = {
      tipo_formulario: "solicitud_acceso",
      timestamp: new Date().toISOString(),
      nombre: document.getElementById("nombreUsuario").value.trim(),
      correo: document.getElementById("correoUsuario").value.trim(),
      
      // Nuevos campos para la política de 2026
      tipo_acceso: document.getElementById("tipoAcceso").value,
      cliente_nombre: document.getElementById("clienteNombre").value.trim(),
      correo_responsable_manual: inputCorreoManual.value.trim(),
      
      aplicativo: aplicativoFinal,
      justificacion: document.getElementById("justificacion").value.trim(),
    };

    try {
      const formData = new URLSearchParams();
      formData.append("payload", JSON.stringify(payload));

      await fetch(ENV.APPS_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      mostrarMensaje(
        "✅ Solicitud enviada con éxito. El responsable ha sido notificado.",
        "success"
      );
      
      // Reseteamos el formulario y volvemos a ocultar los campos condicionales
      form.reset();
      grupoOtro.style.display = "none";
      grupoCorreo.style.display = "none";

    } catch (error) {
      console.error("Error al enviar:", error);
      mostrarMensaje(
        "❌ Hubo un problema al conectar con el servidor. Intenta de nuevo.",
        "error"
      );
    } finally {
      btnEnviar.disabled = false;
      btnEnviar.textContent = "Enviar Solicitud";
    }
  });

  function mostrarMensaje(texto, tipo) {
    mensajeEstado.textContent = texto;
    mensajeEstado.style.display = "block";
    mensajeEstado.style.backgroundColor =
      tipo === "success" ? "rgba(45, 232, 176, 0.1)" : "rgba(255, 60, 60, 0.1)";
    mensajeEstado.style.color = tipo === "success" ? "#2de8b0" : "#ff3c3c";
    mensajeEstado.style.border = `1px solid ${tipo === "success" ? "#2de8b0" : "#ff3c3c"}`;
  }
});