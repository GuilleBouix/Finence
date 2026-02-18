// Servicio de notificaciones toast
// Centraliza los mensajes de éxito, error e información
import toast from "react-hot-toast";

export const toastService = {
  // Muestra un mensaje de éxito
  success: (mensaje: string) => {
    toast.success(mensaje);
  },

  // Muestra un mensaje de error
  error: (mensaje: string) => {
    toast.error(mensaje);
  },

  // Muestra un mensaje genérico
  custom: (mensaje: string) => {
    toast(mensaje);
  },
};

// Mensajes predefinidos para la aplicación
export const mensajes = {
  // Auth
  auth: {
    loginExito: "Has iniciado sesión correctamente",
    logoutExito: "Has cerrado sesión",
    loginError: "Error al iniciar sesión",
    credencialesIncorrectas: "Correo o contraseña incorrectos",
    errorGoogle: "Error al conectar con Google",
  },

  // Transacciones
  transacciones: {
    ingresoRegistrado: "Ingreso registrado con exito",
    gastoRegistrado: "Gasto registrado con exito",
    errorGuardar: "Hubo un problema al guardar el movimiento",
    actualizado: "Transaccion actualizada correctamente",
    errorActualizar: "Error al actualizar la transaccion",
    eliminado: "Transaccion eliminada correctamente",
    errorEliminar: "No se pudo eliminar la transaccion",
  },

  // Perfil
  perfil: {
    fotoActualizada: "Foto de perfil actualizada",
    errorFoto: "Error al actualizar la foto",
  },

  // Datos
  datos: {
    reseteados: "Todos los datos han sido borrados",
    errorResetear: "Hubo un error al resetear los datos",
  },
};
