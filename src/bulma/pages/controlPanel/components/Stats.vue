<template>
    <div class="columns is-multiline line">
        <div class="line-group">
            {{ i18n(group) }}
        </div>
        <stat v-for="(stat, index) in stats"
            :stat="stat"
            :key="JSON.stringify(stat.icon) + index"/>
    </div>
</template>

<script>
import Stat from './Stat.vue';

export default {
    name: 'Stats',

    inject: ['i18n'],

    components: { Stat },

    props: {
        group: {
            type: String,
            required: true,
        },
        stats: {
            type: Array,
            required: true,
        },
    },
};
</script>

<style lang="scss">
    .line {
        position: relative;
        font-weight: bold;
        text-align: left;
        margin-left: 0;
        margin-right: 0;
        padding-left: 15px;
    }

    .line {
        border-top: 1px solid #dbdbdb;
    }

    .line-group {
        position: absolute;
        top: -11px;
        left: 5px;
        background: white;
        padding-left:5px;
        padding-right:5px;
    }
</style>
