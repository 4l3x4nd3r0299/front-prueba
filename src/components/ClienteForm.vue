<script setup>
import { reactive, ref, watch } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'
const props = defineProps({ cliente: { type: Object, default: null }, guardando: { type: Boolean, default: false } })
const emit = defineEmits(['guardar', 'cancelar'])
const form = reactive({ nombre: '', email: '', telefono: '' })
const errores = ref({})
watch(() => props.cliente, (cliente) => { Object.assign(form, { nombre: cliente?.nombre ?? '', email: cliente?.email ?? '', telefono: cliente?.telefono ?? '' }); errores.value = {} }, { immediate: true })
function enviar() {
  const e = {}
  if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Ingresa un correo válido.'
  errores.value = e
  if (Object.keys(e).length) return
  emit('guardar', { nombre: form.nombre.trim(), email: form.email.trim(), telefono: form.telefono.trim() })
}
</script>
<template><form class="space-y-5" novalidate @submit.prevent="enviar"><div><label for="nombre" class="mb-1 block text-sm font-medium">Nombre *</label><input id="nombre" v-model="form.nombre" maxlength="120" class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500" :aria-invalid="!!errores.nombre"/><p v-if="errores.nombre" class="mt-1 text-sm text-red-600">{{ errores.nombre }}</p></div><div><label for="email" class="mb-1 block text-sm font-medium">Correo electrónico *</label><input id="email" v-model="form.email" type="email" maxlength="255" class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500" :aria-invalid="!!errores.email"/><p v-if="errores.email" class="mt-1 text-sm text-red-600">{{ errores.email }}</p></div><div><label for="telefono" class="mb-1 block text-sm font-medium">Teléfono</label><input id="telefono" v-model="form.telefono" type="tel" maxlength="30" class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"/></div><div class="flex justify-end gap-3 border-t border-slate-100 pt-4"><button type="button" :disabled="guardando" class="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-50" @click="$emit('cancelar')">Cancelar</button><button type="submit" :disabled="guardando" class="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 font-medium text-white hover:bg-blue-800 disabled:opacity-60"><LoadingSpinner v-if="guardando"/>{{ guardando ? 'Guardando...' : 'Guardar cliente' }}</button></div></form></template>
