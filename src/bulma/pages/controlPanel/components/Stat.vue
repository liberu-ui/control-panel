<template>
    <div v-tooltip="stat.tooltip">
        <span class="icon is-small"
            :class="stat.class">
            <fa :icon="stat.icon" size="sm"/>
        </span>
        <span class="stat has-text-grey is-bold">
            {{ value }}
        </span>
    </div>
</template>

<script>
import { VTooltip } from 'v-tooltip';
import { numberFormat } from '@enso-ui/mixins';

export default {
    name: 'Stat',

    directives: { tooltip: VTooltip },

    props: {
        stat: {
            type: Object,
            default: null,
        },
    },

    computed: {
        value() {
            return Number.isInteger(this.stat.value)
                ? numberFormat(this.stat.value)
                : this.stat.value;
        },
    },
};
</script>

<style lang="scss">
    .stat {
        font-size: 0.9em;
    }
</style>
