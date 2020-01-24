<template>
    <div class="card-footer-item has-padding-medium">
        <a class="is-naked has-margin-left-medium"
            target="_blank"
            :href="href"
            v-if="href">
            <span class="icon is-small is-clickable has-margin-top-small">
                <fa :icon="! Array.isArray(icon) ? ['fad', icon] : icon"
                    size="xs"/>
            </span>
            <span> <slot/> </span>
        </a>
        <div v-else
            class="loader"/>
    </div>
</template>

<script>
import { VTooltip } from 'v-tooltip';

export default {
    name: 'FooterLink',

    directives: { tooltip: VTooltip },

    props: {
        icon: {
            type: [String, Array],
            required: true,
        },
        href: {
            type: String,
            default: null,
        },
    },
};

</script>
