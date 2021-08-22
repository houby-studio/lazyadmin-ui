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
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'SimplePowershell',
  setup () {
    const command = ref(null)

    return {
      command,

      onSubmit () {
        alert(command.value)
        window.chrome.webview.postMessage(command.value)
      },

      onReset () {
        command.value = null
      }
    }
  }
})
</script>
