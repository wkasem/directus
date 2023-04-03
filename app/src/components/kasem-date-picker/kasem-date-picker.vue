<script setup>
import { ref, computed, watch, defineEmits } from 'vue';

import DateUtil from '../../utils/Date';

import MonthSelect from './units/MonthSelect.vue';
import YearSelect from './units/YearSelect.vue';

const emit = defineEmits(['update:model-value', 'close']);
const props = defineProps({ range: Boolean, 'model-value': Array });
const active = ref(false);
const rangeText = ref('');

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());

const daysOfMonth = computed(() => DateUtil.daysOfMonth(currentYear.value, currentMonth.value));

const firstDay = computed(() => DateUtil.firstDay(currentYear.value, currentMonth.value));

const selectedDateStart = ref(null);
const selectedDateEnd = ref(null);

const selectDate = (day) => {
	if (!day.num) return;

	const selectedDate = new Date(currentYear.value, currentMonth.value, day.num);

	if (!props.range) {
		selectedDateStart.value = selectedDate;
		return emit('update:model-value', [selectedDateStart.value.toDateString()]);
	}

	if (selectedDateStart.value && DateUtil.isEqual(selectedDateStart.value, selectedDate)) {
		selectedDateStart.value = null;
		selectedDateEnd.value = null;
		return;
	}
	if (!selectedDateStart.value || selectedDateEnd.value) {
		selectedDateStart.value = selectedDate;
		selectedDateEnd.value = null;
		return;
	}

	selectedDateEnd.value = selectedDate;
};

const days = computed(() => {
	return Array.from({ length: daysOfMonth.value + firstDay.value }, (_, i) => {
		let num = i - firstDay.value + 1;

		return {
			num: i >= firstDay.value ? num : '',
			selected: DateUtil.isEqualAny(
				new Date(currentYear.value, currentMonth.value, num),
				selectedDateStart.value,
				selectedDateEnd.value
			),
			withinSelected: DateUtil.within(
				new Date(currentYear.value, currentMonth.value, num),
				selectedDateStart.value,
				selectedDateEnd.value
			),
		};
	});
});

const canSelect = computed(() => {
	if (!props.range && selectedDateStart?.value) return true;

	return selectedDateStart?.value && selectedDateEnd?.value;
});

//when user select range but closes the picker
//rather clicking select period
watch(active, (val) => {
	if (val || (rangeText.value == '' && !props.range)) return;

	const [dateStart, dateEnd] = rangeText.value.split('-');
	selectedDateStart.value = new Date(dateStart);
	selectedDateEnd.value = new Date(dateEnd);
});

watch(
	() => props.modelValue,
	(dates) => {
		selectedDateStart.value = new Date(dates[0]);

		if (props.range) {
			selectedDateEnd.value = new Date(dates[1]);
		}
	},
	{ immediate: true }
);

const selectYear = (year) => {
	currentYear.value = year;
};
const selectMonth = (month) => {
	if (month > 11) {
		currentMonth.value = 0;
		selectYear(currentYear.value + 1);
		return;
	}
	if (month < 0) {
		currentMonth.value = 11;
		selectYear(currentYear.value - 1);
		return;
	}
	currentMonth.value = month;
};

const setRangeText = () => {
	rangeText.value = DateUtil.rangeToText(selectedDateStart.value, selectedDateEnd.value);
	active.value = false;

	emit('update:model-value', [selectedDateStart.value, selectedDateEnd.value]);
};

const clearSelection = () => {
	selectedDateStart.value = null;
	selectedDateEnd.value = null;

	setRangeText();

	close();
};

const close = () => {
	emit('close');
};
</script>

<template>
	<div class="date-picker" :class="{ active }">
		<div class="calendar">
			<div class="calendar-header">
				<MonthSelect @update:model-value="(e) => selectMonth(e)" :modelValue="currentMonth" />
				<YearSelect v-model="currentYear" />
			</div>

			<div class="calendar-body">
				<div class="calendar-week-day">
					<div v-for="day in DateUtil.dayNames" :key="day" v-text="day"></div>
				</div>
				<div class="calendar-day">
					<div
						:class="{
							'not-active': day.num == '',
							selected: day.selected,
							'within-selected': day.withinSelected,
						}"
						v-for="(day, index) in days"
						:key="index"
						@click="selectDate(day)"
					>
						{{ day.num }}
					</div>
				</div>
			</div>

			<div class="calendar-footer">
				<button class="btn text" @click="close">Close</button>
				<button class="btn outlined" @click="clearSelection" v-show="canSelect">Clear</button>
				<button class="btn primary" @click="setRangeText" :disabled="!canSelect" v-if="props.range">
					Select Period
				</button>
			</div>
		</div>
	</div>
</template>



<style>
.calendar {
	height: max-content;
	width: 100%;
	box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
	border-radius: 10px;
	overflow: hidden;
	transition: all 0.3s ease;
	color: #5a5a5a;
	background-color: white;
}

.calendar-body {
	padding: 1rem;
	border-bottom: 1px solid #e1dfdf;
}

.calendar-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: 1rem;
	font-weight: 600;
	padding: 1rem 1.3rem;
	border-bottom: 1px solid #e1dfdf;
}

.calendar-footer {
	padding: 1rem 2rem;
}

.calendar-week-day {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	font-weight: 600;
	height: 2rem;
}

.calendar-week-day div {
	display: grid;
	place-items: center;
}

.calendar-day {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
}

.calendar-day .selected {
	background: #050e3e;
	color: #fff;
}

.calendar-day .within-selected {
	background: rgba(0, 0, 0, 0.3);
	color: #fff;
}
.calendar-day div {
	height: 1.5rem;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1rem;
	position: relative;
	cursor: pointer;
	transition: color 0.3s ease;
}

.calendar-day div:not(.selected, .within-selected, .not-active):hover {
	background: rgba(0, 0, 0, 0.3);
	color: #000;
}

.calendar-footer {
	padding: 10px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.arrow {
	border: solid #5a5a5a;
	border-width: 0 2px 2px 0;
	display: inline-block;
	padding: 3px;
	cursor: pointer;
	transition: border 0.3s ease;
}
.arrow:hover {
	border-color: #050e3e;
}

.arrow.right {
	transform: rotate(-45deg);
}

.arrow.left {
	transform: rotate(135deg);
}

.select {
	display: flex;
	align-items: center;
	gap: 20px;
}

.btn {
	all: unset;
	padding: 10px 15px;
	margin: 10px;
	cursor: pointer;
	transition: all 0.3s ease;
	border-radius: 5px;
	font-size: 0.8rem;
}

.btn:disabled {
	opacity: 0.5;
}

.btn.primary {
	background: #050e3e;
	color: white;
}
.btn.outlined {
	border: 1px solid #d7d5d5;
}

.btn.text:hover {
	text-decoration: underline;
}
.btn:not(:disabled):hover {
	opacity: 0.9;
}
</style>
