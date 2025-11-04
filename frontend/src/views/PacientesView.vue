<template>
  <div>
    <!-- Formulario de registro -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">{{ editMode ? '✏️ Editar Paciente' : '📝 Registro de Paciente' }}</h2>
      </div>
      <form @submit.prevent="submitForm">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">ID Paciente *</label>
            <input 
              v-model="form.paciente_id" 
              type="text" 
              class="form-input" 
              placeholder="ID único del paciente"
              :disabled="editMode"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label">Código de Ingreso *</label>
            <input 
              v-model="form.codigo_ingreso" 
              type="text" 
              class="form-input" 
              placeholder="Código de ingreso"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label">Nombre *</label>
            <input 
              v-model="form.nombre" 
              type="text" 
              class="form-input" 
              placeholder="Nombre del paciente"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label">Apellidos *</label>
            <input 
              v-model="form.apellidos" 
              type="text" 
              class="form-input" 
              placeholder="Apellidos del paciente"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label">Dirección *</label>
            <input 
              v-model="form.direccion" 
              type="text" 
              class="form-input" 
              placeholder="Dirección de residencia"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label">Teléfono *</label>
            <input 
              v-model="form.telefono" 
              type="tel" 
              class="form-input" 
              placeholder="Número de teléfono"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label">EPS / Seguro *</label>
            <input 
              v-model="form.insurance" 
              type="text" 
              class="form-input" 
              placeholder="Nombre de la EPS"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label">Fecha de Registro *</label>
            <input 
              v-model="form.fecha_registro" 
              type="date" 
              class="form-input"
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

    <!-- Lista de pacientes -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">👥 Pacientes Registrados</h2>
      </div>
      <div class="search-box">
        <input 
          v-model="searchQuery"
          type="text" 
          class="search-input" 
          placeholder="Buscar por ID, nombre o apellido..."
        >
        <button class="btn btn-primary">🔍 Buscar</button>
      </div>
      
      <div v-if="loading" style="text-align: center; padding: 2rem;">
        <p>Cargando pacientes...</p>
      </div>

      <div v-else-if="filteredPacientes.length === 0" class="empty-state">
        <div class="empty-state-icon">📋</div>
        <p>No hay pacientes registrados</p>
      </div>

      <div v-else class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Código Ingreso</th>
              <th>Nombre Completo</th>
              <th>Teléfono</th>
              <th>EPS</th>
              <th>Fecha Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="paciente in filteredPacientes" :key="paciente.paciente_id">
              <td>{{ paciente.paciente_id }}</td>
              <td>{{ paciente.codigo_ingreso }}</td>
              <td>{{ paciente.nombre }} {{ paciente.apellidos }}</td>
              <td>{{ paciente.telefono }}</td>
              <td>{{ paciente.insurance }}</td>
              <td>{{ formatDate(paciente.fecha_registro) }}</td>
              <td>
                <button class="btn btn-sm btn-primary" @click="editPaciente(paciente)" title="Editar">
                  ✏️
                </button>
                <button class="btn btn-sm btn-danger" @click="removePaciente(paciente.paciente_id)" title="Eliminar">
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
import { getPacientes, createPaciente, updatePaciente, deletePaciente } from '@/services/api'

const pacientes = ref([])
const loading = ref(false)
const editMode = ref(false)
const searchQuery = ref('')
const form = ref({
  paciente_id: '',
  codigo_ingreso: '',
  nombre: '',
  apellidos: '',
  direccion: '',
  telefono: '',
  insurance: '',
  fecha_registro: ''
})

// Computed - Filtrar pacientes
const filteredPacientes = computed(() => {
  if (!searchQuery.value) return pacientes.value
  
  const query = searchQuery.value.toLowerCase()
  return pacientes.value.filter(p => 
    p.paciente_id.toLowerCase().includes(query) ||
    p.nombre.toLowerCase().includes(query) ||
    p.apellidos.toLowerCase().includes(query) ||
    p.codigo_ingreso.toLowerCase().includes(query)
  )
})

// Cargar pacientes
const loadPacientes = async () => {
  loading.value = true
  try {
    const response = await getPacientes()
    pacientes.value = response.data.Pacientes || []
  } catch (error) {
    console.error('Error al cargar pacientes:', error)
    showAlert('danger', '❌ Error al cargar pacientes')
  } finally {
    loading.value = false
  }
}

// Crear o actualizar
const submitForm = async () => {
  try {
    if (editMode.value) {
      await updatePaciente(form.value.paciente_id, form.value)
      showAlert('success', '✅ Paciente actualizado exitosamente')
    } else {
      await createPaciente(form.value)
      showAlert('success', '✅ Paciente creado exitosamente')
    }
    resetForm()
    loadPacientes()
  } catch (error) {
    console.error('Error:', error)
    showAlert('danger', '❌ Error al guardar paciente')
  }
}

// Editar paciente
const editPaciente = (paciente) => {
  form.value = { ...paciente }
  editMode.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Eliminar paciente
const removePaciente = async (id) => {
  if (confirm('¿Estás seguro de eliminar este paciente?')) {
    try {
      await deletePaciente(id)
      showAlert('success', '✅ Paciente eliminado exitosamente')
      loadPacientes()
    } catch (error) {
      console.error('Error:', error)
      showAlert('danger', '❌ Error al eliminar paciente')
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
    paciente_id: '',
    codigo_ingreso: '',
    nombre: '',
    apellidos: '',
    direccion: '',
    telefono: '',
    insurance: '',
    fecha_registro: ''
  }
  editMode.value = false
}

// Formatear fecha
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('es-CO')
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
  loadPacientes()
})
</script>

<style scoped>
/* Los estilos ya están en main.css */
</style>