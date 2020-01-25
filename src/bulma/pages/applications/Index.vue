<template>
    <enso-table class="box is-paddingless raises-on-hover"
        id="applications"
        @panel="$router.push({ name: 'controlPanel.index' })"/>
</template>

<script>
import { EnsoTable } from '@enso-ui/bulma';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCubes } from '@fortawesome/free-solid-svg-icons';

library.add(faCubes);

export default {
    name: 'Index',

    components: { EnsoTable },
};

</script>
