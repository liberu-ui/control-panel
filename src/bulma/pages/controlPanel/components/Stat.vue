<template>
    <div class="column is-4"
        :class="stat.class">
        <fa v-if="stat.icon"
            :icon="stat.icon"
            class="has-margin-right-small"
            v-tooltip="i18n(stat.tooltip)"/>
        <span>{{ stat.value }}</span>
    </div>
</template>

<script>
import { VTooltip } from 'v-tooltip';

export default {
    name: 'Stat',

    inject: ['route', 'i18n'],

    directives: { tooltip: VTooltip },

    props: {
        stat: {
            type: Object,
            default: null,
        },
    },
};
</script>
