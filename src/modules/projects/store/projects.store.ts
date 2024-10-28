import { defineStore } from 'pinia';

export const useProyectosStore = defineStore('proyectos', {
  state: () => ({
    proyectos: JSON.parse(localStorage.getItem('proyectos')) || [] as { 
      id: string; 
      nombre: string; 
      tareas: { id: string; nombre: string; completada: boolean; fechaHora: string }[]; 
      progreso: number; 
    }[],
  }),
  actions: {
    agregarProyecto(nombreProyecto: string) {
      const proyecto = { 
        id: Date.now().toString(), 
        nombre: nombreProyecto, 
        tareas: [], 
        progreso: 0 
      };
      this.proyectos.push(proyecto);
      this.guardarProyectos(); // Guarda en Local Storage después de agregar
    },
    agregarTarea(idProyecto: string, nombreTarea: string) {
      const proyecto = this.proyectos.find((proyecto) => proyecto.id === idProyecto);
      if (proyecto && proyecto.tareas.length < 10) { // Limitar a 10 tareas
        proyecto.tareas.push({
          id: Date.now().toString(),
          nombre: nombreTarea,
          completada: false,
          fechaHora: new Date().toLocaleString(),
        });
        this.calcularProgreso(idProyecto);
        this.guardarProyectos(); // Guarda en Local Storage después de agregar
      } else {
        alert("No puedes agregar más de 10 tareas.");
      }
    },
    actualizarTarea(idProyecto: string, idTarea: string, nuevoNombre: string) {
      const proyecto = this.proyectos.find((proyecto) => proyecto.id === idProyecto);
      if (proyecto) {
        const tarea = proyecto.tareas.find((tarea) => tarea.id === idTarea);
        if (tarea) {
          tarea.nombre = nuevoNombre; // Actualiza el nombre de la tarea
          this.calcularProgreso(idProyecto);
          this.guardarProyectos(); // Guarda en Local Storage después de actualizar
        }
      }
    },
    eliminarTarea(idProyecto: string, idTarea: string) {
      const proyecto = this.proyectos.find((proyecto) => proyecto.id === idProyecto);
      if (proyecto) {
        proyecto.tareas = proyecto.tareas.filter((tarea) => tarea.id !== idTarea);
        this.calcularProgreso(idProyecto);
        this.guardarProyectos(); // Guarda en Local Storage después de eliminar
      }
    },
    calcularProgreso(idProyecto: string) {
      const proyecto = this.proyectos.find((proyecto) => proyecto.id === idProyecto);
      if (proyecto && proyecto.tareas.length > 0) {
        const tareasCompletadas = proyecto.tareas.filter(tarea => tarea.completada).length;
        proyecto.progreso = (tareasCompletadas / proyecto.tareas.length) * 100;
      }
      this.guardarProyectos(); // Guarda en Local Storage después de calcular el progreso
    },
    guardarProyectos() {
      localStorage.setItem('proyectos', JSON.stringify(this.proyectos)); // Guarda en Local Storage
    },
  },
});
