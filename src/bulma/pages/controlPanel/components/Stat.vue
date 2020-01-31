<template>
    <div class="column is-4"
        :class="stat.class">
        <desc-tooltip :tooltip="stat.tooltip"
            :description="stat.description">
            <fa v-if="stat.icon"
                :icon="stat.icon"
                class="has-margin-right-medium"/>
        </desc-tooltip>
        <span>{{ stat.value }}</span>
    </div>
</template>

<script>
import DescTooltip from './DescTooltip.vue';

export default {
    name: 'Stat',

    inject: ['route', 'i18n'],

    components: { DescTooltip },

    props: {
        stat: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            desc: false,
        };
    },
};
</script>
<style type="scss">
    .v-popover {
        display: inline-block;
    }
    .show-more {
        font-size: 0.6em;
    }
</style>
