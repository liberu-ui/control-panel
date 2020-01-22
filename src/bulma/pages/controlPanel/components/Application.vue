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
        <card-content v-if="statistics"
            class="is-paddingless">
            <div class="applications is-fullwidth is-marginless is-hoverable">
                <div class="columns line">
                    <tag-stat :success="statistics.status === 'up'">
                        Http
                    </tag-stat>
                    <tag-stat v-if="isNew"
                        :success="statistics.schedule">
                        Schedule
                    </tag-stat>
                    <tag-stat v-if="isNew"
                        :success="statistics.horizon === 'running'">
                        Horizon
                    </tag-stat>
                </div>
                <div v-if="isNew"
                     class="columns line">
                    <stat icon="microchip"
                        tooltip="cpu usage">
                        {{ statistics.load }} %
                    </stat>
                    <stat icon="memory"
                        tooltip="memory usage">
                        {{ statistics.memory }} {{ statistics.memory === '-' ? '' : '%' }}
                    </stat>
                    <stat icon="hdd"
                        tooltip="free disk space">
                        {{ statistics.disk }} GB
                    </stat>
                </div>
                <div v-if="isNew"
                     class="columns line">
                    <stat icon="database"
                          tooltip="mysql version">
                        {{ statistics.mysqlVersion }}
                    </stat>
                    <stat :icon="['fab', 'php']"
                          :due-tone="false"
                          tooltip="php version">
                        {{ statistics.phpVersion }}
                    </stat>
                    <stat :icon="['fab' ,'enso']"
                          :due-tone="false"
                          tooltip="version">
                        {{ statistics.version }}
                    </stat>
                </div>
                <div class="columns line">
                    <stat v-if="isNew"
                          icon="user-plus"
                        tooltip="new users">
                        {{ statistics['new users'] | numberFormat(0) }}
                    </stat>
                    <stat icon="user-friends"
                        tooltip="active users">
                        {{ statistics.activeUsers | numberFormat(0) }}
                    </stat>
                    <stat icon="users"
                        tooltip="users">
                        {{ statistics.users | numberFormat(0) }}
                    </stat>
                </div>
                <div v-if="isNew"
                     class="columns line">
                    <div class="column">
                        <span>Jobs</span>
                    </div>
                    <stat icon="hourglass-half"
                          tooltip="pending jobs">
                        {{ statistics.jobs }}
                    </stat>
                    <stat icon="exclamation-circle"
                          tooltip="failed job">
                        {{ statistics.failedJobs }}
                    </stat>
                </div>
                <div class="columns line">
                    <stat icon="sign-in-alt"
                        tooltip="number of login">
                        {{ statistics.logins | numberFormat(0) }}
                    </stat>
                    <stat icon="link"
                          tooltip="number of sessions">
                        {{ statistics.sessions | numberFormat(0) }}
                    </stat>
                    <stat v-if="isNew"
                          icon="mouse-alt"
                          tooltip="number of sessions">
                        {{ statistics.actions | numberFormat(0) }}
                    </stat>
                </div>
                <div v-if="repository"
                    class="columns line">
                    <stat icon="exclamation-circle"
                          tooltip="issues">
                        {{ repository.project.open_issues_count | numberFormat(0) }}
                    </stat>
                    <stat icon="code-commit"
                        tooltip="last commit">
                        {{ timeFromNow(repository.lastCommit.committed_date) }}
                    </stat>
                    <div class="column" v-tooltip="'pipeline: ' + repository['pipeline']['status']">
                        <fa v-if="repository.pipeline.status === 'running'"
                            :icon="['fad', 'play-circle']"
                            class="has-text-info has-margin-right-small"/>
                        <fa v-else-if="repository.pipeline.status === 'pending'"
                            :icon="['fad', 'pause-circle']"
                            class="has-text-warning has-margin-right-small"/>
                        <fa v-else-if="repository.pipeline.status === 'success'"
                            :icon="['fad', 'check-circle']"
                            class="has-text-success has-margin-right-small"/>
                        <fa v-else-if="repository.pipeline.status === 'failed'"
                            :icon="['fad', 'times-circle']"
                            class="has-text-danger has-margin-right-small"/>
                        <fa v-else
                            :icon="['fad', 'ban']"
                            class="has-margin-right-small"/>
                        <span>{{ repository.pipeline.status }}</span>
                    </div>
                </div>
                <div class="columns line">
                    <stat icon="clock"
                        tooltip="server time">
                        {{ statistics.serverTime }}
                    </stat>
                    <stat v-if="errors"
                        icon="bug"
                        tooltip="errors"
                        class="column is-8">
                        {{ errors.events }}
                    </stat>
                </div>
            </div>
        </card-content>
        <card-footer>
            <div class="card-footer-item has-padding-medium">
                <a class="is-naked has-margin-left-medium"
                    target="_blank"
                    :href="application.forge">
                    <span class="icon is-small is-clickable has-margin-top-small">
                        <fa :icon="['fad', 'server']"
                            size="xs"/>
                    </span>
                    <span>{{ i18n('Forge') }}</span>
                </a>
            </div>
            <div class="card-footer-item has-padding-medium">
                <a class="is-naked has-margin-left-medium"
                   target="_blank"
                   :href="application.envoyer">
                    <span class="icon is-small is-clickable has-margin-top-small">
                        <fa :icon="['fad', 'rocket']"
                            size="xs"/>
                    </span>
                    <span>{{ i18n('Envoyer') }}</span>
                </a>
            </div>
            <div class="card-footer-item has-padding-medium">
                <a v-if="repository"
                   target="_blank"
                   class="is-naked has-margin-left-medium"
                   :href="repository.project.web_url">
                    <span class="icon is-small is-clickable has-margin-top-small">
                        <fa :icon="['fab', 'gitlab']"
                            size="xs"/>
                    </span>
                    <span>{{ i18n('Gitlab') }}</span>
                </a>
            </div>
        </card-footer>
        <card-footer>
            <div class="card-footer-item has-padding-medium">
                <a class="is-naked has-margin-left-medium loading"
                    target="_blank"
                    :href="errors.webUrl">
                    <span class="icon is-small is-clickable has-margin-top-small">
                        <fa :icon="['fad', 'bug']"
                            size="xs"/>
                    </span>
                    <span>{{ i18n('Sentry') }}</span>
                </a>
            </div>
            <div class="card-footer-item has-padding-medium">
                <a class="is-naked has-margin-left-medium"
                   target="_blank"
                   :href="application.url">
                    <span class="icon is-small is-clickable has-margin-top-small">
                        <fa :icon="['fab', 'enso']"
                            size="xs"/>
                    </span>
                    <span>{{ i18n('Site') }}</span>
                </a>
            </div>
        </card-footer>
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
                            <fa :icon="['fad', 'trash-alt']"
                                size="xs"/>
                        </span>
                        <span>{{ i18n('Log') }} </span>
                        <span v-if="application.type === Enso"
                            class="log-size">
                            ({{ statistics.logSize }} MB)
                        </span>
                    </a>
                </confirmation>
            </div>
        </card-footer>
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
    faGlobeEurope, faBug, faClock,
} from '@fortawesome/pro-duotone-svg-icons';
import { VTooltip } from 'v-tooltip';
import {
    Card, CardCollapse, CardContent, CardControl,
    CardHeader, CardFooter, CardRefresh,
} from '@enso-ui/card/bulma';
import Confirmation from '@enso-ui/confirmation/bulma';
import formatDistance from '@enso-ui/ui/src/modules/plugins/date-fns/formatDistance';
import Stat from './Stat.vue';
import TagStat from './TagStat.vue';
import faEnso from './icons/faEnso';

