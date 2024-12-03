<script>
import Offering from "@/components/Offering.vue";

import axios from 'axios';
import Menu from '@/components/Menu.vue'

import ipconfig from "@/server_configs/config.js"

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';  

export default {
  
  components: {
    Offering,
    Menu
  
  },
  
  name: 'MyComponent',

  setup() {
    const theme = 'dark';
    const notify = (message) => {
            toast.success(message, {
                autoClose: 2000,
                theme,
            }); // ToastOptions

        }
        return { notify }
  },
  mounted() {

    // Пример GET-запроса
    axios.get(this.server_ip + '/api/service/available', {
        headers: {
            "Authorization": "Bearer "+ localStorage.getItem('jwt_token')
        }
    })
      .then(response => {
        this.available_for_me = response.data
        console.log("available_for_me", this.available_for_me)

      })
      .catch(error => {
        console.error(error);
      });
  },
  
  data() {
    return {
        available_for_me : [],
        server_ip: ipconfig['backend_ip'],
        
    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('uk-UA'); // Преобразует дату в формат "17.11.2024"
    }
  }

};

</script>
<template>
  <div class="available">
    <Menu  class="menu"/>
  
      <h2>Доступні мені послуги:</h2>
      
      
      <Offering v-for="item in available_for_me" :key="item.id" :offering="item" />


</div>
</template>

<style scoped>

.available {

  display: inline;
  flex-direction: column;

}

h2 {
  display: flex;
  justify-content: center;
  color: aliceblue;
  margin-bottom: 20px; /* Расстояние между заголовком и контентом */
}




</style>
