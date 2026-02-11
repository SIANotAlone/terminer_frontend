<script setup>

import { RouterView } from 'vue-router';


</script>

<template>
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">

   
<div class="container">
  <div class="content">

          <RouterView />

  </div>
</div>
        
     
   

</template>

<style >


* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  text-decoration: none;
  border: none;
  outline: none;
}

/* Можно дополнительно сбросить специфичные элементы, например, для списков и ссылок */
ul, ol {
  list-style: none;
}

a {
  text-decoration: none;
}

.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Минимальная высота — 100% от высоты окна */
  background-color:rgb(1, 1, 28);
}

.content {
  flex-grow: 1; /* Это заставит контент занимать все доступное пространство */
}
</style>