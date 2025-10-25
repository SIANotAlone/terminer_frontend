<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

// Стан меню та підменю
const isMenuOpen = ref(false);
const isServicesDropdownOpen = ref(false);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
  if (!isMenuOpen.value) {
    isServicesDropdownOpen.value = false;
  }
}

function toggleServicesDropdown() {
  isServicesDropdownOpen.value = !isServicesDropdownOpen.value;
}
</script>

<template>
  <nav>
    <ul :class="{ 'open': isMenuOpen }" class="menu-list">
      <li><RouterLink to="/" @click="isMenuOpen = false">Головна</RouterLink></li>
      
      <li class="dropdown" :class="{ 'open': isServicesDropdownOpen }">
        <a href="#" @click.prevent="toggleServicesDropdown" class="dropdown-toggle">
          Послуги <span class="arrow">&#9662;</span>
        </a>
        <ul class="dropdown-menu">
          <li><RouterLink to="/service/available" @click="isMenuOpen = false; isServicesDropdownOpen = false">Доступні</RouterLink></li>
          <li v-if="authorized"><RouterLink to="/service/myreactions" @click="isMenuOpen = false; isServicesDropdownOpen = false">Реакції</RouterLink></li>
          <li v-if="authorized"><RouterLink to="/comments" @click="isMenuOpen = false; isServicesDropdownOpen = false">Коментарі</RouterLink></li>
          <li><RouterLink to="/service/promocode" @click="isMenuOpen = false; isServicesDropdownOpen = false">Промокод</RouterLink></li>
          <li><RouterLink to="/statistics" @click="isMenuOpen = false; isServicesDropdownOpen = false">Статистика</RouterLink></li>
        </ul>
      </li>
      
      <li><RouterLink to="/about" @click="isMenuOpen = false">Про нас</RouterLink></li>
    </ul>

    <!-- 🟢 Гамбургер-кнопка переміщена праворуч -->
    <button @click="toggleMenu" class="hamburger" aria-label="Toggle menu">
      &#9776;
    </button>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      authorized: false
    }
  },
  mounted() {
    this.checkAuthorization();
  },
  methods: {
    checkAuthorization() {
      const token = localStorage.getItem("jwt_token");
      this.authorized = !!token;
    }
  }
}
</script>

<style scoped>
/* Основні стилі */
nav {
  display: flex;
  justify-content: flex-end; /* 🔹 усе вирівняно праворуч */
  align-items: center;
  padding: 10px 20px;
  background-color: rgba(0, 0, 0, 0.5); 
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

ul.menu-list {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  align-items: center;
}

ul.menu-list > li {
  padding-left: 20px;
  position: relative;
}

a {
  text-decoration: none;
  color: #fff;
  padding: 8px 12px;
  display: block;
  transition: color 0.3s ease;
}

a:hover,
.dropdown-toggle:hover {
  color: #ff9aff; 
}

/* Випадаюче меню */
.dropdown-toggle {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.dropdown-menu {
  display: none;
  position: absolute;
  background-color: rgba(30, 30, 30, 0.9); 
  list-style: none;
  padding: 10px 0;
  margin: 0;
  min-width: 180px;
  top: 100%;
  left: 0;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  z-index: 10;
}

.dropdown.open .dropdown-menu {
  display: block;
}

.dropdown-menu li {
  padding: 0;
}

.dropdown-menu a {
  color: #fff;
  padding: 8px 15px;
  white-space: nowrap;
}

.dropdown-menu a:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #ff9aff;
}

.arrow {
  margin-left: 5px;
  font-size: 10px;
  transition: transform 0.3s ease;
}

.dropdown.open .arrow {
  transform: rotate(180deg);
}

/* Гамбургер */
.hamburger {
  display: none;
  font-size: 30px;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
}

/* Мобільне меню */
@media (max-width: 768px) {
  nav {
    justify-content: flex-end; /* 🔹 гамбургер праворуч */
  }

  .hamburger {
    display: block;
    order: 2; /* кнопка справа */
    margin-left: 10px;
  }

  ul.menu-list {
    display: none;
    flex-direction: column;
    width: 100%;
    position: absolute;
    top: 60px;
    left: 0; /* 🔹 меню відкривається, як раніше — зліва */
    background-color: rgba(0, 0, 0, 0.9);
    padding: 10px 0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  }

  ul.menu-list.open {
    display: flex;
  }

  ul.menu-list > li {
    text-align: center;
    width: 100%;
  }

  .dropdown {
    width: 100%;
  }

  .dropdown-toggle {
    display: flex;
    justify-content: center;
  }

  .dropdown-menu {
    position: static;
    width: 100%;
    background-color: rgba(30, 30, 30, 0.7);
    border-radius: 0;
    box-shadow: none;
  }
}
</style>
