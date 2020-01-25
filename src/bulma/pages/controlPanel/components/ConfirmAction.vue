<template>
    <confirmation v-if="action.confirmation"
        placement="bottom"
        @confirm="$refs.action.doAction()">
        <action ref="action"
            :action="action"
            :action-key="actionKey"
            :application="application"
            v-bind="$attrs"
            v-on="$listeners"/>
    </confirmation>
    <action v-else
        ref="action"
        @click="$refs.action.doAction()"
        :action="action"
        :action-key="actionKey"
        :application="application"
        v-bind="$attrs"
        v-on="$listeners"/>
</template>

<script>
import { VTooltip } from 'v-tooltip';
import Confirmation from '@enso-ui/confirmation/bulma';
import Action from './Action.vue';

export default {
    name: 'ConfirmAction',

    inject: ['route', 'i18n'],

    directives: { tooltip: VTooltip },

    components: { Confirmation, Action },

    props: {
        actionKey: {
            type: String,
            required: true,
        },
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
