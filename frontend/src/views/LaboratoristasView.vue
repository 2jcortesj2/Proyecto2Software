<template>
  <div>
    <!-- Formulario de registro -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">{{ editMode ? '✏️ Editar Laboratorista' : '🔬 Registro de Laboratorista' }}</h2>
      </div>
      <form @submit.prevent="submitForm">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Código Interno *</label>
            <input 
              v-model="form.codigo_interno" 
              type="text" 
              class="form-input" 
              placeholder="Código único del laboratorista"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label">Nombre Completo *</label>
            <input 
              v-model="form.nombre" 
              type="text" 
              class="form-input" 
              placeholder="Nombre del laboratorista"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label">Título Profesional *</label>
            <select v-model="form.titulo" class="form-select" required>
              <option value="">Seleccione título</option>
              <option value="Bacteriólogo/a">Bacteriólogo/a</option>
              <option value="Microbiólogo/a">Microbiólogo/a</option>
              <option value="Biólogo/a">Biólogo/a</option>
              <option value="Químico/a">Químico/a</option>
              <option value="Médico/a">Médico/a</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Teléfono de Contacto *</label>
            <input 
              v-model="form.telefono" 
              type="tel" 
              class="form-input" 
              placeholder="Número de teléfono"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label">Email *</label>
            <input 
              v-model="form.email" 
              type="email" 
              class="form-input" 
              placeholder="correo@ejemplo.com"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label">Especialidad *</label>
            <input 
              v-model="form.especialidad" 
              type="text" 
              class="form-input" 
              placeholder="Área de especialidad"
              required
            >
          </div>
        </div>
        <div class="btn-group">
          <button type="submit" class="btn btn-primary">
            {{ editMode ? '💾 Actualizar' : '💾 Guardar' }}
          </button>
          <button type="button" class="btn btn-warning" @click="resetForm">
            🔄 Limpiar
          </button>
          <button v-if="editMode" type="button" class="btn btn-danger" @click="cancelEdit">
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de laboratoristas -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">🔬 Laboratoristas Registrados</h2>
      </div>
      <div class="search-box">
        <input 
          v-model="searchQuery"
          type="text" 
          class="search-input" 
          placeholder="Buscar por código o nombre..."
        >
        <button class="btn btn-primary">🔍 Buscar</button>
      </div>
      
      <div v-if="loading" style="text-align: center; padding: 2rem;">
        <p>Cargando laboratoristas...</p>
      </div>

      <div v-else-if="filteredLaboratoristas.length === 0" class="empty-state">
        <div class="empty-state-icon">🔬</div>
        <p>No hay laboratoristas registrados</p>
      </div>

      <div v-else class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Título</th>
              <th>Especialidad</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="laboratorista in filteredLaboratoristas" :key="laboratorista.id">
              <td>{{ laboratorista.codigo_interno }}</td>
              <td>{{ laboratorista.nombre }}</td>
              <td>{{ laboratorista.titulo }}</td>
              <td>{{ laboratorista.especialidad }}</td>
              <td>{{ laboratorista.telefono }}</td>
              <td>{{ laboratorista.email }}</td>
              <td>
                <button class="btn btn-sm btn-primary" @click="editLaboratorista(laboratorista)" title="Editar">
                  ✏️
                </button>
                <button class="btn btn-sm btn-danger" @click="removeLaboratorista(laboratorista.id)" title="Eliminar">
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getLaboratoristas, createLaboratorista, updateLaboratorista, deleteLaboratorista } from '@/services/api'

const laboratoristas = ref([])
const loading = ref(false)
const editMode = ref(false)
const searchQuery = ref('')
const form = ref({
  codigo_interno: '',
  nombre: '',
  titulo: '',
  telefono: '',
  email: '',
  especialidad: ''
})

// Computed - Filtrar laboratoristas
const filteredLaboratoristas = computed(() => {
  if (!searchQuery.value) return laboratoristas.value
  
  const query = searchQuery.value.toLowerCase()
  return laboratoristas.value.filter(l => 
    l.codigo_interno.toLowerCase().includes(query) ||
    l.nombre.toLowerCase().includes(query) ||
    l.titulo.toLowerCase().includes(query)
  )
})

// Cargar laboratoristas
const loadLaboratoristas = async () => {
  loading.value = true
  try {
    const response = await getLaboratoristas()
    laboratoristas.value = response.data.Laboratoristas || []
  } catch (error) {
    console.error('Error al cargar laboratoristas:', error)
    showAlert('danger', '❌ Error al cargar laboratoristas')
  } finally {
    loading.value = false
  }
}

// Crear o actualizar
const submitForm = async () => {
  try {
    if (editMode.value) {
      await updateLaboratorista(form.value.id, form.value)
      showAlert('success', '✅ Laboratorista actualizado exitosamente')
    } else {
      await createLaboratorista(form.value)
      showAlert('success', '✅ Laboratorista creado exitosamente')
    }
    resetForm()
    loadLaboratoristas()
  } catch (error) {
    console.error('Error:', error)
    showAlert('danger', '❌ Error al guardar laboratorista')
  }
}

// Editar laboratorista
const editLaboratorista = (laboratorista) => {
  form.value = { ...laboratorista }
  editMode.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Eliminar laboratorista
const removeLaboratorista = async (id) => {
  if (confirm('¿Estás seguro de eliminar este laboratorista?')) {
    try {
      await deleteLaboratorista(id)
      showAlert('success', '✅ Laboratorista eliminado exitosamente')
      loadLaboratoristas()
    } catch (error) {
      console.error('Error:', error)
      showAlert('danger', '❌ Error al eliminar laboratorista')
    }
  }
}

// Cancelar edición
const cancelEdit = () => {
  resetForm()
}

// Resetear formulario
const resetForm = () => {
  form.value = {
    codigo_interno: '',
    nombre: '',
    titulo: '',
    telefono: '',
    email: '',
    especialidad: ''
  }
  editMode.value = false
}

// Mostrar alertas
const showAlert = (type, message) => {
  const alertContainer = document.getElementById('alertContainer')
  if (!alertContainer) return

  const alertDiv = document.createElement('div')
  alertDiv.className = `alert alert-${type}`
  alertDiv.style.animation = 'fadeIn 0.3s ease'
  alertDiv.textContent = message
  
  alertContainer.appendChild(alertDiv)
  
  setTimeout(() => {
    alertDiv.style.animation = 'fadeOut 0.3s ease'
    setTimeout(() => {
      if (alertContainer.contains(alertDiv)) {
        alertContainer.removeChild(alertDiv)
      }
    }, 300)
  }, 3000)
}

onMounted(() => {
  loadLaboratoristas()
})
</script>

<style scoped>
/* Los estilos ya están en main.css */
</style>