<template>
    <div
        class="ivu-select-dropdown"
        :class="className"
        :style="styles"
    >
        <slot/>
    </div>
</template>

<script>
import Vue from 'vue';
import { getStyle } from '../../utils/assist';

const isServer = Vue.prototype.$isServer;
    const Popper = isServer ? () => {} : require('popper.js');  // eslint-disable-line

export default {
    name: 'Drop',

    props: {
        placement: {
            default: 'bottom-start',
            type: String,
        },
        className: {
            default: undefined,
            type: String,
        },
    },

    data() {
        return {
            popper: null,
            width: '',
        };
    },

    computed: {
        styles() {
            const style = {};

            if (this.width) {
                style.width = `${this.width}px`;
            }

            return style;
        },
    },

    methods: {
        update() {
            if (isServer) {
                return;
            }

            if (this.popper) {
                this.$nextTick(() => {
                    this.popper.update();
                });
            } else {
                this.$nextTick(() => {
                    this.popper = new Popper(this.$parent.$refs.reference, this.$el, {
                        gpuAcceleration: false,
                        placement: this.placement,
                        boundariesPadding: 0,
                        forceAbsolute: true,
                        boundariesElement: 'body',
                    });

                    this.popper.onCreate((popper) => {
                        this.resetTransformOrigin(popper);
                    });
                });
            }

            // set a height for parent is Modal and Select's width is 100%
            if (this.$parent.$options.name === 'iSelect') {
                this.width = Number.parseInt(getStyle(this.$parent.$el, 'width'), 10);
            }
        },

        destroy() {
            if (this.popper) {
                this.resetTransformOrigin(this.popper);

                setTimeout(() => {
                    if (this.popper) {
                        this.popper.destroy();
                        this.popper = null;
                    }
                }, 300);
            }
        },

        resetTransformOrigin(popper) {
            const placementMap = {
                top: 'bottom',
                bottom: 'top',
            };

            const placement = popper._popper.getAttribute('x-placement').split('-')[0];
            const origin = placementMap[placement];

            popper._popper.style.transformOrigin = `center ${origin}`;
        },
    },

    created() {
        this.$on('on-update-popper', this.update);
        this.$on('on-destroy-popper', this.destroy);
    },

    beforeDestroy() {
        if (this.popper) {
            this.popper.destroy();
        }
    },
};
</script>
