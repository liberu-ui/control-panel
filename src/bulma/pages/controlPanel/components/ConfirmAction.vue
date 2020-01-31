<template>
    <confirmation v-if="action.confirmation"
        placement="bottom"
        @confirm="$refs.action.doAction()">
        <action ref="action"
            :action="action"
            :application="application"
            v-on="$listeners"/>
    </confirmation>
    <action v-else
        ref="action"
        @click="$refs.action.doAction()"
        :action="action"
        :application="application"
        v-on="$listeners"/>
</template>

<script>
import Confirmation from '@enso-ui/confirmation/bulma';
import Action from './Action.vue';

export default {
    name: 'ConfirmAction',

    inject: ['route', 'i18n'],

    components: { Confirmation, Action },

    props: {
        action: {
            type: Object,
            required: true,
        },
        application: {
            type: Object,
            required: true,
        },
    },
};
</script>
