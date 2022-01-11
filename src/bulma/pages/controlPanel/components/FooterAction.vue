<template>
    <confirmation v-if="action.confirmation"
        placement="bottom"
        @confirm="$refs.action.handle()">
        <action ref="action"
            :action="action"
            :app="app"/>
    </confirmation>
    <action v-else
        ref="action"
        @click="$refs.action.handle()"
        :action="action"
        :app="app"/>
</template>

<script>
import Confirmation from '@enso-ui/confirmation/bulma';
import Action from './Action.vue';

export default {
    name: 'FooterAction',

    components: { Confirmation, Action },

    inject: ['route', 'i18n'],

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
};
</script>
