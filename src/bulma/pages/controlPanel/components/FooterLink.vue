<template>
    <div class="card-footer-item has-padding-medium">
        <a class="is-naked has-margin-left-medium"
            target="_blank"
            :href="link.url"
            v-if="link.label">
            <desc-tooltip :tooltip="link.tooltip"
                :description="link.description">
                <span class="icon is-small is-clickable has-margin-top-small">
                    <fa :icon="link.icon"
                        size="xs"/>
                </span>
            </desc-tooltip>
            <span>{{ link.label }}</span>
        </a>
        <div v-else
            class="loader"/>
    </div>
</template>

<script>
import DescTooltip from './DescTooltip.vue';

export default {
    name: 'FooterLink',

    components: { DescTooltip },

    props: {
        link: {
            type: Object,
            required: true,
        },
    },
};

</script>
