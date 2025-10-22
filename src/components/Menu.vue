<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

// Логіка для відкриття/закриття меню на мобільних пристроях
const isMenuOpen = ref(false);
// Логіка для відкриття/закриття підменю "Послуги"
const isServicesDropdownOpen = ref(false);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
  // Закриваємо підменю, якщо закриваємо основне меню
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
    <button @click="toggleMenu" class="hamburger" aria-label="Toggle menu">
      &#9776; </button>
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
  </nav>
</template>

<script>
export default {
  // Логіка авторизації, перенесена для коректного виконання
  data() {
    return {
      authorized: false // Початкове значення
    }
  },
  mounted() {
    this.checkAuthorization();
  },
  methods: {
    checkAuthorization() {
      const token = localStorage.getItem("jwt_token");
      this.authorized = (token !== null && token !== undefined && token !== "");
    }
  }
}
</script>

<style scoped>
/* Стилі для прозорої навігаційної панелі */
nav {
  display: flex;
  justify-content: right;
  align-items: center;
  padding: 10px 20px;
  /* Прозорий фон з легким затемненням */
  background-color: rgba(0, 0, 0, 0.5); 
  position: fixed; /* Закріплюємо меню вгорі */
  top: 0;
  width: 100%;
  z-index: 1000; /* Гарантуємо, що меню буде над іншими елементами */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); /* Легка тінь */
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
  position: relative; /* Важливо для позиціонування випадаючого меню */
}

a {
  text-decoration: none;
  color: #fff; /* Білий текст */
  padding: 8px 12px;
  display: block;
  transition: color 0.3s ease;
}

a:hover,
.dropdown-toggle:hover {
  color: #ff9aff; 
  text-decoration: none;
}

/* Стилі для випадаючого меню (Dropdown) */
.dropdown-toggle {
  cursor: pointer;
  display: flex;
  align-items: center;
  /* Для коректного центрування в мобільному режимі */
  justify-content: center; 
  width: 100%; /* Гарантуємо, що посилання займе всю ширину li */
}

.dropdown-menu {
  display: none;
  position: absolute;
  /* Напівпрозорий фон підменю */
  background-color: rgba(30, 30, 30, 0.9); 
  list-style: none;
  padding: 10px 0;
  margin: 0;
  min-width: 180px;
  top: 100%; /* Розміщення під основним пунктом */
  left: 0;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  z-index: 10;
}

.dropdown.open .dropdown-menu {
  display: block; /* Показати підменю, коли відкрито */
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
  background-color: rgba(255, 255, 255, 0.1); /* Легкий ефект при наведенні */
  color: #ff9aff;
}

.arrow {
  margin-left: 5px;
  font-size: 10px;
  transition: transform 0.3s ease;
}

.dropdown.open .arrow {
  transform: rotate(180deg); /* Поворот стрілки, коли меню відкрито */
}

/* Гамбургер кнопка */
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
    justify-content: space-between;
  }
  
  .hamburger {
    display: block;
    order: 2; /* Розміщуємо гамбургер праворуч */
  }

  ul.menu-list {
    display: none; /* Приховуємо меню за замовчуванням */
    flex-direction: column;
    width: 100%;
    position: absolute;
    top: 60px; /* Відступ від nav */
    left: 0;
    /* Напівпрозорий фон для мобільного меню */
    background-color: rgba(0, 0, 0, 0.9); 
    padding: 10px 0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
  }

  ul.menu-list.open {
    display: flex; /* Показуємо меню, коли воно відкрите */
  }

  ul.menu-list > li {
    padding: 0;
    width: 100%;
    /* 👇 КЛЮЧОВЕ ВИПРАВЛЕННЯ: Центруємо текст (посилання) всередині li */
    text-align: center; 
  }
  
  .dropdown {
    width: 100%;
  }

  /* Для забезпечення центрування елементів в `dropdown-toggle` */
  .dropdown-toggle {
    display: flex;
    justify-content: center;
  }

  .dropdown-menu {
    position: static; /* Підменю відображається прямо під пунктом */
    width: 100%;
    background-color: rgba(30, 30, 30, 0.7); /* Більш прозорий фон для підменю */
    border-radius: 0;
    box-shadow: none;
  }
}
</style>