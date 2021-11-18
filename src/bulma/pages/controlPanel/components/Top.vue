<template>
    <div class="wrapper">
        <div class="columns is-centered">
            <div class="column is-narrow">
                <indicator :label="i18n('Logins')"
                    :model-value="summary.logins"/>
            </div>
            <div class="column is-narrow">
                <indicator :label="i18n('Requests')"
                    :model-value="summary.requests"/>
            </div>
            <div class="column is-narrow">
                <div class="box indicator raises-on-hover">
                    <button class="button is-small is-naked"
                        @click="$emit('refresh')">
                        <span class="icon is-small">
                            <fa icon="sync"/>
                        </span>
                    </button>
                </div>
            </div>
            <div class="column is-narrow">
                <indicator :label="i18n('Users')"
                    :model-value="summary.newUsers"/>
            </div>
            <div class="column is-narrow">
                <indicator :label="i18n('Sessions')"
                    :model-value="summary.sessions"/>
            </div>
        </div>
         <div class="columns is-centered">
            <div class="column is-narrow">
                <enso-date-filter class="box raises-on-hover"
                    compact/>
            </div>
        </div>
    </div>
</template>

<script>
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import { EnsoDateFilter } from '@enso-ui/filters/bulma';
import Indicator from './Indicator.vue';

export default {
    name: 'Top',

    components: { Fa, Indicator, EnsoDateFilter },

    inject: ['i18n'],

    props: {
        summary: {
            type: Object,
            required: true,
        },
    },
};
</script>
