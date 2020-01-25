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
                <card-refresh @refresh="loadStatistics"/>
                <card-collapse/>
            </template>
        </card-header>
        <card-content v-if="statistics"
            class="is-paddingless">
            <div class="applications is-fullwidth is-marginless is-hoverable">
                <stats v-for="(stats, group) in statistics"
                    :key="group"
                    :group="group"
                    :stats="stats">
                </stats>
            </div>
        </card-content>
        <card-footer>
            <!-- use camelCase after adding an application resource in BE -->
            <!-- after adding the be resource we should render footer-link dynamically. We can have an empty tab (the two lines can be equal) -->
            <footer-link :href="application.forge_url"
                :icon="['fad', 'server']"
                :label="i18n('Forge')"
                v-if="application.forge_url">
            </footer-link>
            <footer-link :href="application.envoyer_url"
                :icon="['fad', 'rocket']"
                :label="i18n('Envoyer')"
                v-if="application.envoyer_url">
            </footer-link>
            <footer-link :href="gitlabUrl"
                :icon="['fab', 'gitlab']"
                :label="i18n('Gitlab')"
                v-if="gitlabUrl">
            </footer-link>
        </card-footer>
        <card-footer>
            <footer-link :href="sentryUrl"
                :icon="['fad', 'bug']"
                :label="i18n('Sentry')"
                v-if="sentryUrl">
            </footer-link>
            <footer-link :href="application.url"
                :icon="['fab', 'enso']"
                :label="i18n('Site')"
                v-if="application.url">
            </footer-link>
        </card-footer>
        <footer class="card-footer columns has-text-centered is-multiline is-marginless">
            <div class="has-padding-medium column is-4 action-item"
                :key="key"
                v-for="(action, key) in actions">
                <confirm-action :action-key="key"
                    :action="action"
                    :application="application"
                    @action="loadStatistics()"/>
            </div>
        </footer>
    </card>
</template>

<script>
import { mapState } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faPhp, faGitlab } from '@fortawesome/free-brands-svg-icons';
import {
    faServer, faDatabase, faUserPlus, faUserFriends, faUsers,
    faInfoCircle, faPowerOff, faTrashAlt, faMemory, faMicrochip,
    faHdd, faCubes, faHourglassHalf, faExclamationCircle,
    faRocket, faSignInAlt, faLink, faTimesCircle, faCheckCircle,
    faBan, faPlayCircle, faPauseCircle, faCodeCommit, faMouseAlt,
    faGlobeEurope, faBug, faClock, faStream, faTerminal, faFileContract,
    faDownload,
} from '@fortawesome/pro-duotone-svg-icons';
import { VTooltip } from 'v-tooltip';
import {
    Card, CardCollapse, CardContent, CardControl,
    CardHeader, CardFooter, CardRefresh,
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
    faDownload,
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
        CardFooter,
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
        statistics: {},
        actions: {},
        gitlabUrl: null,
        sentryUrl: null,
        errors: {},
    }),

    computed: {
        ...mapState(['enums']),
        params() {
            return {
                startDate: this.dates.min,
                endDate: this.dates.max,
                type: this.application.type,
            };
        },
    },

    watch: {
        dates: 'loadStatistics',
    },

    created() {
        this.loadStatistics();
    },

    methods: {
        request(request) {
            this.loading = true;

            request().then(() => {
                this.loading = false;
            }).catch(this.errorHandler);
        },
        loadStatistics() {
            const request = () => axios.post(
                this.route('controlPanel.statistics', this.application.id),
                this.params,
            ).then(({ data }) => {
                this.statistics = {
                    ...this.statistics,
                    ...data,
                };
                this.$emit('loaded');
            }).then(() => {
                if (`${this.application.type}` === this.enums.applicationTypes.Enso) {
                    return this.loadActions();
                }

                this.gitlab();
            });

            this.request(request);
        },
        loadActions() {
            const request = () => axios.post(
                this.route('controlPanel.actions', this.application.id),
                this.params,
            ).then(({ data }) => {
                this.actions = data;
            }).then(() => this.gitlab());

            this.request(request);
        },
        gitlab() {
            const request = () => axios.post(
                this.route('controlPanel.gitlab', this.application.id),
                this.params,
            ).then(({ data }) => {
                this.statistics = {
                    ...this.statistics,
                    ...data.statistics,
                };

                this.gitlabUrl = data.url;
            })
            // .then(() => this.sentry())
            ;

            this.request(request);
        },
        sentry() {
            const request = () => axios.post(
                this.route('controlPanel.sentry', this.application.id),
                this.params,
            ).then(({ data }) => {
                this.statistics = {
                    ...this.statistics,
                    ...data.statistics,
                };

                this.sentryUrl = data.url;
            });

            this.request(request);
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
        margin: auto !important;
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
