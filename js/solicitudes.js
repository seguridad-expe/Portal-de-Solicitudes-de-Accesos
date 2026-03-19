document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-solicitud");
  const btnEnviar = document.getElementById("btn-enviar");
  const mensajeEstado = document.getElementById("mensaje-estado");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Bloquear botón y mostrar estado
    btnEnviar.disabled = true;
    btnEnviar.textContent = "Enviando...";
    mensajeEstado.style.display = "none";

    const payload = {
      tipo_formulario: "solicitud_acceso",
      timestamp: new Date().toISOString(),
      nombre: document.getElementById("nombreUsuario").value.trim(),
      correo: document.getElementById("correoUsuario").value.trim(),
      aplicativo: document.getElementById("selectAplicativo").value,
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
        "success",
      );
      form.reset();
    } catch (error) {
      console.error("Error al enviar:", error);
      mostrarMensaje(
        "❌ Hubo un problema al conectar con el servidor. Intenta de nuevo.",
        "error",
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
