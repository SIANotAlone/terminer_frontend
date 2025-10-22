<template>
  <div class="available-page" style="margin-top: 35px;">
    <Menu />
    <div class="container">
      <h2>Доступні мені послуги</h2>
      <div class="actions">
        <button class="btn-create" @click="create_service">Створити послугу</button>
      </div>
      <div class="tabs">
        <button
          :class="['tab', regime === 1 ? 'active' : '']"
          @click="regime = 1; change_regime()"
        >Актуальні</button>
        <button
          :class="['tab', regime === 3 ? 'active' : '']"
          @click="regime = 3; change_regime()"
        >Мої послуги</button>
        <button
          :class="['tab', regime === 2 ? 'active' : '']"
          @click="regime = 2; change_regime()"
        >Історія</button>
      </div>
      <div class="tab-content">
        <div v-if="regime === 1">
          <Offering
            v-for="item in available_for_me"
            :key="item.id"
            :offering="item"
            @delete-offering="removeOffering"
          />
        </div>
        <div v-if="regime === 3">
          <OfferingActual
            v-for="item in my_actual"
            :key="item.id"
            :offering="item"
          />
        </div>
        <div v-if="regime === 2">
          <h3 align="center">Всього створено послуг: {{ my_history.total }}</h3>
          <div class="pager">
            <button class="btn" @click="previous_page">Назад</button>
            <button class="btn" @click="next_page">Вперед</button>
          </div>
          <OfferingHistory
            v-for="item in my_history.history"
            :key="item.id"
            :offering="item"
          />
          <div class="pager">
            <button class="btn" @click="previous_page">Назад</button>
            <button class="btn" @click="next_page">Вперед</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Offering from '@/components/Offering.vue';
import OfferingHistory from '@/components/OfferingHistory.vue';
import OfferingActual from '@/components/OfferingActual.vue';
import Menu from '@/components/Menu.vue';
import axios from 'axios';
import ipconfig from '@/server_configs/config.js';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
  name: 'AvailablePage',
  components: { Offering, OfferingHistory, OfferingActual, Menu },
  setup() {
    const theme = 'dark';
    const notify = (message) => {
      toast.success(message, { autoClose: 2000, theme });
    };
    return { notify };
  },
  data() {
    return {
      available_for_me: [],
      my_actual: [],
      my_history: {},
      regime: 1,
      offset: 0,
      server_ip: ipconfig.backend_ip,
    };
  },
  mounted() {
    this.change_regime();
    const msg = this.$route.query.message;
    if (msg) this.notify(msg);
  },
  methods: {
    change_regime() {
      const token = localStorage.getItem('jwt_token');
      const headers = { Authorization: `Bearer ${token}` };
      if (this.regime === 1) {
        axios.get(`${this.server_ip}/api/service/available`, { headers })
          .then(res => (this.available_for_me = res.data))
          .catch(() => this.$router.push('/sign-in'));
      } else if (this.regime === 3) {
        axios.get(`${this.server_ip}/api/service/getmyactualservices`, { headers })
          .then(res => (this.my_actual = res.data))
          .catch(() => this.$router.push('/sign-in'));
      } else if (this.regime === 2) {
        this.get_history_with_offset();
      }
    },
    get_history_with_offset() {
      const token = localStorage.getItem('jwt_token');
      axios.post(
        `${this.server_ip}/api/service/getmyhistory`,
        { limit: 20, offset: this.offset },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(res => (this.my_history = res.data))
      .catch(() => this.$router.push('/sign-in'));
    },
    next_page() {
      if (this.my_history.total - 20 > this.offset) {
        this.offset += 20;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.get_history_with_offset();
      }
    },
    previous_page() {
      if (this.offset > 0) {
        this.offset -= 20;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.get_history_with_offset();
      }
    },
    create_service() {
      this.$router.push('/service/create');
    },
    removeOffering(id) {
      this.available_for_me = this.available_for_me.filter(item => item.id !== id);
    },
  },
};
</script>

<style scoped>
.available-page {
  /* фон убран */
  background: none;
  min-height: 100vh;
  color: #e0e0e0;
}
.container {
  max-width: 1200px;
  margin: auto;
  padding: 40px 20px;
}
h2 {
  text-align: center;
  margin-bottom: 20px;
}
.actions {
  text-align: center;
  margin-bottom: 20px;
}
.btn-create {
  background: transparent;
  border: 2px solid #ff9aff;
  color: #ff9aff;
  padding: 10px 20px;
  /* скругление по умолчанию */
  border-radius: 0;
  cursor: pointer;
  transition: background 0.3s;
}
.btn-create:hover {
  background: #ff9aff;
  color: #0d0d0d;
}
.tabs {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
}
.tab {
  padding: 10px 20px;
  background: #1a1a2e;
  border: 1px solid #ff9aff;
  border-radius: 8px;
  color: #ff9aff;
  cursor: pointer;
  transition: background 0.3s;
}
.tab.active {
  background: #ff9aff;
  color: #0d0d0d;
}
.tab:hover {
  background: #ff9aff33;
}
.tab-content {
  margin-top: 20px;
}
.pager {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
}
.btn {
  background: transparent;
  border: 2px solid #ff9aff;
  color: #ff9aff;
  padding: 8px 16px;
  /* скругление по умолчанию */
  border-radius: 0;
  cursor: pointer;
  transition: background 0.3s;
}
.btn:hover {
  background: #ff9aff;
  color: #0d0d0d;
}
@media (max-width: 768px) {
  .container {
    padding: 20px 10px;
  }
  h2 {
    font-size: 1.5rem;
    margin-bottom: 16px;
  }
  .actions {
    margin-bottom: 16px;
  }
  .btn-create {
    width: 100%;
    max-width: none;
    padding: 12px 0;
    font-size: 1rem;
  }
  .tabs {
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
  }
  .tab {
    width: 100%;
    text-align: center;
    padding: 12px 0;
    font-size: 0.9rem;
  }
  .tab-content {
    padding: 0;
  }
  .pager {
    flex-direction: column;
    gap: 8px;
  }
  .btn {
    width: 100%;
    max-width: none;
    padding: 10px 0;
    font-size: 0.9rem;
  }
}

</style>