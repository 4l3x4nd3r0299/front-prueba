import api from './api'
export const clienteService = {
  listar: () => api.get('/clientes'),
  crear: (datos) => api.post('/clientes', datos),
  actualizar: (id, datos) => api.put(`/clientes/${id}`, datos),
  eliminar: (id) => api.delete(`/clientes/${id}`)
}
