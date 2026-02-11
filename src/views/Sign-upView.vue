<template>
  <div class="page-wrapper">
    <div class="auth-container">
      <div class="auth-card">
        <h1 class="title">Реєстрація</h1>

        <form @submit.prevent="registration" class="form-content">
          <div class="form__group field">
            <input type="email" class="form__field" placeholder="E-Mail" v-model="regData.email" required />
            <label class="form__label">E-Mail</label>
          </div>

          <div class="row">
            <div class="form__group field">
              <input type="text" class="form__field" placeholder="Імʼя" v-model="regData.first_name" required />
              <label class="form__label">Імʼя</label>
            </div>
            <div class="form__group field">
              <input type="text" class="form__field" placeholder="Прізвище" v-model="regData.last_name" required />
              <label class="form__label">Прізвище</label>
            </div>
          </div>

          <div class="row controls">
            <div class="control-item">
              <label class="input-hint">Країна</label>
              <select v-model="regData.country" class="custom-select">
                <option value="Ukraine">Україна</option>
                <option value="Deutschland">Німеччина</option>
                <option value="Poland">Польща</option>
              </select>
            </div>
            <div class="control-item">
              <label class="input-hint">Дата народження</label>
              <input type="date" class="custom-date" v-model="regData.date_of_birth" required />
            </div>
          </div>

          <div class="form__group field">
            <input type="password" class="form__field" placeholder="Пароль" v-model="regData.password" required />
            <label class="form__label">Пароль</label>
          </div>
          
          <div class="form__group field">
            <input type="password" class="form__field" placeholder="Повторіть пароль" v-model="confirmPassword" required />
            <label class="form__label">Підтвердження</label>
          </div>

          <div class="btn_container">
            <button type="submit" class="submit-btn" :disabled="!isPasswordMatch">
              <span>Створити аккаунт</span>
            </button>
            <p v-if="regData.password && !isPasswordMatch" class="error-text">Паролі не співпадають</p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import server_ip from "@/server_configs/config.js"

export default {
  data() {
    return {
      regData: {
        email: '',
        first_name: '',
        last_name: '',
        country: 'Ukraine',
        password: '',
        date_of_birth: ''
      },
      confirmPassword: ''
    }
  },
  computed: {
    isPasswordMatch() {
      return this.regData.password === this.confirmPassword;
    }
  },
  methods: {
    async registration() {
      if (!this.isPasswordMatch) return;
      
      try {
        const response = await axios.post(`${server_ip.backend_ip}/auth/sign-up`, this.regData);
        this.$router.push('/login');
      } catch (error) {
        alert("Помилка при реєстрації");
      }
    }
  }
}
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: radial-gradient(circle at top, #24243e, #0f0c29);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.auth-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 28px;
  padding: 50px 40px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.title {
  color: white;
  font-size: 32px;
  text-align: center;
  margin-bottom: 40px;
  font-weight: 700;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.row {
  display: flex;
  gap: 20px;
}

/* Фикс позиционирования лейблов */
.form__group {
  position: relative;
  width: 100%;
}

.form__field {
  width: 100%;
  border: 0;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  outline: 0;
  font-size: 16px;
  color: #fff;
  padding: 8px 0;
  background: transparent;
  transition: 0.3s;
}

.form__field::placeholder { color: transparent; }

.form__label {
  position: absolute;
  top: 8px;
  left: 0; /* Важно: прижимаем к левому краю внутри контейнера */
  font-size: 16px;
  color: rgba(255, 255, 255, 0.5);
  transition: 0.3s;
  pointer-events: none;
}

.form__field:focus ~ .form__label,
.form__field:not(:placeholder-shown) ~ .form__label {
  top: -14px;
  font-size: 12px;
  color: #c084fc; /* Светло-пурпурный */
  font-weight: 600;
}

.form__field:focus {
  border-bottom: 2px solid #5dbdff;
}

/* Селекты и даты */
.input-hint {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 6px;
  display: block;
}

.custom-select, .custom-date {
  width: 100%;
  height: 40px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: white;
  padding: 0 10px;
}

/* Кнопка */
.submit-btn {
  width: 100%;
  height: 50px;
  background: linear-gradient(90deg, #d8b4fe, #60a5fa);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 10px;
}

.submit-btn:hover:not(:disabled) {
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.4);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.error-text {
  color: #fb7185;
  font-size: 12px;
  text-align: center;
  margin-top: 8px;
}

@media (max-width: 480px) {
  .row { flex-direction: column; }
}
</style>