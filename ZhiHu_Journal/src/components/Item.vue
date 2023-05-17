<template>
    <div class="newsItem">
        <router-link :to="`/detail/${data.id}`">
            <div class="imgBox">
                <img 
                v-if="data.images && data.images.length > 0" 
                v-lazy="data.images[0]"
                >
            </div>
            <h4 class="title">{{ data.title }}</h4>
            <p class="desc">{{ data.hint }}</p>
        </router-link>
    </div>
</template>

<script>
export default {
    name: 'Item',
    props: {
        data: {
            type: Object,
            required: true
        }
    }
}
</script>

<style lang="less" scoped>
    .newsItem {
        box-sizing: border-box;
        position: relative;
        padding: 15px 0;
        height: 95px;
        overflow: hidden;

        a {
            display: block;
        }

        .imgBox {
            position: absolute;
            right: 0;
            top: 15px;
            width: 65px;
            height: 65px;
            background: #d5d5d5;

            img {
                display: block;
                width: 100%;
                height: 100%;
            }
        }

        .title {
            margin-right: 75px;
            max-height: 50px;
            line-height: 25px;
            font-size: 16px;
            color: #000;
            overflow: hidden;
        }

        .desc {
            margin-right: 75px;
            line-height: 15px;
            font-size: 12px;
            color: #999;
        }
    }
</style>