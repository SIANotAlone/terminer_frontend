<script>
    import axios from 'axios'
    import server_ip from "@/server_configs/config.js"

    export default {
  setup() {
    
    return {}
  },
  data(){
    return{
      
    }
    
  },
  methods: {
        registration(){
            let data = {
                "email" : document.getElementById('email').value,
                "first_name" : document.getElementById('first_name').value,
                "last_name" : document.getElementById('last_name').value,
                "country" : document.getElementById('country').value,
                "password" : document.getElementById('password').value,
                "date_of_birth" : document.getElementById('date').value
            }
            axios.post(server_ip.backend_ip + "/auth/sign-up",data).then(response => {
                console.log(response.data)
                console.log("success")
            })
        }
  }
}
</script>
<template>
<div>
    
    <h1 align="center">Реєстрація</h1>
    <div class="editors">
    <div class="form__group field">
      <input type="input" class="form__field" placeholder="E-Mail" name="name" id='email' required value=""/>
      <label for="name" class="form__label">E-Mail</label>
    </div>
    <div class="form__group field">
      <input type="input" class="form__field" placeholder="First Name" name="name" id='first_name' required value=""/>
      <label for="name" class="form__label">Імʼя</label>
    </div>
    <div class="form__group field">
      <input type="input" class="form__field" placeholder="Last Name" name="name" id='last_name' required value=""/>
      <label for="name" class="form__label">Прізвище</label>
    </div>
    <label for="">Країна:</label>
    <select name="" id="country" class="country">
        <option value="Deutschland">Німеччина</option>
        <option value="Ukraine">Україна</option>
        <option value="Poland">Польща</option>
        <option value="United Kingdome">Великобританія</option>
        <option value="Japan">Японія</option>
        <option value="Czech Republic">Чехія</option>
        <option value="Austria">Австрія</option>
        <option value="France">Франція</option>
        <option value="Netherlands">Нідерланди</option>
        <option value="Belgium">Бельгія</option>
        <option value="Italy">Італія</option>
    </select>
    <div>
        <input type="date" class="date" id="date">
    </div>
    <div class="form__group field">
      <input type="password" class="form__field" placeholder="Пароль" name="name" id='password' required />
      <label for="name" class="form__label">Пароль</label>
    </div>
    <div class="container">
        <button  class="knopka_neion lusa-10" @click="registration">Зареєструватись</button> 
    </div>
    

  </div>
</div>
</template>

<style scoped>  
.container{
    display: flex;
    justify-content: center;
    align-items: center;

    margin-right: 50%;
}
 .form__group {
  position: relative;
  padding: 15px 0 0;
  margin-top: 10px;
  width: 50%;

}

.form__field {
  font-family: inherit;
  width: 100%;
  border: 0;
  border-bottom: 2px solid #9b9b9b;
  outline: 0;
  font-size: 1.3rem;
  color: #fff;
  padding: 7px 0;
  background: transparent;
  text-align: center;
  transition: border-color 0.2s;

  &::placeholder {
    color: transparent;
  }

  &:placeholder-shown~.form__label {
    font-size: 1.3rem;
    cursor: text;
    top: 20px;

  }
}

.form__label {
  position: absolute;
  top: 0;
  display: block;
  transition: 0.2s;
  font-size: 1rem;
  color: #9b9b9b;


}

.form__field:focus {
  ~.form__label {
    position: absolute;
    top: 0;
    display: block;
    transition: 0.2s;
    font-size: 1rem;
    color: #5dbdff;
    font-weight: 700;


  }
  

  padding-bottom: 6px;
  font-weight: 700;
  border-width: 3px;
  border-image: linear-gradient(to right, #ff24ed, #557ff7);
  border-image-slice: 1;
}

/* reset input */
.form__field {

  &:required,
  &:invalid {
    box-shadow: none;
  }
}

/* demo */
body {
  font-family: 'Poppins', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.5rem;
  background-color: #222222;
}

.editors {
  margin-left: 30%;

}


/* 10 */
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


.osnovanua {
  width: 90%;
  margin: 40px auto;
  text-align: center;
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

select {
  /* Reset */
  appearance: none;
  border: 0;
  outline: 0;
  font: inherit;
  /* Personalize */
  width: 20rem;
  padding: 1rem 4rem 1rem 1rem;
  background: var(--arrow-icon) no-repeat right 0.8em center / 1.4em,
    linear-gradient(to left, var(--arrow-bg) 3em, var(--select-bg) 3em);
  color: white;
  border-radius: 0.25em;
  box-shadow: 0 0 1em 0 rgba(0, 0, 0, 0.2);
  cursor: pointer;
  /* Remove IE arrow */
  &::-ms-expand {
    display: none;
  }
  /* Remove focus outline */
  &:focus {
    outline: none;
  }
  /* <option> colors */
  option {
    color: inherit;
    background-color: var(--option-bg);
  }
}
 
</style>