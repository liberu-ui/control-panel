<template>
    <a class="has-text-grey"
        target="_blank"
        :href="link.url"
        v-tooltip="link.tooltip">
        <span class="icon is-small mt-1">
            <fa :icon="link.icon"
                size="xs"/>
        </span>
        <span class="is-bold">{{ link.label }}</span>
    </a>
</template>

<script>
import 'v-tooltip/dist/v-tooltip.css';
import { VTooltip } from 'v-tooltip';
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';

export default {
    name: 'FooterLink',

    directives: { tooltip: VTooltip },

    compoennts: { Fa },

    props: {
        link: {
            type: Object,
            required: true,
        },
    },
};
</script>
