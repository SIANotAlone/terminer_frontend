<template>
  <div class="page-wrapper">
    <Menu class="menu" />

    <div class="auth-container">
      <div class="auth-card">
        <h1 class="title">Авторизація</h1>

        <form @submit.prevent="get_token" class="form-content">
          <div class="form__group field">
            <input 
              type="email" 
              class="form__field" 
              placeholder="E-Mail" 
              v-model="authData.email"
              required 
            />
            <label class="form__label">E-Mail</label>
          </div>

          <div class="form__group field">
            <input 
              type="password" 
              class="form__field" 
              placeholder="Пароль" 
              v-model="authData.password"
              required 
            />
            <label class="form__label">Пароль</label>
          </div>

          <div class="btn_container">
            <button type="submit" class="submit-btn">
              <span>Увійти</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import server_ip from "@/server_configs/config.js"
import Menu from '@/components/Menu.vue'

export default {
  components: { Menu },
  data() {
    return {
      authData: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async get_token() {
      const { email, password } = this.authData;
      
      // Базовая валидация
      if (email.length < 6 || password.length < 6) {
        alert("Дані надто короткі");
        return;
      }

      try {
        const response = await axios.post(`${server_ip.backend_ip}/auth/sign-in`, this.authData);
        const token = response.data.token;
        localStorage.setItem('jwt_token', token);
        this.$router.push({ path: '/' });
      } catch (error) {
        console.error("Login error:", error);
        alert("Помилка авторизації");
      }
    }
  }
}
</script>

<style scoped>
/* Центрування всієї сторінки */
.page-wrapper {
  min-height: 100vh;
  background: #0f0c29; /* Глибокий темний фон */
  background: linear-gradient(to bottom, #24243e, #302b63, #0f0c29);
  display: flex;
  flex-direction: column;
}

.auth-container {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

/* Картка з ефектом скла */
.auth-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.title {
  margin-bottom: 30px;
  color: #fff;
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  letter-spacing: 1px;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* Поля вводу */
.form__group {
  position: relative;
  padding: 15px 0 0;
  width: 100%;
}

.form__field {
  font-family: inherit;
  width: 100%;
  border: 0;
  border-bottom: 2px solid #555;
  outline: 0;
  font-size: 16px;
  color: #fff;
  padding: 7px 0;
  background: transparent;
  transition: border-color 0.3s;
}

.form__field::placeholder {
  color: transparent;
}

.form__label {
  position: absolute;
  top: 0;
  display: block;
  transition: 0.3s;
  font-size: 16px;
  color: #aaa;
  pointer-events: none;
}

.form__field:focus ~ .form__label,
.form__field:not(:placeholder-shown) ~ .form__label {
  position: absolute;
  top: -12px;
  display: block;
  font-size: 12px;
  color: #00d2ff;
  font-weight: 700;
}

.form__field:focus {
  padding-bottom: 6px;
  font-weight: 700;
  border-width: 3px;
  border-image: linear-gradient(to right, #00d2ff, #3a7bd5);
  border-image-slice: 1;
}

/* Кнопка */
.btn_container {
  margin-top: 20px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(45deg, #00d2ff, #3a7bd5);
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 15px rgba(0, 210, 255, 0.3);
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 210, 255, 0.5);
}

.submit-btn:active {
  transform: translateY(0);
}

/* Адаптивність */
@media (max-width: 480px) {
  .auth-card {
    padding: 30px 20px;
  }
}
</style>