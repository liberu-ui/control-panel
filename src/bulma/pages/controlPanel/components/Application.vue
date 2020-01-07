<template>
    <card collapsible
        :loading="loading">
        <card-header class="has-background-light">
            <template v-slot:title>
                {{ application.name }}
            </template>
            <template v-slot:controls>
                <card-control>
                    <span class="icon is-small"
                        v-tooltip="application.description">
                        <fa icon="info-circle"/>
                    </span>
                </card-control>
                <card-refresh @refresh="fetch"/>
                <card-collapse/>
            </template>
        </card-header>
        <card-content class="is-paddingless">
            <table class="table application is-fullwidth is-marginless is-hoverable">
                <tr>
                    <td>
                        {{ i18n('Logins') }}
                    </td>
                    <td class="has-text-right is-bold">
                        {{ statistics.logins | numberFormat(0) }}
                    </td>
                </tr>
                <tr>
                    <td>
                        {{ i18n('Actions') }}
                    </td>
                    <td class="has-text-right is-bold">
                        {{ statistics.actions | numberFormat(0) }}
                    </td>
                </tr>
                <tr v-if="application.type === Enso">
                    <td>
                        {{ i18n('Sessions') }}
                    </td>
                    <td class="has-text-right is-bold">
                        {{ statistics.sessions | numberFormat(0) }}
                    </td>
                </tr>
                <tr v-if="application.type === Enso">
                    <td>
                        {{ i18n('Failed Jobs') }}
                    </td>
                    <td class="has-text-right is-bold">
                        {{ statistics.failedJobs | numberFormat(0) }}
                    </td>
                </tr>
                <tr>
                    <td>
                        {{ i18n('Users') }}
                    </td>
                    <td class="has-text-right is-bold">
                        {{ statistics.users | numberFormat(0) }}
                    </td>
                </tr>
                <tr>
                    <td>
                        {{ i18n('Active Users') }}
                    </td>
                    <td class="has-text-right is-bold">
                        {{ statistics.activeUsers | numberFormat(0) }}
                    </td>
                </tr>
                <tr v-if="application.type === Enso">
                    <td>
                        {{ i18n('New Users') }}
                    </td>
                    <td class="has-text-right is-bold">
                        {{ statistics.newUsers | numberFormat(0) }}
                    </td>
                </tr>
                <tr>
                    <td>
                        {{ i18n('Server Time') }}
                    </td>
                    <td class="has-text-right is-bold"
                        colspan="2">
                        {{ statistics.serverTime }}
                    </td>
                </tr>
                <tr v-if="application.type === Enso">
                    <td>
                        {{ i18n('Version') }}
                    </td>
                    <td class="has-text-right is-bold">
                        v{{ statistics.version }}
                    </td>
                </tr>
                <tr v-if="application.type === Enso">
                    <td>
                        {{ i18n('Log Size') }}
                    </td>
                    <td class="has-text-right is-bold is-narrow">
                        {{ statistics.logSize }}
                    </td>
                </tr>
                <tr>
                    <td>
                        {{ i18n('Status') }}
                    </td>
                    <td class="has-text-right is-bold"
                        :colspan="application.type === Enso ? 1 : 2">
                        <span :class="[
                                'tag',
                                statistics.status === 'up'
                                    ? 'is-success'
                                    : 'is-warning']
                            ">
                            {{ statistics.status }}
                        </span>
                    </td>
                </tr>
            </table>
        </card-content>
        <card-footer>
            <div class="card-footer-item has-padding-medium">
                <confirmation placement="bottom"
                    @confirm="maintenance()">
                    <a class="is-naked has-margin-left-medium">
                        <span class="icon is-small is-clickable has-margin-top-small">
                            <fa icon="power-off"
                                size="xs"/>
                        </span>
                        <span>{{ i18n('App') }}</span>
                    </a>
                </confirmation>
            </div>
            <div class="card-footer-item has-padding-medium">
                <confirmation placement="bottom"
                    @confirm="clearLog()">
                    <a class="is-naked has-margin-left-medium">
                        <span class="icon is-small is-clickable has-margin-top-small">
                            <fa icon="trash-alt"
                                size="xs"/>
                        </span>
                        <span>{{ i18n('Log') }}</span>
                    </a>
                </confirmation>
            </div>
        </card-footer>
    </card>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfoCircle, faPowerOff, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { VTooltip } from 'v-tooltip';
import {
    Card, CardCollapse, CardContent, CardControl, CardFooter,
    CardFooterItem, CardHeader, CardRefresh,
} from '@enso-ui/card/bulma';
import Confirmation from '@enso-ui/confirmation/bulma';

library.add(faTrashAlt, faPowerOff, faInfoCircle);

export default {
    name: 'Application',

    directives: { tooltip: VTooltip },

    components: {
        Card, CardHeader, CardControl, CardRefresh, CardCollapse,
        CardContent, CardFooter, CardFooterItem, Confirmation,
    },

    inject: ['i18n', 'errorHandler', 'route'],

    props: {
        application: {
            type: Object,
            required: true,
        },
        dates: {
            type: Object,
            required: true,
        },
    },

    data: () => ({
        loading: false,
        statistics: {},
        Enso: 2,
    }),

    computed:{
        params() {
            return {
                startDate: this.dates.min,
                endDate: this.dates.max,
                type: this.application.type
            };
        }
    },

    created() {
        this.fetch();
    },

    watch: {
        'dates': 'fetch',
    },

    methods: {
        request(request) {
            this.loading = true;
            request().then(() => this.loading = false)
                .catch(this.errorHandler);
        },
        fetch() {
            const request = () => axios.post(
                this.route('controlPanel.statistics', this.application.id),
                this.params,
            ).then(({ data }) => {
                this.statistics = data;
                this.$emit('loaded');
            });

            this.request(request);
        },
        maintenance() {
            const request = () => axios.post(this.route('controlPanel.maintenance', this.application.id))
                .then(({ data }) => {
                    this.statistics.status = data.status;
                });

            this.request(request);
        },
        clearLog() {
            const request = () => axios.post(this.route('controlPanel.clearLog', this.application.id))
                .then(({ data }) => {
                    this.statistics.logSize = data.logSize;
                });

            this.request(request);
        },
    },
};
</script>

<style lang="scss">
    .table.application {
        font-size: 0.9rem;

        .tag {
            font-size: 0.8rem;
            font-weight: bold;
            height: 1.4em;
        }
    }
</style>
