<template>
    <div>
        <div class="md-modal modal-msg md-modal-transition " v-bind:class="{'md-show':mdShow}">
            <div class="md-modal-inner">
                <div class="md-top">
                    <!-- <div class="md-title">用户登录提醒</div> -->
                    <button class="md-close" @click="closeModal">Close</button>
                </div>
                <div class="md-content">
                    <div class="confim-tips">
                        <slot name="message"></slot>
                    </div>
                    <div class="btn-wrap">
                        <slot name="btnGroup"></slot>
                    </div>
                </div>
            </div>
        </div>
        <div class="md-overlay" v-show="mdShow" @click="closeModal"></div>
    </div>
</template>

<script>
    export default {
        props: ['mdShow'],
        data() {
            return {
                msg: ''
            }
        },

        methods: {
            closeModal(){
                this.$emit('close')
            }
        },
    }

</script>