<template>
    <div class="column">
        <span :class="[
            'tag', success ? 'is-success' : 'is-warning'
        ]">
            <slot/>
        </span>
    </div>
</template>

<script>
import { VTooltip } from 'v-tooltip';

export default {
    name: 'TagStat',

    directives: { tooltip: VTooltip },

    props: {
        success: {
            type: Boolean,
            required: true,
            default: false,
        },
    },
};

</script>
