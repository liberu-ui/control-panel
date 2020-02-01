<template>
    <enso-table class="box is-paddingless raises-on-hover"
        id="applications"/>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCubes } from '@fortawesome/free-solid-svg-icons';
import { EnsoTable } from '@enso-ui/tables/bulma';

library.add(faCubes);

export default {
    name: 'Index',

    components: { EnsoTable },
};
</script>
