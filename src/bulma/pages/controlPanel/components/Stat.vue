<template>
    <div v-tooltip="stat.tooltip">
        <span class="icon is-small"
            :class="stat.class">
            <fa :icon="stat.icon" size="sm"/>
        </span>
        <span class="stat has-text-grey is-bold">
            <span v-if="needsFormat(stat.value)">
                {{ stat.value | numberFormat(0) }}
            </span>
            <span v-else>
                {{ stat.value }}
            </span>
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

    methods: {
        needsFormat(value) {
            return Number.isInteger(value);
        },
    },
};
</script>

<style lang="scss">
    .stat {
        font-size: 0.9em;
    }
</style>
