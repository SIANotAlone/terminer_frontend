<script setup>
  import Menu from '@/components/Menu.vue'

</script>

<template>

 <div class="full-screen-background">
 
    <Menu  class="menu"/>
  <div class="preview">
    <div class="content">
      <h1>Terminer</h1>
      <p>Обмінюйся послугами разом із нами</p>
     
    </div>
    
    
  </div>
</div>

</template>

<style scoped>
.preview {
  height: 100vh;
  background-image: url("../assets/office.jpg");
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  color: white; /* Текст за замовчуванням білий */
}

.content {
  text-align: center;
  background-color: rgba(0, 0, 0, 0.5); /* Напівпрозорий фон під текст */
  padding: 20px;
  border-radius: 10px;
  margin-left: 30%;
  margin: 30%;
}

h1 {
  font-size: 2rem;
  margin: 0;
}

p {
  font-size: 1.2rem;
}

/* Стилі для мобільних пристроїв */
@media (max-width: 768px) {
  .preview {
    height: 70vh; /* Менша висота на мобільних */
    background-position: top; /* Адаптація позиції зображення */
  }

  h1 {
    font-size: 1.5rem;
  }

  p {
    font-size: 1rem;
  }

  .content {
    padding: 10px;
  }
}

.full-screen-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("../assets/office.jpg");
  background-size: cover;
  display: flex;
  flex-direction: column;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}


.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #fff;
}


</style>