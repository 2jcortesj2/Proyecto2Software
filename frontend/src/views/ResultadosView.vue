<template>
  <div>
    <!-- Formulario de registro -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">{{ editMode ? '✏️ Editar Resultado' : '📊 Registro de Resultado de Perfil Lipídico' }}</h2>
      </div>
      <form @submit.prevent="submitForm">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Paciente *</label>
            <select v-model="form.paciente_id" class="form-select" required>
              <option value="">Seleccione un paciente</option>
              <option v-for="p in pacientes" :key="p.paciente_id" :value="p.paciente_id">
                {{ p.paciente_id }} - {{ p.nombre }} {{ p.apellidos }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Laboratorista *</label>
            <select v-model="form.laboratorista_id" class="form-select" required>
              <option value="">Seleccione un laboratorista</option>
              <option v-for="l in laboratoristas" :key="l.id" :value="l.id">
                {{ l.nombre }} - {{ l.titulo }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Colesterol Total (mg/dL) *</label>
            <input 
              v-model.number="form.colesterol_total" 
              type="number" 
              step="0.01"
              class="form-input" 
              placeholder="Ej: 185.5"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label">Colesterol HDL (mg/dL) *</label>
            <input 
              v-model.number="form.colesterol_hdl" 
              type="number" 
              step="0.01"
              class="form-input" 
              placeholder="Ej: 52.0"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label">Colesterol LDL (mg/dL) *</label>
            <input 
              v-model.number="form.colesterol_ldl" 
              type="number" 
              step="0.01"
              class="form-input" 
              placeholder="Ej: 115.0"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label">Triglicéridos (mg/dL) *</label>
            <input 
              v-model.number="form.trigliceridos" 
              type="number" 
              step="0.01"
              class="form-input" 
              placeholder="Ej: 130.0"
              required
            >
          </div>
          <div class="form-group">
            <label class="form-label">Fecha de Análisis *</label>
            <input 
              v-model="form.fecha_analisis" 
              type="date" 
              class="form-input"
              required
            >
          </div>
          <div class="form-group" style="grid-column: 1 / -1;">
            <label class="form-label">Observaciones</label>
            <textarea 
              v-model="form.observaciones" 
              class="form-textarea" 
              placeholder="Observaciones adicionales del análisis..."
              rows="3"
            ></textarea>
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

    <!-- Lista de resultados -->
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">📊 Resultados Registrados</h2>
      </div>
      <div class="search-box">
        <input 
          v-model="searchQuery"
          type="text" 
          class="search-input" 
          placeholder="Buscar por ID de resultado o paciente..."
        >
        <button class="btn btn-primary">🔍 Buscar</button>
      </div>
      
      <div v-if="loading" style="text-align: center; padding: 2rem;">
        <p>Cargando resultados...</p>
      </div>

      <div v-else-if="filteredResultados.length === 0" class="empty-state">
        <div class="empty-state-icon">📊</div>
        <p>No hay resultados registrados</p>
      </div>

      <div v-else class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Paciente</th>
              <th>Fecha</th>
              <th>Col. Total</th>
              <th>HDL</th>
              <th>LDL</th>
              <th>Triglicéridos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="resultado in filteredResultados" :key="resultado.id">
              <td>{{ resultado.id }}</td>
              <td>{{ getPacienteNombre(resultado.paciente_id) }}</td>
              <td>{{ formatDate(resultado.fecha_analisis) }}</td>
              <td>{{ resultado.colesterol_total }} <span :class="getBadgeClass(resultado.colesterol_total, 'total')">{{ getStatus(resultado.colesterol_total, 'total') }}</span></td>
              <td>{{ resultado.colesterol_hdl }} <span :class="getBadgeClass(resultado.colesterol_hdl, 'hdl')">{{ getStatus(resultado.colesterol_hdl, 'hdl') }}</span></td>
              <td>{{ resultado.colesterol_ldl }} <span :class="getBadgeClass(resultado.colesterol_ldl, 'ldl')">{{ getStatus(resultado.colesterol_ldl, 'ldl') }}</span></td>
              <td>{{ resultado.trigliceridos }} <span :class="getBadgeClass(resultado.trigliceridos, 'trigliceridos')">{{ getStatus(resultado.trigliceridos, 'trigliceridos') }}</span></td>
              <td>
                <button class="btn btn-sm btn-success" @click="viewDetails(resultado)" title="Ver detalles">
                  👁️
                </button>
                <button class="btn btn-sm btn-primary" @click="editResultado(resultado)" title="Editar">
                  ✏️
                </button>
                <button class="btn btn-sm btn-danger" @click="removeResultado(resultado.id)" title="Eliminar">
                  🗑️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de detalles -->
    <div v-if="showModal" class="modal show" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="card-title">📊 Detalle de Resultados</h2>
          <button class="modal-close" @click="closeModal">×</button>
        </div>
        
        <div v-if="selectedResultado" style="margin-bottom: 2rem;">
          <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Información del Paciente</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
            <div>
              <strong>Paciente:</strong> {{ getPacienteData(selectedResultado.paciente_id)?.nombre }} {{ getPacienteData(selectedResultado.paciente_id)?.apellidos }}
            </div>
            <div>
              <strong>ID:</strong> {{ selectedResultado.paciente_id }}
            </div>
            <div>
              <strong>Código Ingreso:</strong> {{ getPacienteData(selectedResultado.paciente_id)?.codigo_ingreso }}
            </div>
            <div>
              <strong>Fecha Análisis:</strong> {{ formatDate(selectedResultado.fecha_analisis) }}
            </div>
            <div>
              <strong>Dirección:</strong> {{ getPacienteData(selectedResultado.paciente_id)?.direccion }}
            </div>
            <div>
              <strong>Teléfono:</strong> {{ getPacienteData(selectedResultado.paciente_id)?.telefono }}
            </div>
          </div>
          
          <h3 style="color: var(--primary-color); margin-bottom: 1rem;">Resultados del Perfil Lipídico</h3>
          <div style="background: var(--light-bg); padding: 1.5rem; border-radius: 6px; margin-bottom: 1rem;">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem;">
              <div>
                <strong>Colesterol Total:</strong><br>
                <span :style="{ color: getColor(selectedResultado.colesterol_total, 'total'), fontSize: '1.2rem', fontWeight: 'bold' }">
                  {{ selectedResultado.colesterol_total }} mg/dL {{ getIcon(selectedResultado.colesterol_total, 'total') }}
                </span>
              </div>
              <div>
                <strong>Colesterol HDL:</strong><br>
                <span :style="{ color: getColor(selectedResultado.colesterol_hdl, 'hdl'), fontSize: '1.2rem', fontWeight: 'bold' }">
                  {{ selectedResultado.colesterol_hdl }} mg/dL {{ getIcon(selectedResultado.colesterol_hdl, 'hdl') }}
                </span>
              </div>
              <div>
                <strong>Colesterol LDL:</strong><br>
                <span :style="{ color: getColor(selectedResultado.colesterol_ldl, 'ldl'), fontSize: '1.2rem', fontWeight: 'bold' }">
                  {{ selectedResultado.colesterol_ldl }} mg/dL {{ getIcon(selectedResultado.colesterol_ldl, 'ldl') }}
                </span>
              </div>
              <div>
                <strong>Triglicéridos:</strong><br>
                <span :style="{ color: getColor(selectedResultado.trigliceridos, 'trigliceridos'), fontSize: '1.2rem', fontWeight: 'bold' }">
                  {{ selectedResultado.trigliceridos }} mg/dL {{ getIcon(selectedResultado.trigliceridos, 'trigliceridos') }}
                </span>
              </div>
            </div>
          </div>
          
          <div v-if="selectedResultado.observaciones" style="margin-bottom: 1rem;">
            <strong>Observaciones:</strong>
            <p style="margin-top: 0.5rem; padding: 1rem; background: var(--light-bg); border-radius: 6px;">
              {{ selectedResultado.observaciones }}
            </p>
          </div>
          
          <div style="margin-top: 1rem;">
            <strong>Laboratorista:</strong> {{ getLaboratoristaData(selectedResultado.laboratorista_id)?.nombre }} - {{ getLaboratoristaData(selectedResultado.laboratorista_id)?.titulo }}
          </div>
          
          <div class="btn-group" style="margin-top: 1.5rem;">
            <button class="btn btn-primary">📄 Imprimir</button>
            <button class="btn btn-success">📧 Enviar por Email</button>
            <button class="btn btn-warning" @click="closeModal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getResultados, createResultado, updateResultado, deleteResultado } from '@/services/api'
import { getPacientes } from '@/services/api'
import { getLaboratoristas } from '@/services/api'

const resultados = ref([])
const pacientes = ref([])
const laboratoristas = ref([])
const loading = ref(false)
const editMode = ref(false)
const searchQuery = ref('')
const showModal = ref(false)
const selectedResultado = ref(null)
const form = ref({
  paciente_id: '',
  laboratorista_id: '',
  colesterol_total: '',
  colesterol_hdl: '',
  colesterol_ldl: '',
  trigliceridos: '',
  fecha_analisis: '',
  observaciones: ''
})

// Computed - Filtrar resultados
const filteredResultados = computed(() => {
  if (!searchQuery.value) return resultados.value
  
  const query = searchQuery.value.toLowerCase()
  return resultados.value.filter(r => 
    r.id.toString().includes(query) ||
    r.paciente_id.toLowerCase().includes(query)
  )
})

// Cargar datos
const loadData = async () => {
  loading.value = true
  try {
    const [resResultados, resPacientes, resLaboratoristas] = await Promise.all([
      getResultados(),
      getPacientes(),
      getLaboratoristas()
    ])
    
    resultados.value = resResultados.data.Resultados || []
    pacientes.value = resPacientes.data.Pacientes || []
    laboratoristas.value = resLaboratoristas.data.Laboratoristas || []
  } catch (error) {
    console.error('Error al cargar datos:', error)
    showAlert('danger', '❌ Error al cargar datos')
  } finally {
    loading.value = false
  }
}

// Crear o actualizar
const submitForm = async () => {
  try {
    if (editMode.value) {
      await updateResultado(form.value.id, form.value)
      showAlert('success', '✅ Resultado actualizado exitosamente')
    } else {
      await createResultado(form.value)
      showAlert('success', '✅ Resultado creado exitosamente')
    }
    resetForm()
    loadData()
  } catch (error) {
    console.error('Error:', error)
    showAlert('danger', '❌ Error al guardar resultado')
  }
}

// Editar resultado
const editResultado = (resultado) => {
  form.value = { ...resultado }
  editMode.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Eliminar resultado
const removeResultado = async (id) => {
  if (confirm('¿Estás seguro de eliminar este resultado?')) {
    try {
      await deleteResultado(id)
      showAlert('success', '✅ Resultado eliminado exitosamente')
      loadData()
    } catch (error) {
      console.error('Error:', error)
      showAlert('danger', '❌ Error al eliminar resultado')
    }
  }
}

// Ver detalles
const viewDetails = (resultado) => {
  selectedResultado.value = resultado
  showModal.value = true
}

// Cerrar modal
const closeModal = () => {
  showModal.value = false
  selectedResultado.value = null
}

// Cancelar edición
const cancelEdit = () => {
  resetForm()
}

// Resetear formulario
const resetForm = () => {
  form.value = {
    paciente_id: '',
    laboratorista_id: '',
    colesterol_total: '',
    colesterol_hdl: '',
    colesterol_ldl: '',
    trigliceridos: '',
    fecha_analisis: '',
    observaciones: ''
  }
  editMode.value = false
}

// Obtener nombre del paciente
const getPacienteNombre = (id) => {
  const paciente = pacientes.value.find(p => p.paciente_id === id)
  return paciente ? `${paciente.nombre} ${paciente.apellidos}` : 'N/A'
}

// Obtener datos completos del paciente
const getPacienteData = (id) => {
  return pacientes.value.find(p => p.paciente_id === id)
}

// Obtener datos del laboratorista
const getLaboratoristaData = (id) => {
  return laboratoristas.value.find(l => l.id === id)
}

// Formatear fecha
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('es-CO')
}

// Evaluar valores y obtener estado
const getStatus = (value, type) => {
  const ranges = {
    total: { normal: [0, 200], elevado: [200, 240], alto: [240, 999] },
    hdl: { bajo: [0, 40], normal: [40, 60], alto: [60, 999] },
    ldl: { normal: [0, 100], elevado: [100, 130], alto: [130, 999] },
    trigliceridos: { normal: [0, 150], elevado: [150, 200], alto: [200, 999] }
  }
  
  const range = ranges[type]
  if (!range) return ''
  
  if (type === 'hdl') {
    if (value < range.bajo[1]) return '⚠️'
    if (value >= range.alto[0]) return '✓'
    return '✓'
  }
  
  if (value <= range.normal[1]) return '✓'
  if (value <= range.elevado[1]) return '⚠️'
  return '⚠️'
}

const getBadgeClass = (value, type) => {
  const status = getStatus(value, type)
  if (status === '✓') return 'badge badge-success'
  return 'badge badge-warning'
}

const getColor = (value, type) => {
  const status = getStatus(value, type)
  return status === '✓' ? 'var(--success-color)' : 'var(--warning-color)'
}

const getIcon = (value, type) => {
  return getStatus(value, type)
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
  loadData()
})
</script>

<style scoped>
/* Los estilos ya están en main.css */
</style>