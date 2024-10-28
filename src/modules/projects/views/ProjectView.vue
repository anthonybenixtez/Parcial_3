<template>
  <div class="p-8 max-w-4xl mx-auto bg-white shadow-lg rounded-xl">
    <h2 class="text-3xl font-bold mb-6 text-center text-green-600">
      Nombre Proyecto: {{ proyectoActual?.nombre }}
    </h2>

    <div class="mt-4 flex items-center mb-6">
      <input
        v-model="nuevaTarea"
        type="text"
        placeholder="Agregar nueva tarea"
        class="input input-bordered mr-2 p-2 border rounded-lg flex-1 focus:outline-none focus:ring focus:ring-green-300"
      />
      <button @click="agregarTarea" class="btn btn-success p-2 rounded-lg hover:bg-green-600 transition duration-300">
        Agregar
      </button>
    </div>

    <table class="table-auto w-full bg-green-50 rounded-lg shadow-md">
      <thead>
        <tr class="bg-green-500 text-white">
          <th class="py-3 px-5">#</th>
          <th class="py-3 px-5">Completada</th>
          <th class="py-3 px-5">Tarea</th>
          <th class="py-3 px-5">Fecha y hora</th>
          <th class="py-3 px-5">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(tarea, index) in proyectoActual?.tareas"
          :key="tarea.id"
          class="hover:bg-green-100 transition duration-300"
        >
          <td class="py-3 px-5">{{ index + 1 }}</td>
          <td class="py-3 px-5">
            <input type="checkbox" v-model="tarea.completada" @change="actualizarProgreso(proyectoActual.id)" />
          </td>
          <td class="py-3 px-5">
            <span>{{ tarea.nombre }}</span>
          </td>
          <td class="py-3 px-5">{{ tarea.fechaHora }}</td>
          <td class="py-3 px-5">
            <button
              @click="abrirModal(tarea)"  
              class="btn btn-sm btn-secondary mr-2 rounded-lg hover:bg-green-300"
            >
              Actualizar
            </button>
            <button
              @click="eliminarTarea(tarea.id)"
              class="btn btn-sm btn-error rounded-lg hover:bg-red-600 text-white"
            >
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal para actualizar la tarea -->
    <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 class="text-2xl font-semibold mb-4">Actualizar Tarea</h3>
        <input
          v-model="tareaSeleccionada.nombre"
          type="text"
          class="input input-bordered w-full p-2 rounded-lg border focus:outline-none focus:ring focus:ring-green-300 mb-4"
        />
        <div class="flex justify-end">
          <button @click="cerrarModal" class="btn btn-secondary mr-2 rounded-lg">
            Cancelar
          </button>
          <button @click="confirmarActualizacion" class="btn btn-success rounded-lg">
            Guardar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useProyectosStore } from '../store/projects.store';

const proyectosStore = useProyectosStore();
const route = useRoute();
const nuevaTarea = ref('');
const mostrarModal = ref(false); // Estado del modal
const tareaSeleccionada = ref({ id: '', nombre: '' }); // Tarea seleccionada para editar

const proyectoActual = computed(() =>
  proyectosStore.proyectos.find((proyecto) => proyecto.id === route.params.id)
);

const agregarTarea = () => {
  if (nuevaTarea.value.trim() !== '' && proyectoActual.value.tareas.length < 10) {
    proyectosStore.agregarTarea(route.params.id as string, nuevaTarea.value.trim());
    nuevaTarea.value = '';
  } else {
    alert('No puedes agregar más de 10 tareas.');
  }
};

const eliminarTarea = (idTarea: string) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
    proyectosStore.eliminarTarea(route.params.id as string, idTarea);
  }
};

const actualizarProgreso = (idProyecto: string) => {
  const proyecto = proyectosStore.proyectos.find((p) => p.id === idProyecto);
  if (proyecto) {
    const totalTareas = proyecto.tareas.length;
    const tareasCompletadas = proyecto.tareas.filter((t) => t.completada).length;
    proyecto.progreso = (tareasCompletadas / totalTareas) * 100;
    proyectosStore.guardarProyectos(); // Guarda los cambios en el Local Storage
  }
};

// Abre el modal y configura la tarea seleccionada para editar
const abrirModal = (tarea: { id: string; nombre: string }) => {
  tareaSeleccionada.value = { ...tarea }; // Clona la tarea seleccionada
  mostrarModal.value = true;
};

// Cierra el modal
const cerrarModal = () => {
  mostrarModal.value = false;
};

// Confirma la actualización de la tarea
const confirmarActualizacion = () => {
  if (tareaSeleccionada.value.nombre.trim()) {
    proyectosStore.actualizarTarea(route.params.id as string, tareaSeleccionada.value.id, tareaSeleccionada.value.nombre);
    cerrarModal();
  }
};
</script>

<style scoped>
.input {
  border: 1px solid #d1fae5; /* green-200 */
  border-radius: 0.375rem;
  padding: 0.5rem;
  transition: border-color 0.2s;
}

.input:focus {
  border-color: #10b981; /* green-500 */
  outline: none;
}

.btn {
  background-color: #10b981; /* green-500 */
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;
}

.btn-success:hover {
  background-color: #047857; /* green-700 */
}

.btn-secondary {
  background-color: #d1fae5; /* green-200 */
  color: #065f46; /* green-800 */
}

.btn-error {
  background-color: #f87171; /* red-400 */
  color: white;
}

.btn-error:hover {
  background-color: #ef4444; /* red-600 */
}

.fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
}
</style>
