<template>
  <div class="about">
    <Menu />
    <div class="wrapper">
      <div class="content">
        <div class="text-block">
          <h1 class="title">Terminer — простір для взаємодії та співпраці</h1>
          <p class="text">
            Terminer — це платформа, яка об'єднує людей для обміну послугами. Ми створили місце,
            де кожен може знайти потрібну допомогу, поділитися своїми навичками та стати частиною
            спільноти, заснованої на взаємній підтримці. Наш сервіс допомагає легко знаходити
            партнерів для обміну послугами, відкривати нові можливості та заощаджувати час.
            Незалежно від того, чи ви шукаєте спеціаліста чи готові поділитися своїми талантами,
            Terminer створений, щоб зробити взаємодію зручною та вигідною. Приєднуйтесь до нас,
            щоб розвиватися разом!
          </p>
          <button class="knopka_neion lusa-10" @click="registration">Приєднатися</button>
        </div>
        <div class="image-block">
          <img src="@/assets/termin.png" alt="Terminer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from '@/components/Menu.vue';
export default {
  name: 'AboutPage',
  components: { Menu },
  methods: {
    registration() {
      this.$router.push({ path: '/sign-up' });
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Courgette&family=Lobster&family=Roboto:wght@300;400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@300;400;600&display=swap');

.about {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  min-height: 100vh;
  color: #e0e0e0;
}

.wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
}

.content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
}

.text-block {
  flex: 1;
}

.title {
  font-family: 'Lobster', cursive;
  font-size: 3rem;
  margin-bottom: 24px;
  color: #ff9aff;
}

.text {
  font-family: 'Source Serif 4', serif;
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 32px;
}

.image-block img {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  /* теней убрано */
}

@media (max-width: 480px) {
  .image-block img {
    max-width: 100px;
    height: auto;
  }
}

.knopka_neion.lusa-10 {
  display: inline-block;
  padding: 14px 32px;
  font-size: 1rem;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  border: 2px solid #ff9aff;
  border-radius: 24px;
  background: transparent;
  color: #ff9aff;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
}

.knopka_neion.lusa-10:hover {
  background: #ff9aff;
  color: #16213e;
}

@media (max-width: 992px) {
  .image-block img {
    max-width: 200px;
    height: auto;
  }
  .content {
    flex-direction: column-reverse;
    text-align: center;
  }
  .text-block {
    margin-top: 40px;
  }
  .title {
    font-size: 2.5rem;
  }
  .text {
    font-size: 1rem;
  }
}

@media (max-width: 992px) {
  .content {
    flex-direction: column-reverse;
    text-align: center;
  }
  .text-block {
    margin-top: 40px;
  }
  .title {
    font-size: 2.5rem;
  }
  .text {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .wrapper {
    padding: 40px 10px;
  }
  .title {
    font-size: 2rem;
    margin-bottom: 16px;
  }
  .text {
    font-size: 0.9rem;
    margin-bottom: 24px;
  }
  .image-block img {
    max-width: 150px;
    height: auto;
  }
  .knopka_neion.lusa-10 {
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
    padding: 12px 0;
  }
}
</style>