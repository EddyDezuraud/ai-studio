<template>
  <div :class="$style.wrapper">
    <form @submit.prevent="submitForm" :class="$style.form">
        <input v-model="query" type="text" :placeholder="mode === 'url' ? 'Search for a url' : 'Search for a company name'" />
        <button :class="$style.button">
            <div v-if="pending" :class="$style.loader"></div>
            <svg v-else width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 7H15" stroke="#43565E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 13L15 7" stroke="#43565E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 1L15 7" stroke="#43565E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>  
    </form>
    <div :class="$style.tabs">
      <button @click="onChangeMode('name')" :class="[$style.tab, {[$style.active] : mode === 'name'}]">
        Search by name
      </button>
      <button @click="onChangeMode('url')" :class="[$style.tab, {[$style.active] : mode === 'url'}]">
        Search by URL
      </button>
    </div>
  </div>
    
</template> 

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
    pending: boolean
}

const props = defineProps<Props>()

const query = ref('')
const mode = ref('name');
const error = ref(false);

const emit = defineEmits(['submit'])


const isValidUrl = (urlString: string): boolean => {
  try {
    const url = new URL(urlString)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch (_) {
    return false
  }
}

const submitForm = () => {
  if(props.pending) return;

  if (mode.value === 'name' || isValidUrl(query.value)) {
    emit('submit', {query: query.value, mode: mode.value})
  } else {
    error.value = true;
  }
};

const onChangeMode = (res: 'url' | 'name') => {
  mode.value = res;
  query.value = '';
  error.value = false;
}
</script>


<style module lang="scss">
.wrapper {
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    position: relative;
    margin-bottom: 20px;
}

.form {
    position: relative;
}

input {
    width: 100%;
    padding: 20px;
    border: 2px solid #00000010;
    border-radius: 8px;
    font-size: 20px;
    color: #1B1F21;
    outline: none;
}

.button {
    position: absolute;
    right: 0;
    background: transparent;
    border: none;
    top: 0;
    display: block;
    margin: 0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1/1;
    cursor: pointer;

    &:hover {
        color: #0a0b0c;
    }
}

.tabs {
  display: flex;
  padding-left: 10px;
}

.tab {
  cursor: pointer;
  background: transparent;
  border-radius: 0 0 4px 4px;
  border: none;
  outline: none;
  padding: 8px 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--dark-900);

  &.active {
    color: var(--dark);
    background: #ebeef180;
  }
}

// small loader
.loader {
    border: 2px solid #f3f3f3;
    border-top: 2px solid #3498db;
    border-radius: 50%;
    width: 12px;
    height: 12px;
    animation: spin 1s linear infinite;
    margin: 0 auto;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>