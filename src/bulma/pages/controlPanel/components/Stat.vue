<template>
    <div v-tooltip="stat.tooltip">
        <span class="icon is-small">
            <fa :icon="stat.icon" size="sm"/>
        </span>
        <span class="stat is-bold"
            :class="stat.class">
            {{ stat.value }}
        </span>
    </div>
</template>

<script>
import { VTooltip } from 'v-tooltip';

export default {
    name: 'Stat',

    directives: { tooltip: VTooltip },

    props: {
        stat: {
            type: Object,
            default: null,
        },
    },
};
</script>

<style lang="scss">
    .stat {
        font-size: 0.9em;
    }
</style>
