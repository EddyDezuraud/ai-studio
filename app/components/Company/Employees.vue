<template>
    <div :class="$style.wrapper">
        <ul :class="$style.list" class="beauty-scroll">
            <li v-for="(employee, index) in employees" :key="index" :class="$style.employee">
                <a :href="employee.url" :class="$style.employeeLink">
                    <div :class="$style.avatar">
                        {{ avatar(employee.name) }}
                    </div>
                    <div :class="$style.employeeInfos">
                        <span :class="$style.name">{{ employee.name }}</span>
                        <span :class="$style.position">{{ employee.position }}</span>
                    </div>
                    <div :class="$style.icon">
                        <svg width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M13 18l6 -6" /><path d="M13 6l6 6" /></svg>
                    </div>
                </a>
            </li>
        </ul>
        <footer :class="$style.footer">
            <a :class="$style.footerBtn" href="https://linkedin.com" target="_blank">See all employees</a>
        </footer>
    </div>
</template>

<script lang="ts" setup>
import type { Employee } from '@/types/StylesConfig';

interface Props {
    employees: Employee[]
}

const props = defineProps<Props>();

const avatar = (name: string) => {
    const names = name.split(' ');
    return names[0][0] + names[names.length - 1][0];
}

</script>

<style module lang="scss">
.wrapper {
    border-radius: var(--border-radius);
    border: var(--border);
    position: relative;

}

.header {
    padding: 20px;
    text-align: center
}

.title {
    display: block;
    font-size: 18px;
    font-weight: 500;
}

.p {
    display: block;
    font-size: 12px;
}

.list {
    max-height: 250px;
    overflow: auto;
    li {
        list-style-type: none;
        margin: 0;

        &:not(:last-child) {
            border-bottom: var(--border);
        }
    }
}

.employeeLink {
    text-decoration: none;
    color: var(--text-color);
    padding: 10px 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--primary-color);
        transition: opacity 0.15s;
        opacity: 0;
    }

    &:hover {
        color: var(--primary-color);

        &::before {
            opacity: .1;
        }

        .icon {
            opacity: 1;
        }
    }
}

.employeeInfos {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.icon {
    opacity: 0;
    transition: opacity 0.15s;

    svg {
        width: 15px;
    }
}

.name {
    font-size: 14px;
    font-weight: 600;
}

.position {
    color: var(--dark-100);
    font-size: 12px;
}

.avatar {
    width: 30px;
    aspect-ratio: 1/1;
    border-radius: 50%;
    background-color: var(--primary-color);
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-weight: 500;
    font-size: 10px;
    position: relative;

    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 50%;
        background: linear-gradient(45deg, rgba(255, 255, 255, 0) 0%, #ffffff00 0%, #ffffff50 100%);
    
    }
}

.footer {
    position: absolute;
    bottom: 0;
    text-align: center;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
    width: 100%;
    left: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #ffffff 50%, #ffffff 100%);
}

.footerBtn {
    display: block;
    padding: 5px 15px;
    font-size: 12px;
    // border: var(--border);
    background: var(--primary-color);
    font-weight: 500;
    color: white;
    border-radius: var(--border-radius);
}
</style>