<template>
    <card class="is-rounded"
        collapsible>
        <card-header class="has-background-light">
            <template #title>
                <span class="mr-3">
                    {{ app.name }}
                </span>
                <span class="tag is-small application-type"
                    :class="isEnso ? 'is-success' : 'is-warning'">
                    {{ enums.applicationTypes._get(app.type) }}
                </span>
            </template>
            <template #controls>
                <card-control>
                    <span class="icon is-small"
                        v-tooltip="i18n(app.description)">
                        <fa icon="info-circle"/>
                    </span>
                </card-control>
                <card-refresh @refresh="refresh"/>
                <card-collapse/>
            </template>
        </card-header>
        <card-content class="p-2">
            <div class="app mb-3">
                <stats v-for="group in orderedStats"
                    :key="group.id"
                    :group="group"/>
            </div>
        </card-content>
        <card-footer v-for="(chunk, index) in chunkedLinks"
            :key="`link-${index}`">
            <card-footer-item class="p-2"
                v-for="link in chunk"
                :key="link.id">
                <footer-link :key="link.id"
                    :link="link"/>
            </card-footer-item>
        </card-footer>
        <card-footer v-for="(chunk, index) in chunkedActions"
            :key="`action-${index}`">
            <card-footer-item class="p-2"
                v-for="action in chunk"
                :key="action.id">
                <footer-action :key="action.id"
                    :action="action"
                    :app="app"
                    @action-successful="refresh"/>
            </card-footer-item>
        </card-footer>
    </card>
</template>

<script>
import 'v-tooltip/dist/v-tooltip.css';
import { VTooltip } from 'v-tooltip';
import { mapState } from 'vuex';
import { FontAwesomeIcon as Fa } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faGitlab, faPhp, faUbuntu } from '@fortawesome/free-brands-svg-icons';
import {
    faBan, faBug, faCheckCircle, faClock, faCodeCommit, faCubes, faDatabase, faDownload,
    faExclamationCircle, faFileContract, faGlobeEurope, faHdd, faHourglassHalf,
    faInfoCircle, faLink, faMemory, faMicrochip, faMouseAlt, faPauseCircle, faPlayCircle,
    faPowerOff, faRocket, faSignInAlt, faStopwatch, faStream, faTerminal, faTimesCircle,
    faTrashAlt, faUserFriends, faUserPlus, faUsers,
} from '@fortawesome/pro-duotone-svg-icons';
import {
    Card, CardCollapse, CardContent, CardControl, CardHeader,
    CardRefresh, CardFooter, CardFooterItem,
} from '@liberu-ui/card/bulma';
import Stats from './Stats.vue';
import FooterLink from './FooterLink.vue';
import FooterAction from './FooterAction.vue';
import faEnso from './icons/faEnso';
import faForge from './icons/faForge';

library.add(
    faBan, faBug, faCheckCircle, faClock, faCodeCommit, faCubes, faDatabase, faDownload,
    faExclamationCircle, faFileContract, faGlobeEurope, faHdd, faHourglassHalf,
    faInfoCircle, faLink, faMemory, faMicrochip, faMouseAlt, faPauseCircle, faPlayCircle,
    faPowerOff, faRocket, faSignInAlt, faStopwatch, faStream, faTerminal, faTimesCircle,
    faTrashAlt, faUserFriends, faUserPlus, faUsers, faPhp, faUbuntu, faGitlab, faEnso, faForge,
);

export default {
    name: 'Application',

    directives: { tooltip: VTooltip },

    components: {
        Fa,
        FooterAction,
        Card,
        CardHeader,
        CardControl,
        CardRefresh,
        CardCollapse,
        CardContent,
        CardFooter,
        CardFooterItem,
        Stats,
        FooterLink,
    },

    inject: ['http', 'i18n', 'errorHandler', 'route'],

    props: {
        app: {
            type: Object,
            required: true,
        },
        dateInterval: {
            type: Object,
            required: true,
        },
    },

    emits: ['loaded'],

    data: () => ({
        loading: false,
        stats: [],
        summary: {
            logins: 0,
            requests: 0,
            newUsers: 0,
            sessions: 0,
        },
        dynamicLinks: [],
        dynamicActions: [],
        ongoingRequest: null,
    }),

    computed: {
        ...mapState(['enums']),
        isEnso() {
            return this.app.type === Number(this.enums.applicationTypes.Enso);
        },
        params() {
            return {
                startDate: this.dateInterval.min,
                endDate: this.dateInterval.max,
                type: this.app.type,
            };
        },
        orderedStats() {
            return [...this.stats].sort(this.sort);
        },
        chunkedLinks() {
            return this.chunks([...this.links].sort(this.sort));
        },
        chunkedActions() {
            return this.chunks([...this.dynamicActions].sort(this.sort));
        },
        links() {
            return [...this.app.links, ...this.dynamicLinks];
        },
    },

    watch: {
        dateInterval: 'refresh',
    },

    created() {
        this.fetch();
    },

    methods: {
        fetch() {
            this.statistics();
            this.actions();
            this.gitlab();
            this.sentry();
        },
        statistics() {
            this.http.get(
                this.route('controlPanel.statistics', this.app.id),
                { params: this.params },
            ).then(({ data }) => {
                this.stats = [...this.stats, ...data];
                this.updateSummary();
                this.$emit('loaded');
            }).catch(this.errorHandler);
        },
        actions() {
            if (this.isEnso && this.dynamicActions.length === 0) {
                this.http.get(this.route('controlPanel.actions', this.app.id))
                    .then(({ data }) => (this.dynamicActions = data))
                    .catch(this.errorHandler);
            }
        },
        gitlab() {
            if (this.app.gitlab) {
                this.http.get(this.route('controlPanel.gitlab', this.app.id))
                    .then(({ data }) => this.merge(data))
                    .catch(this.errorHandler);
            }
        },
        sentry() {
            if (this.app.sentry) {
                this.http.get(this.route('controlPanel.sentry', this.app.id))
                    .then(({ data }) => this.merge(data))
                    .catch(this.errorHandler);
            }
        },
        merge({ groups, links }) {
            this.stats = [...this.stats, ...groups];
            this.dynamicLinks = [...this.dynamicLinks, ...links];
        },
        refresh() {
            this.dynamicLinks = [];
            this.stats = [];
            this.fetch();
        },
        sort(first, second) {
            return first.order - second.order;
        },
        chunks(items) {
            const chunkSize = 3;
            const chunkCount = Math.ceil(items.length / chunkSize);

            return Array.from({ length: chunkCount }, (value, index) => items
                .slice(index * chunkSize, index * chunkSize + chunkSize));
        },
        updateSummary() {
            Object.keys(this.summary)
                .forEach(key => (this.summary[key] = Number(this.sensor(key))));
        },
        sensor(key) {
            const index = this.stats
                .findIndex(({ sensors }) => sensors.some(({ id }) => id === key));

            return index >= 0
                ? this.stats[index].sensors.find(({ id }) => id === key).value
                : 0;
        },
    },
};
</script>

<style lang="scss">
    .action-item:not(:nth-child(3n)) {
        border-right: 1px solid #ededed;
    }

    .application-type.tag {
        font-size: 0.8rem;
        font-weight: bold;
        height: 1.4em;
        padding-left: 0.4em;
        padding-right: 0.4em;
        -webkit-box-shadow: 0 1px 1px rgba(10, 10, 10, 0.2);
        box-shadow: 0 1px 1px rgba(10, 10, 10, 0.2);
    }
</style>
