<template>
    <v-popover trigger="hover"
        placement="top"
        ref="popover"
        @hide="show = false">
        <slot/>
        <template v-slot:popover>
            <div>
                <span>{{ tooltip }}</span>
                <a v-if="! show && description"
                   href=""
                   class="show-more"
                   @click.prevent="show = true">
                    Show more ...
                </a>
                <p v-if="show">
                    {{ description }}
                </p>
            </div>
        </template>
    </v-popover>
</template>

<script>
import { VPopover } from 'v-tooltip';

export default {
    name: 'DescTooltip',

    inject: ['route', 'i18n'],

    components: { VPopover },

    props: {
        tooltip: {
            type: String,
            default: null,
        },
        description: {
            type: String,
            default: null,
        },
    },
    data() {
        return {
            show: false,
        };
    },
};
</script>
<style type="scss">
    .v-popover {
        display: inline-block;
    }
    .show-more {
        font-size: 0.6em;
    }
</style>
