<template>
  <div class="overflow-x-auto w-full p-8 bg-white shadow-lg rounded-xl">
    <h2 class="text-3xl font-bold mb-6 text-center text-green-600">Lista de Proyectos</h2>
    
    <table class="table-auto w-full bg-green-50 rounded-lg shadow-md">
      <!-- head -->
      <thead>
        <tr class="bg-green-500 text-white">
          <th class="py-3 px-5">#</th>
          <th class="py-3 px-5">Proyecto</th>
          <th class="py-3 px-5">Tareas</th>
          <th class="py-3 px-5">Avance</th>
        </tr>
      </thead>
      
      <tbody>
        <tr
          v-for="(proyecto, i) in proyectosStore.proyectos"
          :key="i"
          class="hover:bg-green-100 transition duration-300"
        >
          <th class="py-3 px-5">{{ i + 1 }}</th>
          <td class="py-3 px-5">{{ proyecto.nombre }}</td>
          <td class="py-3 px-5">{{ proyecto.tareas.length }}</td>
          <td class="py-3 px-5">
            <progress
              :value="proyecto.progreso"
              class="progress progress-success w-56"
              max="100"
            ></progress>
          </td>
        </tr>
      </tbody>
    </table>
    
    <!-- Input modal -->
    <input-modal
      :open="modalOpen"
      @close="modalOpen = false"
      @value="onNewValue"
      placeholder="Ingrese el nombre del proyecto"
      title="Nuevo proyecto"
      sub-title="Dale un nombre único a tu proyecto"
    />


    <!-- Floating action buttons -->
    <fab-button @click="modalOpen = true" position="bottom-right">
      <AddCircle class="text-green-600" />
    </fab-button>

    <fab-button @click="customModalOpen = true" position="bottom-left">
      <ModalIcon class="text-green-600" />
    </fab-button>
  </div>
</template>

<script lang="ts" setup>
import FabButton from '@/modules/common/components/FabButton.vue';
import InputModal from '@/modules/common/components/InputModal.vue';
import AddCircle from '@/modules/common/icons/AddCircle.vue';
import ModalIcon from '@/modules/common/icons/ModalIcon.vue';
import { ref } from 'vue';
import { useProyectosStore } from '../store/projects.store';

const proyectosStore = useProyectosStore();
const modalOpen = ref(false);
const customModalOpen = ref(false);

const onNewValue = (nombreProyecto: string) => {
  proyectosStore.agregarProyecto(nombreProyecto);
  modalOpen.value = false; // Cierra el modal después de agregar un nuevo proyecto
};
</script>

<style scoped>
.table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 1px solid #d1fae5; /* green-200 */
  text-align: left;
  padding: 0.75rem;
}

th {
  background-color: #10b981; /* green-500 */
  color: white;
}

.progress {
  height: 1.25rem;
}
</style>
