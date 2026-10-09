import { ref } from 'vue'
import { clienteService } from '../services/clienteService'
function mensajeError(error) {
  const data = error.response?.data
  if (data?.errors && typeof data.errors === 'object') return Object.values(data.errors).flat().join(' ')
  if (typeof data?.message === 'string') return data.message
  if (!error.response) return 'No fue posible conectar con el servidor. Verifica la API y CORS.'
  return `Error HTTP ${error.response.status}. Inténtalo nuevamente.`
}
export function useClientes() {
  const clientes = ref([])
  const cargando = ref(false)
  const guardando = ref(false)
  const eliminando = ref(false)
  const error = ref('')
  const exito = ref('')
  async function cargar() {
    cargando.value = true; error.value = ''
    try {
      const { data } = await clienteService.listar()
      // Admite un array directo, { data: [...] } y { data: { data: [...] } }.
      const lista = Array.isArray(data) ? data : (Array.isArray(data?.data) ? data.data : data?.data?.data)
      if (!Array.isArray(lista)) throw new Error('Formato de listado no reconocido')
      clientes.value = lista
    } catch (e) { error.value = e.message === 'Formato de listado no reconocido' ? 'La respuesta de la API no contiene una lista de clientes válida.' : mensajeError(e) }
    finally { cargando.value = false }
  }
  async function guardar(datos, id = null) {
    guardando.value = true; error.value = ''; exito.value = ''
    try {
      if (id === null || id === undefined) await clienteService.crear(datos)
      else await clienteService.actualizar(id, datos)
      await cargar()
      if (error.value) return false
      exito.value = id == null ? 'Cliente creado correctamente.' : 'Cliente actualizado correctamente.'
      return true
    } catch (e) { error.value = mensajeError(e); return false }
    finally { guardando.value = false }
  }
  async function eliminar(id) {
    eliminando.value = true; error.value = ''; exito.value = ''
    try {
      await clienteService.eliminar(id)
      await cargar()
      if (error.value) return false
      exito.value = 'Cliente eliminado correctamente.'
      return true
    } catch (e) { error.value = mensajeError(e); return false }
    finally { eliminando.value = false }
  }
  return { clientes, cargando, guardando, eliminando, error, exito, cargar, guardar, eliminar }
}
