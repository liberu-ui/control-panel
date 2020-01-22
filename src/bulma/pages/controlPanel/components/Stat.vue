<template>
    <div class="column">
        <fa v-if="icon"
            :icon="dueTone ? ['fad', icon] : icon"
            class="has-margin-right-small"
            v-tooltip="i18n(tooltip)"/>
        <span> <slot/> </span>
    </div>
</template>

<script>
import { VTooltip } from 'v-tooltip';

export default {
    name: 'Stat',

    inject: ['route', 'i18n'],

    directives: { tooltip: VTooltip },

    props: {
        icon: {
            type: [String, Array],
            default: null,
        },
        dueTone: {
            type: Boolean,
            default: true,
        },
        tooltip: {
            type: String,
            required: true,
        },
    },
};

</script>
