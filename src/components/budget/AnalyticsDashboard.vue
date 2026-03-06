<template>
  <div class="analytics-container">
    <div v-if="isLoading" class="loading-state">
      <p>⏳ Завантаження даних...</p>
    </div>

    <div v-else class="charts-grid">
      <div class="chart-card">
        <div class="chart-info">
          <h4>📊 Структура витрат</h4>
          <span>Розподіл по категоріях</span>
        </div>
        <div class="chart-body">
          <div ref="donutChart"></div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-info">
          <h4>⚔️ План vs Факт</h4>
          <span>Перевищення лімітів</span>
        </div>
        <div class="chart-body">
          <div ref="barChart"></div>
        </div>
      </div>

      <div class="chart-card full-width">
        <div class="chart-info">
          <h4>📈 Пульс витрат</h4>
          <span>Щоденна активність</span>
        </div>
        <div class="chart-body pulse-body">
          <div ref="areaChart"></div>
        </div>
      </div>

      <div class="chart-card">
        <div class="chart-info">
          <h4>🎯 Прогрес цілей</h4>
          <span>Наближення до мрії</span>
        </div>
        <div class="chart-body">
          <div ref="radialChart"></div>
        </div>
      </div>
      
      <div class="chart-card empty-state">
        <div class="stats-mini">
          <p>{{ dynamicAdvice }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import ApexCharts from 'apexcharts';
import ipconfig from '@/server_configs/config.js';

// 1. Принимаем budget_id от родительского компонента
const props = defineProps({
  budget_id: {
    type: String,
    required: true
  }
});

const router = useRouter();

// Рефы для DOM-элементов графиков
const donutChart = ref(null);
const barChart = ref(null);
const areaChart = ref(null);
const radialChart = ref(null);

// Состояния компонента
const isLoading = ref(true);
const dynamicAdvice = ref('');

// Общие настройки для графиков
const commonOptions = {
  chart: {
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    toolbar: { show: false },
    background: 'transparent'
  },
  states: {
    hover: { filter: { type: 'none' } }
  }
};

// Функция для генерации совета на основе трат
const generateAdvice = (total, prev) => {
  if (prev === 0) {
    return `Ваші витрати складають: ${total} €. Чудовий початок! 🚀`;
  }
  const diff = prev - total;
  const percentage = Math.abs(Math.round((diff / prev) * 100));
  
  if (diff > 0) {
    return `Порада: Ви витратили на ${percentage}% менше, ніж минулого періоду. Так тримати! 🚀`;
  } else {
    return `Порада: Ви витратили на ${percentage}% більше, ніж минулого періоду. Варто бути уважнішим! 📉`;
  }
};

// Функция инициализации графиков с реальными данными
const renderCharts = (data) => {
  // 1. Donut - Структура трат
  new ApexCharts(donutChart.value, {
    ...commonOptions,
    chart: { ...commonOptions.chart, type: 'donut', height: 250 },
    series: data.donut_chart.map(item => item.amount),
    labels: data.donut_chart.map(item => item.category_name),
    colors: ['#4318ff', '#6ad2ff', '#eff4fb', '#2b3674', '#a3aed0'],
    legend: { position: 'bottom', fontSize: '12px', markers: { radius: 12 } },
    plotOptions: { 
      pie: { 
        donut: { 
          size: '75%', 
          labels: { 
            show: true, 
            total: { 
              show: true, 
              label: 'Усього', 
              formatter: () => `${data.total_spent} €` 
            } 
          } 
        } 
      } 
    },
    dataLabels: { enabled: false }
  }).render();

  // 2. Bar - План vs Факт
  new ApexCharts(barChart.value, {
    ...commonOptions,
    chart: { 
      ...commonOptions.chart, 
      type: 'bar', 
      height: 320, 
      // Додаємо великий відступ справа, щоб цифри "Факт" не обрізалися
      grid: { padding: { right: 60 } } 
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: '80%', // Робимо бари товстішими для солідності
        dataLabels: {
          position: 'top', // Виносить цифри в кінець бару
        }
      }
    },
    colors: ['#4318ff', '#e0e5f2'],
    dataLabels: {
      enabled: true,
      // Налаштовуємо відступи для кожного ряду окремо
      offsetX: 45, // Виносимо цифри далеко вправо від бару
      style: {
        fontSize: '12px',
        fontWeight: 700,
        colors: ['#2b3674'] // Однаковий колір для всіх цифр, щоб вони не губилися
      },
      formatter: (val) => val > 0 ? `${val} €` : '' // Ховаємо нулі
    },
    series: [
      { 
        name: 'Факт', 
        data: data.bar_chart.map(item => item.actual) 
      },
      { 
        name: 'План', 
        data: data.bar_chart.map(item => item.planned) 
      }
    ],
    xaxis: { 
      categories: data.bar_chart.map(item => item.category_name),
      labels: { show: false }, // Прибираємо шкалу знизу, щоб не дублювати дані
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: {
          fontSize: '13px',
          fontWeight: 600,
          colors: ['#2b3674']
        },
        maxWidth: 140 // Резервуємо місце під довгі назви категорій
      }
    },
    grid: { show: false }, // Вимикаємо сітку для чистоти
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    },
    tooltip: {
      y: { formatter: (val) => `${val} €` }
    }
  }).render();


  // 3. Area - Пульс трат
  new ApexCharts(areaChart.value, {
    ...commonOptions,
    chart: { ...commonOptions.chart, type: 'area', height: 280, zoom: { enabled: false } },
    stroke: { curve: 'smooth', width: 3, colors: ['#4318ff'] },
    fill: { 
      type: 'gradient', 
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 90, 100] } 
    },
    series: [{ name: 'Витрати', data: data.area_chart.map(item => item.amount) }],
    xaxis: {
      categories: data.area_chart.map(item => item.date),
      labels: { style: { colors: '#a3aed0' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: { labels: { style: { colors: '#a3aed0' }, formatter: (val) => val + ' €' } },
    grid: { borderColor: '#f1f1f1' }
  }).render();

  // 4. RadialBar - Цели
  // Берем первую цель для отображения в центре, если она есть
  const mainGoal = data.radial_chart.length > 0 ? data.radial_chart[0] : { goal_name: 'Цілі', percentage: 0 };
  
  new ApexCharts(radialChart.value, {
    ...commonOptions,
    chart: { ...commonOptions.chart, type: 'radialBar', height: 280 },
    series: data.radial_chart.map(item => Math.round(item.percentage)),
    labels: data.radial_chart.map(item => item.goal_name),
    colors: ['#4318ff', '#05cd99', '#ffb547', '#e354d4'],
    plotOptions: {
      radialBar: {
        track: { background: '#f4f7fe' },
        dataLabels: {
          name: { fontSize: '14px', color: '#a3aed0' },
          value: { fontSize: '20px', fontWeight: 700, color: '#2b3674' },
          total: { 
            show: true, 
            label: `Ціль: ${mainGoal.goal_name}`, 
            formatter: () => `${Math.round(mainGoal.percentage)}%` 
          }
        }
      }
    }
  }).render();
};

