<template>
    <div class="min-h-screen">
        <header class="bg-slate-900 text-white shadow">
            <div class="mx-auto max-w-6xl px-5 py-5 flex items-center justify-between">
                <RouterLink to="/clientes" class="text-xl font-bold tracking-tight">Nexar · Clientes</RouterLink><span
                    class="text-sm text-slate-300">Panel administrativo</span>
            </div>
        </header>
        <main class="mx-auto max-w-6xl px-5 py-10">
            <RouterView />
        </main>
    </div>
</template>
