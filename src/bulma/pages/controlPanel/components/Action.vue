<template>
    <a class="has-text-grey"
        v-tooltip="i18n(action.tooltip)">
        <span class="icon is-small is-clickable mt-1">
            <fa :icon="action.icon"
                size="xs"/>
        </span>
        <span class="is-bold">
            {{ i18n(action.label) }}
        </span>
    </a>
</template>

<script>
import 'v-tooltip/dist/v-tooltip.css';
import { VTooltip } from 'v-tooltip';
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';

export default {
    name: 'Action',

    directives: { tooltip: VTooltip },

    components: { Fa },

    inject: ['http', 'i18n', 'route', 'errorHandler'],

    props: {
        action: {
            type: Object,
            required: true,
        },
        app: {
            type: Object,
            required: true,
        },
    },

    emits: ['action-successful'],

    computed: {
        params() {
            return {
                application: this.app.id,
                action: this.action.id,
            };
        },
    },

    methods: {
        handle() {
            this.http.post(this.route('controlPanel.action', this.params))
                .then(({ data }) => {
                    if (data.url) {
                        window.open(data.url, '_blank');
                    }

                    this.$emit('action-successful');
                }).catch(this.errorHandler);
        },
    },
};
</script>
