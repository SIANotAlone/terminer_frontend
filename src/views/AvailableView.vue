<script>
import Offering from "@/components/Offering.vue";
import OfferingHistory from "@/components/OfferingHistory.vue";
import OfferingActual from "@/components/OfferingActual.vue";

import axios from 'axios';
import Menu from '@/components/Menu.vue'

import ipconfig from "@/server_configs/config.js"

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {

  components: {
    Offering,
    OfferingHistory,
    OfferingActual,
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

    try {
      const message = this.$route.query.message;

      if (message) {
        this.notify(message);
      }
    }
    catch (error) {
      console.log(error)
    }
  },

  data() {
    return {
      available_for_me: [],
      server_ip: ipconfig['backend_ip'],
      regime: 1,
      my_actual: [],
      my_history: {},
      offset: 0


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
    },
    next_page() {
      if (this.my_history.total - 20 > this.offset) {
        this.offset += 20
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        this.get_history_with_offset()
      }
    },
    previous_page() {
      if (this.offset > 0) {
        this.offset = this.offset - 20
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        this.get_history_with_offset()
      }
    },
    get_history_with_offset() {
      axios.post(this.server_ip + '/api/service/getmyhistory', {
        "limit": 20,
        offset: this.offset
      }, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem('jwt_token')
        }
      })
        .then(response => {
          this.my_history = response.data


        })
        .catch(error => {
          console.error(error);
          this.$router.push({ path: '/sign-in' })

        });
    },
    change_regime() {
      if (this.regime == 1) {
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

      } else if (this.regime == 3) {
        axios.get(this.server_ip + '/api/service/getmyactualservices', {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem('jwt_token')
          }
        })
          .then(response => {
            this.my_actual = response.data

          })
          .catch(error => {
            console.error(error);
            this.$router.push({ path: '/sign-in' })

          });
      } else if (this.regime == 2) {
        axios.post(this.server_ip + '/api/service/getmyhistory', {
          "limit": 20,
          offset: 0
        }, {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem('jwt_token')
          }
        })
          .then(response => {
            this.my_history = response.data


          })
          .catch(error => {
            console.error(error);
            this.$router.push({ path: '/sign-in' })

          });
      }
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

    <div style="margin-left: 20%; margin-right: 20%; display: flex; justify-content: center;">
      <select v-model="regime" @change="change_regime">
        <option value=1>Доступні мені (актуальні)</option>
        <option value=2>Історія (мої послуги)</option>
        <option value=3>Мої послуги (актальні)</option>
      </select>

    </div>
    <div v-if="regime == 1">
      <Offering v-for="item in available_for_me" :key="item.id" :offering="item" @delete-offering="removeOffering" />
    </div>
    <div v-if="regime == 2">
      <br>
      <h2>Всього створено послуг: {{ my_history['total'] }}</h2>
      <div style="display: flex; justify-content: center;">
        <button class="knopka_neion lusa-10" @click="previous_page">Назад</button>
        <button class="knopka_neion lusa-10" @click="next_page">Вперед</button>

      </div>
      <OfferingHistory v-for="item in my_history['history']" :key="item.id" :offering="item" />
      <div style="display: flex; justify-content: center;">
        <button class="knopka_neion lusa-10" @click="previous_page">Назад</button>
        <button class="knopka_neion lusa-10" @click="next_page">Вперед</button>

      </div>
    </div>
    <div v-if="regime == 3">
      <OfferingActual v-for="item in my_actual" :key="item.id" :offering="item" />
    </div>



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

button {
  margin: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.knopka_neion {
  color: #fff;
  width: 250px;
  height: 45px;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}
.lusa-10 {
    border: 1px solid #ff9aff;
    box-shadow: 0 0 5px #ff9aff, 0 0 5px #ff9aff inset;
    color: #ff9aff;
    background: #000;
    z-index: 2;
    transition: all 0.3s ease;
    overflow: hidden;
}

.lusa-10:after {
    position: absolute;
    content: " ";
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background: #ff9aff;
    transition: all 0.3s ease;
    -webkit-transform: scale(0);
    transform: scale(0);
}

.lusa-10:hover {
    color: #fff;
}

.lusa-10:hover:after {
    -webkit-transform: scale(1);
    transform: scale(1);
}

</style>
