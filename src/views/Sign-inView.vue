<template>
  <Menu  class="menu"/>
<div class="auth">
  
    <h1 align="center" class="title">Авторизація</h1>
    <div class="editors">
    <div class="form__group field">
      <input type="input" class="form__field" placeholder="E-Mail" name="name" id='email' required value=""/>
      <label for="name" class="form__label">E-Mail</label>
    </div>
    <div class="form__group field">
      <input type="password" class="form__field" placeholder="Пароль" name="name" id='password' required />
      <label for="name" class="form__label">Пароль</label>
    </div>
        <div class = btn_container> 

          <button  class="knopka_neion lusa-10" @click="get_token">Авторизуватися</button> 
        </div>
        

  

  </div>
</div>
</template>


<script>
    import axios from 'axios'
    import server_ip from "@/server_configs/config.js"

  import Menu from '@/components/Menu.vue'




    export default {
  setup() {
    
    return {}
  },
  components: {
    Menu
  },
  data(){
    return{
      
    }
    
  },
  methods: {
    get_token(){
        let auth = {
            "email": document.getElementById('email').value,
            "password": document.getElementById('password').value
        }
        if (auth.email == "" || auth.password == "" || auth.email.legngs <6 || auth.password.length < 6){ 
            console.log("error")
        } else {
            axios
            .post(server_ip.backend_ip + "/auth/sign-in",auth)
            .then(response => {
                // localStorage.setItem('token', response.data.access)
                console.log(response.data)
                let token = response.data['token']
                localStorage.setItem('jwt_token', token);
                // console.log(localStorage.getItem('jwt_token'))
                this.$router.push({ path: '/'})

            })
        }
    
    }
  }
}
</script>


<style scoped>  
.title{
  margin-top: 20px;
margin-bottom: 20px;
color: aliceblue;
font-size: 24px;
}
  .btn_container{
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

.auth{
  margin-left: 30%;
  margin-right: 30%;
}

/* Выровняйте редакторы */
.editors {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Стили для группы ввода */
.form__group {
  position: relative;
  width: 100%;
}

.form__field {
  font-family: inherit;
  width: 100%;
  border: 0;
  border-bottom: 2px solid #9b9b9b;
  outline: 0;
  font-size: 1.1rem;
  color: #fff;
  padding: 10px 0;
  background: transparent;
  text-align: center;
  transition: border-color 0.2s;
}

.form__field::placeholder {
  color: transparent;
}

.form__label {
  position: absolute;
  top: 10px;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 1rem;
  color: #9b9b9b;
  transition: all 0.3s ease-in-out;
}

.form__field:focus,
.form__field:not(:placeholder-shown) {
  border-bottom: 2px solid #5dbdff;
}

.form__field:focus + .form__label,
.form__field:not(:placeholder-shown) + .form__label {
  color: #5dbdff;
  font-size: 0.9rem;
  top: -10px;
}



/* Стили кнопки */
.knopka_neion {
  color: #fff;
  width: 200px;
  height: 45px;
  font-family: 'Lato', sans-serif;
  font-weight: 500;
  background: transparent;
  cursor: pointer;
  border: 1px solid #ff9aff;
  box-shadow: 0 0 5px #ff9aff, 0 0 5px #ff9aff inset;
  transition: all 0.3s ease;
  text-align: center;
}

.knopka_neion:hover {
  background: #ff9aff;
  color: #000;
}

@media (max-width: 768px) {
  .auth {
    width: 90%;
    padding: 15px;
    margin: auto; /* Центрування */
  }

  .form__field {
    font-size: 1rem;
    padding: 8px 0; /* Зменшення відступів */
  }

  .knopka_neion {
    width: 100%;
    height: 50px;
  }

  .btn_container {
    margin-top: 15px;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 1.2rem; /* Зменшення розміру заголовка */
  }

  .form__field {
    font-size: 0.9rem;
    padding: 6px 0; /* Оптимізація для маленьких екранів */
  }

  .knopka_neion {
    width: 100%;
    height: 45px;
    font-size: 0.9rem; /* Менший шрифт для кнопок */
  }

  .editors {
    gap: 15px; /* Зменшення проміжку між полями */
  }

  .auth {
    padding: 10px; /* Менший внутрішній відступ */
  }
}


</style>
