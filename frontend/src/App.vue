<template>
  <div id="app">
    <!-- Header -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <div class="logo-icon">🧬</div>
          <div>
            <h1 style="font-size: 1.5rem;">BioLab LIS</h1>
            <p style="font-size: 0.85rem; opacity: 0.9;">Sistema de Información de Laboratorio</p>
          </div>
        </div>
        <div class="user-info">
          <span>👤 Usuario Administrador</span>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="nav">
      <div class="nav-content">
        <ul class="nav-tabs">
          <li>
            <router-link to="/pacientes" class="nav-tab">
              👥 Pacientes
            </router-link>
          </li>
          <li>
            <router-link to="/resultados" class="nav-tab">
              📊 Resultados
            </router-link>
          </li>
          <li>
            <router-link to="/laboratoristas" class="nav-tab">
              🔬 Laboratoristas
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="main-container">
      <router-view />
    </main>

    <!-- Alert Container -->
    <div id="alertContainer" class="alert-container"></div>
  </div>
</template>

<script setup>
</script>

<style>
.header {
  background: var(--primary-color);
  color: var(--white);
  padding: 1rem 0;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: var(--secondary-color);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Navigation */
.nav {
  background: var(--white);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.nav-tabs {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.nav-tab {
  padding: 1rem 0;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.3s ease;
  color: var(--text-dark);
  font-weight: 500;
  text-decoration: none;
  display: block;
}

.nav-tab:hover {
  color: var(--secondary-color);
}

.nav-tab.router-link-active {
  color: var(--secondary-color);
  border-bottom-color: var(--secondary-color);
}

/* Alert Container */
.alert-container {
  position: fixed;
  top: 100px;
  right: 20px;
  z-index: 1001;
  max-width: 400px;
}
</style>