library.add(
    faTrashAlt, faPowerOff, faInfoCircle, faMemory,
    faMicrochip, faHdd, faPhp, faCubes, faDatabase,
    faHourglassHalf, faExclamationCircle, faUserPlus,
    faUsers, faUserFriends, faGitlab, faCodeCommit, faServer,
    faRocket, faSignInAlt, faMouseAlt, faLink, faTimesCircle,
    faCheckCircle, faBan, faPlayCircle, faPauseCircle, faGlobeEurope,
    faServer, faEnso, faBug, faClock,
);

export default {
    name: 'Application',

    directives: { tooltip: VTooltip },

    components: {
        Card,
        CardHeader,
        CardControl,
        CardRefresh,
        CardCollapse,
        CardContent,
        CardFooter,
        Confirmation,
        Stat,
        TagStat,
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
        repository: null,
        errors: {},
        Enso: 2,
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
        isNew() {
            return `${this.application.type}` === this.enums.applicationTypes.Enso;
        },
    },

    watch: {
        dates: 'fetch',
    },

    created() {
        this.fetch();
    },


    methods: {
        request(request) {
            this.loading = true;
            request().then(() => {
                this.loading = false;
            }).catch(this.errorHandler);
        },
        fetch() {
            const request = () => axios.post(
                this.route('controlPanel.statistics', this.application.id),
                this.params,
            ).then(({ data }) => {
                this.statistics = data;
                this.$emit('loaded');
                this.$forceUpdate();
            }).then(() => this.gitlab());

            this.request(request);
        },
        gitlab() {
            const request = () => axios.post(
                this.route('controlPanel.gitlab', this.application.id),
                this.params,
            ).then(({ data }) => {
                this.repository = data;
            }).then(() => this.sentry());

            this.request(request);
        },
        sentry() {
            const request = () => axios.post(
                this.route('controlPanel.sentry', this.application.id),
                this.params,
            ).then(({ data }) => {
                this.errors = data;
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
        timeFromNow(date) {
            return formatDistance(date);
        },
    },
};
</script>

<style lang="scss">
    .applications {
        font-size: 0.9rem;
        padding-top:10px;
        padding-bottom: 10px;

        .tag {
            font-size: 0.8rem;
            font-weight: bold;
            height: 1.4em;
        }

        .line {
            position: relative;
            font-weight: bold;
            text-align: left;
            margin-left: 0;
            margin-right: 0;
        }

        .line:not(:last-child) {
            border-bottom: 1px solid #dbdbdb;
        }
    }

    .log-size {
        font-size: 0.9rem;
        font-weight: bold;
    }
</style>
