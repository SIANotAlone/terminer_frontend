<template>
  <Menu />
  <div class="termins-page" style="margin-top: 35px;">
    <div class="container">
      <h2>Терміни, які потребують вашої уваги</h2>
      <div class="tabs">
        <button
          :class="['tab', selected_regime === '1' ? 'active' : '']"
          @click="selectRegime('1')"
        >Мої терміни</button>
        <button
          :class="['tab', selected_regime === '2' ? 'active' : '']"
          @click="selectRegime('2')"
        >До мене, як виконавця</button>
      </div>

      <div class="tab-content">
        <div
          v-if="(selected_regime == '1' && my_termins.length === 0) ||
                 (selected_regime == '2' && performer_termins.length === 0)"
        >
          <p class="centered-paragraph">
            Поки немає термінів, які потребують вашої уваги.
          </p>
        </div>

        <div v-if="selected_regime == '1'">
          <MyReaction
            :my_termins="my_termins"
            :server_ip="server_ip"
            @confirm="confirmUserTermin"
            @notify="handleNotify"
          />
        </div>

        <div v-if="selected_regime == '2'">
          <PerformerReaction
            :performer_termins="performer_termins"
            :server_ip="server_ip"
            @confirm="confirmPerformerTermin"
            @notify="handleNotify"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Menu from "@/components/Menu.vue";
import MyReaction from "@/components/MyReaction.vue";
import PerformerReaction from "@/components/PerformerReaction.vue";
import ipconfig from "@/server_configs/config.js";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

export default {
  name: "TerminsPage",
  components: { Menu, MyReaction, PerformerReaction },
  mounted() {
    this.fetchMyTermins();
    this.fetchPerformerTermins();
  },
  data() {
    return {
      server_ip: ipconfig.backend_ip,
      my_termins: [],
      performer_termins: [],
      selected_regime: "1",
    };
  },
  methods: {
    fetchMyTermins() {
      axios
        .get(`${this.server_ip}/api/termin/getallusertermins`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` },
        })
        .then(res => (this.my_termins = res.data || []))
        .catch(() => this.$router.push("/sign-in"));
    },
    fetchPerformerTermins() {
      axios
        .get(`${this.server_ip}/api/termin/getallperformertermins`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` },
        })
        .then(res => (this.performer_termins = res.data || []))
        .catch(() => this.$router.push("/sign-in"));
    },
    selectRegime(regime) {
      this.selected_regime = regime;
      regime === "1" ? this.fetchMyTermins() : this.fetchPerformerTermins();
    },
    confirmUserTermin(id) {
      axios
        .post(`${this.server_ip}/api/record/confirm`, { id }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` },
        })
        .then(() => {
          this.my_termins = this.my_termins.filter(item => item.record_id !== id);
          this.handleNotify({ message: "Підтверджено", id });
        });
    },
    confirmPerformerTermin(id) {
      axios
        .post(`${this.server_ip}/api/record/done`, { id }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("jwt_token")}` },
        })
        .then(() => {
          this.performer_termins = this.performer_termins.filter(item => item.record_id !== id);
          this.handleNotify({ message: "Виконано", id });
        });
    },
    handleNotify({ message, id }) {
      toast.success(message, { autoClose: 2000, theme: "dark" });
      if (this.selected_regime === "1") {
        this.my_termins = this.my_termins.filter(item => item.record_id !== id);
      } else {
        this.performer_termins = this.performer_termins.filter(item => item.record_id !== id);
      }
    }
  }
};
</script>

<style scoped>
.termins-page {
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
.centered-paragraph {
  text-align: center;
  margin: 20px 0;
}
@media (max-width: 768px) {
  .container {
    padding: 20px 10px;
  }
  h2 {
    font-size: 1.5rem;
    margin-bottom: 16px;
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
}
</style>
