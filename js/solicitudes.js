document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-solicitud");
  const btnEnviar = document.getElementById("btn-enviar");
  const mensajeEstado = document.getElementById("mensaje-estado");
  const selectApp = document.getElementById("selectAplicativo");
  const grupoOtro = document.getElementById("grupo-otro-aplicativo");
  const inputOtro = document.getElementById("otroAplicativo");

  // --- Lógica Visual: Mostrar/Ocultar campo "Otro" ---
  selectApp.addEventListener("change", () => {
    if (selectApp.value === "Otro") {
      grupoOtro.style.display = "block";
      inputOtro.required = true;
    } else {
      grupoOtro.style.display = "none";
      inputOtro.required = false;
      inputOtro.value = "";
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

 const payload = {
    tipo_formulario: "solicitud_acceso",
    timestamp: new Date().toISOString(),
    nombre: document.getElementById("nombreUsuario").value.trim(),
    correo: document.getElementById("correoUsuario").value.trim(),
    
    // NUEVOS CAMPOS ENVIADOS AL SCRIPT
    tipo_acceso: document.getElementById("tipoAcceso").value,
    cliente_nombre: document.getElementById("clienteNombre").value.trim(),
    correo_responsable_manual: inputCorreoManual.value.trim(),
    
    // Mantenemos tu lógica de aplicativo final
    aplicativo: (selectApp.value === "Otro") ? inputOtro.value.trim() : selectApp.value,
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
      
      form.reset();
      grupoOtro.style.display = "none"; // Ocultar el campo extra tras el reset

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