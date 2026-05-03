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
import { ref, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import ApexCharts from 'apexcharts';
import ipconfig from '@/server_configs/config.js';

// instances
let donutInstance = null;
let barInstance = null;
let areaInstance = null;
let radialInstance = null;

const props = defineProps({
  budget_id: {
    type: String,
    required: true
  }
});

const router = useRouter();

const donutChart = ref(null);
const barChart = ref(null);
const areaChart = ref(null);
const radialChart = ref(null);

const isLoading = ref(true);
const dynamicAdvice = ref('');

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

const generateAdvice = (total, prev) => {
  if (prev === 0) {
    return `Ваші витрати складають: ${total} €. Чудовий початок! 🚀`;
  }

  const diff = prev - total;
  const percentage = Math.abs(Math.round((diff / prev) * 100));

  if (diff > 0) {
    return `Порада: Ви витратили на ${percentage}% менше, ніж минулого періоду. Так тримати! 🚀`;
  }

  return `Порада: Ви витратили на ${percentage}% більше, ніж минулого періоду. Варто бути уважнішим! 📉`;
};

const renderCharts = (data) => {
  // DONUT
  donutInstance = new ApexCharts(donutChart.value, {
    ...commonOptions,
    chart: { ...commonOptions.chart, type: 'donut', height: 250 },
    series: data.donut_chart.map(i => i.amount),
    labels: data.donut_chart.map(i => i.category_name),
    colors: ['#4318ff', '#6ad2ff', '#eff4fb', '#2b3674', '#a3aed0'],
    legend: { position: 'bottom' },
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
  });
  donutInstance.render();

  // BAR
  barInstance = new ApexCharts(barChart.value, {
    ...commonOptions,
    chart: {
      ...commonOptions.chart,
      type: 'bar',
      height: 320
    },
    grid: {
      padding: { right: 60 }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        barHeight: '80%',
        dataLabels: {
          position: 'center',
        }
      }
    },
    colors: ['#4318ff', '#a3aed0'],
    dataLabels: {
  enabled: true,
  offsetX: 15, // было 45 — уменьшаем
  style: {
    fontSize: '12px',
    fontWeight: 700,
    colors: [({ seriesIndex, dataPointIndex, w }) => {
      const value = w.config.series[seriesIndex].data[dataPointIndex];

      const max = Math.max(
        ...w.config.series.flatMap(s => s.data)
      );

      // длинный бар → белый текст
      if (value > max * 0.1) {
        return '#ffffff';
      }

      // короткий → тёмный
      return '#2b3674';
    }]
  },
  formatter: (val) => val > 0 ? `${val} €` : ''
},
    series: [
      { name: 'Факт', data: data.bar_chart.map(i => i.actual) },
      { name: 'План', data: data.bar_chart.map(i => i.planned) }
    ],
    xaxis: {
      categories: data.bar_chart.map(i => i.category_name),
      labels: { show: false },
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
        maxWidth: 140
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right'
    },
    tooltip: {
      y: { formatter: (val) => `${val} €` }
    }
  });
  barInstance.render();

  // AREA
  areaInstance = new ApexCharts(areaChart.value, {
    ...commonOptions,
    chart: { ...commonOptions.chart, type: 'area', height: 280, zoom: { enabled: false } },
    stroke: { curve: 'smooth', width: 3, colors: ['#4318ff'] },
    fill: {
      type: 'gradient',
      gradient: { opacityFrom: 0.4, opacityTo: 0.1 }
    },
    series: [{ name: 'Витрати', data: data.area_chart.map(i => i.amount) }],
    xaxis: {
      categories: data.area_chart.map(i => i.date)
    }
  });
  areaInstance.render();

  // RADIAL
  const mainGoal =
    data.radial_chart.length > 0
      ? data.radial_chart[0]
      : { goal_name: 'Цілі', percentage: 0 };

  radialInstance = new ApexCharts(radialChart.value, {
    ...commonOptions,
    chart: { ...commonOptions.chart, type: 'radialBar', height: 280 },
    series: data.radial_chart.map(i => Math.round(i.percentage)),
    labels: data.radial_chart.map(i => i.goal_name),
    colors: ['#4318ff', '#05cd99', '#ffb547', '#e354d4'],
    plotOptions: {
      radialBar: {
        track: { background: '#f4f7fe' },
        dataLabels: {
          total: {
            show: true,
            label: `Ціль: ${mainGoal.goal_name}`,
            formatter: () => `${Math.round(mainGoal.percentage)}%`
          }
        }
      }
    }
  });
  radialInstance.render();
};

// CLEANUP
onBeforeUnmount(() => {
  donutInstance?.destroy();
  barInstance?.destroy();
  areaInstance?.destroy();
  radialInstance?.destroy();
});

// FETCH
onMounted(async () => {
  try {
    const token = localStorage.getItem('jwt_token');

    const response = await fetch(
      `${ipconfig.backend_ip}/api/analytics/dashboard/${props.budget_id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data = await response.json(); // FIX

    if (response.status === 401 || data.message === 'invalid token') {
      router.push('/sign-in');
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    dynamicAdvice.value = generateAdvice(
      data.total_spent,
      data.prev_spent
    );

    isLoading.value = false;

    await nextTick();
    renderCharts(data);

  } catch (error) {
    console.error('Помилка завантаження аналітики:', error);
    dynamicAdvice.value = 'Не вдалося завантажити аналітику';
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