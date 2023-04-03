<script setup>
import { ref, defineEmits, defineProps } from "vue";

const emit = defineEmits(["change"]);
const props = defineProps({ items: Object, value: Number });

const active = ref(false);

const select = (item) => {
  active.value = false;
  emit("change", item);
};
</script>

<template>
  <div class="dropdown">
    <div @click="active = true">
      <slot>
        {{ props.items[props.value] }}
      </slot>
    </div>
    <div class="selections" :class="{ active: active }">
      <ul>
        <li
          v-for="(item, index) in props.items"
          :key="index"
          :class="{ selected: props.value == index }"
          @click="select(index)"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
}
.selections {
  position: absolute;
  top: 0;
  left: 0;
  width: max-content;
  height: 200px;
  overflow-y: scroll;
  background: white;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  display: none;
  z-index: 999;
  border-radius: 10px;
}

.selections.active {
  display: block;
}

.dropdown > div {
  cursor: pointer;
  transition: color 0.3s ease;
}
.dropdown > div:hover {
  color: #050e3e;
}
.dropdown ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.dropdown ul li {
  font-weight: 100;
  font-size: 15px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.1s ease;
}
.dropdown ul li:not(:last-child) {
  border-bottom: 1px solid #e1dfdf;
}
.dropdown ul li:is(:hover, .selected) {
  background-color: #050e3e;
  color: white;
}
</style>