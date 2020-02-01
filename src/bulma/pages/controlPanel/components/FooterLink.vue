<template>
    <a class="has-text-grey"
        target="_blank"
        :href="link.url"
        v-tooltip="link.tooltip">
        <span class="icon is-small has-margin-top-small">
            <fa :icon="link.icon"
                size="xs"/>
        </span>
        <span class="is-bold">{{ link.label }}</span>
    </a>
</template>

<script>
import { VTooltip } from 'v-tooltip';

export default {
    name: 'FooterLink',

    directives: { tooltip: VTooltip },

    props: {
        link: {
            type: Object,
            required: true,
        },
    },
};
</script>
