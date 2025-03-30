<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const isMenuOpen = ref(false);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}
</script>

<template>
  <nav>
    <button @click="toggleMenu" class="hamburger" aria-label="Toggle menu">
      &#9776; <!-- Hamburger icon -->
    </button>
    <ul :class="{ 'open': isMenuOpen }">
      <li><RouterLink to="/">Головна</RouterLink></li>
      <!-- <li><RouterLink to="/sign-up">Реєстрація</RouterLink></li>
      <li><RouterLink to="/sign-in">Авторизація</RouterLink></li> -->
      <li><RouterLink to="/service/available">Послуги</RouterLink></li>
      <li><RouterLink to="/about">Про нас</RouterLink></li>
      <li v-if="authorized"><RouterLink to="/service/myreactions">Реакції</RouterLink></li>
      <li><RouterLink to="/service/promocode">Промокод</RouterLink></li>
    </ul>
  </nav>
</template>

<script>
export default {
  setup() {
    token = localStorage.getItem("jwt_token")
    if (token == null || token == undefined || token == "") {
      authorized = false
    } else {
      authorized = true
    }
    
  },

  data() {
    return {
      authorized: Boolean
    }
  }
}
</script>

<style scoped>
nav {
  display: flex;
  justify-content: right;
  align-items: center;
  padding: 20px;
}

ul {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
}

li {
  padding-left: 20px;
}

a {
  text-decoration: none;
  color: #fff;
}

a:hover {
  text-decoration: underline;
}

/* Hamburger button style */
.hamburger {
  display: none;
  font-size: 30px;
  background: none;
  border: none;
  color: #fff;
}

/* Mobile menu toggle */
ul.open {
  display: block;
}

@media (max-width: 768px) {
  .hamburger {
    display: block; /* Show hamburger icon on mobile */
  }

  ul {
    display: none; /* Hide menu by default on mobile */
    flex-direction: column; /* Stack the items vertically */
    width: 100%;
    background-color: #333; /* Optional: background color for the mobile menu */
  }

  ul.open {
    display: block; /* Show the menu when it's open */
  }

  li {

    text-align: center;
  }
}
</style>
