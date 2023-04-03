
<script setup>
import { defineEmits } from 'vue';
import DateUtil from '../../../utils/Date';
import DropDown from './DropDown.vue';

const emit = defineEmits(['update:model-value']);
</script>


<template>
	<div class="select">
		<span class="arrow left" @click="emit('update:modelValue', $attrs.modelValue - 1)"></span>

		<DropDown :items="DateUtil.years" @change="(e) => emit('update:modelValue', DateUtil.years[e])">
			{{ $attrs.modelValue }}
		</DropDown>
		<span class="arrow right" @click="emit('update:modelValue', $attrs.modelValue + 1)"></span>
	</div>
</template>