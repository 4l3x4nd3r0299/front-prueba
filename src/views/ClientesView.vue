<script setup>
import { computed, onMounted, ref } from 'vue'
import { useClientes } from '../composables/useClientes'
import ClienteTable from '../components/ClienteTable.vue'
import ClienteForm from '../components/ClienteForm.vue'
import ConfirmModal from '../components/ConfirmModal.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import AlertMessage from '../components/AlertMessage.vue'
const { clientes, cargando, guardando, eliminando, error, exito, cargar, guardar, eliminar } = useClientes()
const busqueda = ref('')
const mostrarFormulario = ref(false)
const seleccionado = ref(null)
const paraEliminar = ref(null)
const filtrados = computed(() => clientes.value.filter(c => `${c.nombre ?? ''} ${c.email ?? ''} ${c.telefono ?? ''}`.toLocaleLowerCase().includes(busqueda.value.toLocaleLowerCase().trim())))
function nuevo() { seleccionado.value = null; mostrarFormulario.value = true; error.value = ''; exito.value = '' }
function editar(cliente) { seleccionado.value = { ...cliente }; mostrarFormulario.value = true; error.value = ''; exito.value = '' }
async function guardarFormulario(datos) { const ok = await guardar(datos, seleccionado.value?.id ?? null); if (ok) mostrarFormulario.value = false }
async function confirmarEliminacion() { if (!paraEliminar.value) return; const ok = await eliminar(paraEliminar.value.id); if (ok) paraEliminar.value = null }
onMounted(cargar)
</script>
<template>
    <section class="space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
            <div>
                <h1 class="text-3xl font-bold tracking-tight">Gestión de clientes</h1>
                <p class="mt-2 text-slate-500">Consulta, registra y administra tus clientes.</p>
            </div><button type="button"
                class="rounded-lg bg-blue-700 px-5 py-3 font-medium text-white shadow-sm hover:bg-blue-800"
                @click="nuevo">+ Nuevo cliente</button>
        </div>
        <AlertMessage :message="error" type="error" @close="error = ''" />
        <AlertMessage :message="exito" type="success" @close="exito = ''" />
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div class="flex flex-wrap items-center justify-between gap-3"><label for="busqueda" class="sr-only">Buscar
                    clientes</label><input id="busqueda" v-model="busqueda" type="search"
                    placeholder="Buscar por nombre, correo o teléfono..."
                    class="w-full max-w-md rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" /><span
                    class="text-sm text-slate-500">{{ filtrados.length }} cliente(s)</span></div>
        </div>
        <div v-if="cargando" class="flex items-center justify-center gap-3 py-12 text-slate-500">
            <LoadingSpinner /> Cargando clientes...
        </div>
        <ClienteTable v-else :clientes="filtrados" @editar="editar" @eliminar="paraEliminar = $event" />
        <div v-if="mostrarFormulario" class="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/50 p-4">
            <section role="dialog" aria-modal="true" aria-labelledby="form-title"
                class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                <h2 id="form-title" class="mb-5 text-xl font-bold">{{ seleccionado ? 'Editar cliente' : 'Nuevo cliente'
                    }}</h2>
                <ClienteForm :cliente="seleccionado" :guardando="guardando" @guardar="guardarFormulario"
                    @cancelar="mostrarFormulario = false" />
            </section>
        </div>
        <ConfirmModal v-if="paraEliminar" :cliente="paraEliminar" :procesando="eliminando"
            @confirmar="confirmarEliminacion" @cancelar="paraEliminar = null" />
    </section>
</template>
