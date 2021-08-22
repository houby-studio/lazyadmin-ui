<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card>
      <q-card-section>
        <div class="q-pa-md">
          <q-input
            v-model="command"
            filled
            type="textarea"
          />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="q-pa-md">
          <q-input
            v-model="response"
            filled
            type="textarea"
          />
        </div>
      </q-card-section>
      <q-card-section>
        <div class="q-pa-md">
          <q-input
            v-model="powershellData"
            filled
            type="textarea"
          />
        </div>
      </q-card-section>

      <q-separator dark />

      <q-card-actions>
        <q-btn
          label="Execute"
          type="submit"
          color="primary"
          @click="onSubmit"
        />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
          @click="onReset"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import { onMounted, onUnmounted, defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'SimplePowershell',
  setup () {
    const command = ref(null)
    const $store = useStore()

    const response = ref(null)
    const powershellData = computed({
      get: () => JSON.stringify($store.state.lazystore.powershellData),
      set: val => {
        $store.commit('lazystore/updatePowershellData', val)
      }
    })

    const onPowerShellData = (event) => {
      console.log(event)
      try {
        console.log(event.data.Data)
        response.value = event.data.Data
      } catch (error) {
        console.log('Failed to set response with error', error)
      }
      try {
        powershellData.value = event.data
      } catch (error) {
        console.log('Failed to set powershellData with error', error)
      }
    }

    onMounted(() => {
      console.log('Registering event listener for PowerShell data.')
      try {
        window.chrome.webview.addEventListener('message', (e) => { onPowerShellData(e) })
      } catch (error) {
        console.error('Failed to register event listener.')
      }
    })

    onUnmounted(() => {
      try {
        window.chrome.webview.removeEventListener('message')
      } catch (error) {
        console.warn('Failed to register event listener.')
      }
    })

    return {
      command,
      response,
      powershellData,

      onSubmit () {
        try {
          window.chrome.webview.postMessage(command.value)
        } catch (error) {
          console.error('Failed to post message to WebView.')
        }
      },

      onReset () {
        command.value = null
      }
    }
  }
})
</script>
