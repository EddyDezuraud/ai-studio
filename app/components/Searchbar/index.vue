<template>
  <div :class="$style.wrapper">
    <form @submit.prevent="submitForm" :class="$style.form">
        <input v-model="url" type="text" placeholder="Search for a url" />
        <button :class="$style.button">
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 7H15" stroke="#43565E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 13L15 7" stroke="#43565E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 1L15 7" stroke="#43565E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>  
    </form>
    <div :class="$style.tabs">
      <button :class="$style.tab">
        Search by URL
      </button>
      <button :class="$style.tab">
        Search by name
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

const url = ref('')
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
  
  if (isValidUrl(url.value)) {
    emit('submit', url.value)
  } else {
    error.value = true;
  }
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
</style>