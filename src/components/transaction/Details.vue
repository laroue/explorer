<template>
  <section class="page-section py-5 md:py-10 mb-5">
    <div class="px-5 sm:px-10">
      <div class="list-row-border-b">
        <div>{{ $t("Sender") }}</div>
        <div class="truncate">
          <link-wallet :address="transaction.sender" :trunc="false" />
        </div>
      </div>

      <div class="list-row-border-b">
        <div>{{ $t("Recipient") }}</div>
        <div class="truncate">
          <link-wallet :address="transaction.recipient" :type="transaction.type" :asset="transaction.asset" :trunc="false" />
        </div>
      </div>

      <div class="list-row-border-b">
        <div>{{ $t("Confirmations") }}</div>
        <div>{{ confirmations }}</div>
      </div>

      <div class="list-row-border-b">
        <div>{{ $t("Amount") }}</div>
        <div
          v-tooltip="{
            trigger: 'hover click',
            content: price ? readableCurrency(transaction.amount, price) : '',
            placement: 'left'
          }"
        >
          {{ readableCrypto(transaction.amount) }}
        </div>
      </div>

      <div class="list-row-border-b">
        <div>{{ $t("Fee") }}</div>
        <div
          v-tooltip="{
            trigger: 'hover click',
            content: price ? readableCurrency(transaction.fee, price) : '',
            placement: 'left'
          }"
        >
          {{ readableCrypto(transaction.fee) }}
        </div>
      </div>

      <div class="list-row-border-b">
        <div>{{ $t("Timestamp") }}</div>
        <div v-if="transaction.timestamp">{{ readableTimestamp(transaction.timestamp.unix) }}</div>
      </div>

      <div class="list-row-border-b-no-wrap" v-if="transaction.vendorField">
        <div class="mr-4">{{ $t("Smartbridge") }}</div>
        <div class="text-right">{{ emojify(transaction.vendorField) }}</div>
      </div>

      <div class="list-row">
        <div>{{ $t("Block") }}</div>
        <div><link-block v-if="transaction.blockId" :id="transaction.blockId">{{ transaction.blockId }}</link-block></div>
      </div>
    </div>
  </section>
</template>

<script type="text/ecmascript-6">
import CryptoCompareService from '@/services/crypto-compare'
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    initialBlockHeight: 0,
    price: 0
  }),

  props: {
    transaction: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters('currency', { currencySymbol: 'symbol' }),
    ...mapGetters('network', ['height']),

    confirmations() {
      return this.initialBlockHeight ? this.height - this.initialBlockHeight : this.transaction.confirmations
    }
  },

  watch: {
    async transaction() {
      this.updatePrice()
      this.setInitialBlockHeight()
    },

    async currencySymbol() {
      await this.updatePrice()
    },

    height(newValue, oldValue) {
      if (!oldValue) {
        this.setInitialBlockHeight()
      }
    }
  },

  methods: {
    async updatePrice() {
      this.price = await CryptoCompareService.dailyAverage(this.transaction.timestamp.unix)
    },

    setInitialBlockHeight() {
      this.initialBlockHeight = this.height - this.transaction.confirmations
    }
  }
}
</script>
