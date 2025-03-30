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
        "Authorization": "Bearer " + localStorage.getItem('jwt_token')
      }
    })
      .then(response => {
        this.available_for_me = response.data
        // console.log("available_for_me", this.available_for_me)

      })
      .catch(error => {
        console.error(error);
        this.$router.push({ path: '/sign-in' })

      });

      try{
      const message = this.$route.query.message;

      if (message) {
        this.notify(message);
      }
    }
    catch(error){
      console.log(error)
    }
  },

  data() {
    return {
      available_for_me: [],
      server_ip: ipconfig['backend_ip'],

    }
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('uk-UA'); // Преобразует дату в формат "17.11.2024"
    },
   removeOffering(offerId) {
      axios.get(this.server_ip + '/api/service/available', {
        headers: {
        "Authorization": "Bearer " + localStorage.getItem('jwt_token')
      }
      }).then(response => {
        console.log(response.data)
        if (response.data == null) {
          this.available_for_me = this.available_for_me.filter(item => item.id !== offerId); 

        }
      })
  },

    create_service() {
      this.$router.push({ path: '/service/create' })
    }

  }

};

</script>
<template>
  <div class="available">
    <Menu class="menu" />

    <h2>Доступні мені послуги:</h2>
    <div style="display: flex; justify-content: center; margin-bottom: 20px;">
      <button class="knopka_neion lusa-10" @click="create_service">Створити послугу</button>
    </div>


    <Offering v-for="item in available_for_me" :key="item.id" :offering="item" @delete-offering="removeOffering"/>


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
  margin-bottom: 20px;
  /* Расстояние между заголовком и контентом */
}
</style>
