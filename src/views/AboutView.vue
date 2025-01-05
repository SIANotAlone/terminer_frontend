<template>

    <Menu  class="menu"/>
    <div class="about"> 
      <div class="wrapper">
        <div class="twolines">
          <div class="line1">
            <h1 class="title">Terminer — простір для взаємодії та співпраці</h1>
        <p class="text">Terminer — це платформа, яка об'єднує людей для обміну послугами. Ми створили місце, де кожен може знайти потрібну допомогу, поділитися своїми навичками та стати частиною спільноти, заснованої на взаємній підтримці.
Наш сервіс допомагає вам легко знаходити партнерів для обміну послугами, відкривати нові можливості та заощаджувати час. Незалежно від того, чи ви шукаєте спеціаліста або самі готові поділитися своїми талантами, Terminer створений для того, щоб зробити взаємодію зручною та вигідною.
Приєднуйтесь до Terminer, щоб розвиватися разом! </p>
          </div>
          <div class="line2">
              <img src="../assets/termin.png" alt="" style="max-height: 350px;">
          </div>
        </div>
       

      </div>
      
    </div>
    

</template>

<script>
        import Menu from '@/components/Menu.vue';

export default {
  components: {
    Menu
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Courgette&family=Lobster&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Courgette&family=Lobster&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap');
.about {
  display: flex;
  justify-content: center;
  

}
.title {
  font-family: "Lobster", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 24px;
  display: flex;
  justify-content: center;
}
.text
{
  font-family: "Source Serif 4", serif;
  font-optical-sizing: auto;
  font-style: normal;
  text-align: justify;
  display: flex;
  align-items: center;
  height: 300px;
 
}
.wrapper {
  display: inline;
 margin-right: 20%;
 margin-left: 20%;
}
.twolines{
  display: flex;
}




@media only screen and (max-width: 768px) {
  .about {
    flex-direction: column;
    padding: 10px;
    align-items: center;
  }
  
  .title {
    font-size: 20px;
    text-align: center;
    margin-bottom: 10px;
  }
  
  .text {
    font-size: 14px;
    line-height: 1.5;
    height: auto;
    padding: 0 10px;
    text-align: justify;
  }

  .wrapper {
    margin: 0 5%;
    padding: 10px;
  }

  .twolines {
    flex-direction: column;
    align-items: center;
  }

  .line1, .line2 {
    width: 100%;
    margin-bottom: 20px;
  }

  .line2 img {
    max-width: 100%;
    height: auto;
  }
}
</style>