// Запрашиваем данные при монтировании компонента
onMounted(async () => {
  try {
    const token = localStorage.getItem('jwt_token');
    const url = `/api/analytics/dashboard/${props.budget_id}`;
    
    // Используем встроенный fetch, применяя ваши настройки
    const response = await fetch(`${ipconfig.backend_ip}${url}`, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    // Проверка на невалидный токен
    if (data.message === 'invalid token' || response.status === 401) {
      router.push('/sign-in');
      return;
    }

    // Устанавливаем совет
    dynamicAdvice.value = generateAdvice(data.total_spent, data.prev_spent);

    // Снимаем лоадер
    isLoading.value = false;

    // Ждем обновления DOM (чтобы v-else отрендерил контейнеры для графиков)
    await nextTick();
    
    // Рисуем графики
    renderCharts(data);

  } catch (error) {
    console.error('Помилка завантаження аналітики:', error);
    // Здесь можно добавить обработку ошибки (например, тост-уведомление)
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Добавлен стиль для лоадера */
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 18px;
  font-weight: 600;
  color: #2b3674;
}

.analytics-container {
  padding: 10px;
  background: #f4f7fe;
  border-radius: 20px;
  max-height: 80vh;
  overflow-y: auto;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.chart-card {
  background: white;
  padding: 24px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chart-info h4 {
  margin: 0;
  color: #2b3674;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.chart-info span {
  color: #a3aed0;
  font-size: 14px;
  font-weight: 500;
}

.chart-body {
  margin-top: 10px;
  min-height: 250px;
}

.full-width {
  grid-column: span 2;
}

.empty-state {
  justify-content: center;
  align-items: center;
  text-align: center;
  background: linear-gradient(135deg, #4318ff 0%, #b4a3ff 100%);
  color: white;
}

.stats-mini p {
  font-weight: 600;
  font-size: 16px;
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  .full-width {
    grid-column: span 1;
  }
}

.analytics-container::-webkit-scrollbar {
  width: 6px;
}
.analytics-container::-webkit-scrollbar-thumb {
  background: #e0e5f2;
  border-radius: 10px;
}
</style>