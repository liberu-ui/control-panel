<template>
    <div v-tooltip="stat.tooltip">
        <span class="icon is-small"
            :class="stat.class">
            <fa :icon="stat.icon"
                size="sm"/>
        </span>
        <span class="stat is-bold">
            {{ stat.value }}
        </span>
    </div>
</template>

<script>
import 'v-tooltip/dist/v-tooltip.css';
import { VTooltip } from 'v-tooltip';
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';

export default {
    name: 'Stat',

    directives: { tooltip: VTooltip },

    components: { Fa },

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
