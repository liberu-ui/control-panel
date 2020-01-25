<template>
    <a class="is-naked has-margin-left-medium action"
       v-on="$listeners"
       v-tooltip="action.description">
            <span class="icon is-small is-clickable has-margin-top-small">
                <fa :icon="action.icon"
                    size="xs"/>
            </span>
        <span>{{ action.label }}</span>
    </a>
</template>

<script>
import { VTooltip } from 'v-tooltip';

export default {
    name: 'Action',

    inject: ['route', 'i18n'],

    directives: { tooltip: VTooltip },

    props: {
        action: {
            type: Object,
            required: true,
        },
        actionKey: {
            type: String,
            required: true,
        },
        application: {
            type: Object,
            required: true,
        },
    },

    methods: {
        doAction() {
            const route = this.route('controlPanel.action', {
                application: this.application.id,
                action: this.actionKey,
            });

            axios.post(route).then(({ data }) => {
                if (data.url) {
                    window.open(data.url, '_blank');
                }

                this.$emit('action');
            });
        },
    },
};

</script>
<style scoped>
   .action {
       margin: auto;
   }
</style>
