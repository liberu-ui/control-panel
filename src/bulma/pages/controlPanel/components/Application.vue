<template>
    <card class="is-rounded"
        collapsible
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
                <card-refresh @refresh="refresh()"/>
                <card-collapse/>
            </template>
        </card-header>
        <card-content v-if="statistics"
            class="is-paddingless">
            <div class="applications is-fullwidth is-marginless is-hoverable">
                <stats v-for="group in order(statistics)"
                    :key="group.id"
                    :group="group"/>
            </div>
        </card-content>
        <footer class="card-footer columns has-text-centered is-multiline is-marginless">
            <div class="has-padding-medium column is-4 action-item"
                 :key="link.id"
                 v-for="link in order(links)">
                <footer-link :key="link.id"
                    :link="link"/>
            </div>
        </footer>
        <footer class="card-footer columns has-text-centered is-multiline is-marginless">
            <div class="has-padding-medium column is-4 action-item"
                :key="action.id"
                v-for="action in order(actions)">
                <confirm-action :action="action"
                    :application="application"
                    @action="refresh()"/>
            </div>
        </footer>
    </card>
</template>

<script>
import { mapState } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGitlab, faPhp } from '@fortawesome/free-brands-svg-icons';
import {
    faBan, faBug, faCheckCircle, faClock, faCodeCommit,
    faCubes, faDatabase, faDownload, faExclamationCircle,
    faFileContract, faGlobeEurope, faHdd, faHourglassHalf,
    faInfoCircle, faLink, faMemory, faMicrochip, faMouseAlt,
    faPauseCircle, faPlayCircle, faPowerOff, faRocket, faServer,
    faSignInAlt, faStopwatch, faStream, faTerminal, faTimesCircle,
    faTrashAlt, faUserFriends, faUserPlus, faUsers,
} from '@fortawesome/pro-duotone-svg-icons';
import { VTooltip } from 'v-tooltip';
import {
    Card, CardCollapse, CardContent, CardControl, CardHeader, CardRefresh,
} from '@enso-ui/card/bulma';
import Stats from './Stats.vue';
import FooterLink from './FooterLink.vue';
import ConfirmAction from './ConfirmAction.vue';
import faEnso from './icons/faEnso';

library.add(
    faTrashAlt, faPowerOff, faInfoCircle, faMemory,
    faMicrochip, faHdd, faPhp, faCubes, faDatabase,
    faHourglassHalf, faExclamationCircle, faUserPlus,
    faUsers, faUserFriends, faGitlab, faCodeCommit, faServer,
    faRocket, faSignInAlt, faMouseAlt, faLink, faTimesCircle,
    faCheckCircle, faBan, faPlayCircle, faPauseCircle, faGlobeEurope,
    faServer, faEnso, faBug, faClock, faStream, faTerminal, faFileContract,
    faDownload, faStopwatch,
);

export default {
    name: 'Application',

    directives: { tooltip: VTooltip },

    components: {
        ConfirmAction,
        Card,
        CardHeader,
        CardControl,
        CardRefresh,
        CardCollapse,
        CardContent,
        Stats,
        FooterLink,
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
        statistics: [],
        dynamicLinks: [],
        actions: [],
        ongoingRequest: null,
    }),

    computed: {
        ...mapState(['enums']),
        links() {
            return [
                ...this.application.links,
                ...this.dynamicLinks,
            ];
        },
    },

    watch: {
        dates: 'refresh',
    },

    created() {
        this.loadStatistics();
    },

    methods: {
        request(request) {
            this.ongoingRequest = axios.CancelToken.source();
            this.loading = true;

            request(this.ongoingRequest.token).then(() => {
                this.loading = false;
            }).catch(this.errorHandler);
        },
        loadStatistics() {
            const request = cancelToken => this.call('controlPanel.statistics', cancelToken)
                .then(({ data }) => {
                    this.statistics = [
                        ...this.statistics,
                        ...data,
                    ];

                    this.$emit('loaded');
                }).then(() => (`${this.application.type}` === this.enums.applicationTypes.Enso
                    ? this.loadActions()
                    : this.gitlab()));

            this.request(request);
        },
        loadActions() {
            const request = cancelToken => this.call('controlPanel.actions', cancelToken)
                .then(({ data }) => {
                    this.actions = data;
                }).then(() => this.gitlab());

            this.request(request);
        },
        gitlab() {
            const request = cancelToken => this.call('controlPanel.gitlab', cancelToken)
                .then(({ data }) => this.append(data)).then(() => this.sentry());

            this.request(request);
        },
        sentry() {
            const request = cancelToken => this.call('controlPanel.sentry', cancelToken)
                .then(({ data }) => this.append(data));

            this.request(request);
        },
        append(data) {
            this.statistics = [
                ...this.statistics,
                ...data.statistics,
            ];
            this.dynamicLinks = [
                ...this.dynamicLinks,
                ...data.links,
            ];
        },
        refresh() {
            if (this.ongoingRequest) {
                this.ongoingRequest.cancel();
            }

            this.dynamicLinks = [];
            this.statistics = [];
            this.loadStatistics();
        },
        order(items) {
            return [...items].sort((i1, i2) => i1.order - i2.order);
        },
        call(route, cancelToken) {
            return axios.post(
                this.route(route, this.application.id),
                {
                    startDate: this.dates.min,
                    endDate: this.dates.max,
                    type: this.application.type,
                },
                { cancelToken },
            );
        },
    },
};
</script>

<style lang="scss">
    .applications {
        font-size: 0.9rem;
        padding-top: 30px;
        padding-bottom: 10px;
    }

    .action-item:not(:nth-child(3n)) {
        border-right: 1px solid #ededed;
    }

    .action-item {
        border-bottom: 1px solid #ededed;
    }

    .action-item:nth-child(3n + 1):nth-last-child(-n+3)
    {
        border-bottom: none;
    }

    .action-item:nth-child(3n + 2):nth-last-child(-n + 2)
    {
        border-bottom: none;
    }

    .action-item:nth-child(3n):nth-last-child(1) {
        border-bottom: none;
    }
</style>
