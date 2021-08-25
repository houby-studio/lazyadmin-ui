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

    <div class="q-pa-md">
      <q-table
        title="Runspaces"
        :rows="rows"
        :columns="columns"
        hide-pagination
        row-key="uid"
        ref="runspacestables"
      />
    </div>
  </div>
</template>

<script>
import { onMounted, onUnmounted, defineComponent, ref, computed } from 'vue'
import { useStore } from 'vuex'
import { uid } from 'quasar'

export default defineComponent({
  name: 'SimplePowershell',
  setup () {
    const columns = [
      // {
      //   name: 'name',
      //   required: true,
      //   align: 'left',
      //   field: row => row.name,
      //   format: val => `${val} SAD!`,
      //   sortable: true
      // },
      { name: 'uid', align: 'center', label: 'UID', field: 'uid', sortable: true },
      { name: 'status', label: 'Status', field: 'status', sortable: true },
      { name: 'result', label: 'Result', field: 'result', sortable: true }
    ]

    const runspacestables = ref(null)
    const rows = ref([])

    rows.value.push({
      uid: '123',
      status: 'SAD!',
      result: 'unknown'
    })

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
      if (event.data.Type === 'runespacestatus') {
        onRunespaceStatus(event.data)
      } else {
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
    }

    const onRunespaceStatus = (data) => {
      console.log('Called runspace status change!')
      console.log('Finding row with uid', data.Uid)
      console.log('Replacing status with status', data.Status)
      console.log('Current table', runspacestables.value)
      const table = runspacestables.value.rows.find(row => row[runspacestables.value.rowKey] === data.Uid)
      table.status = data.Status
      // rows.value[data.Uid].status = data.Status
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
      runspacestables,
      columns,
      rows,
      command,
      response,
      powershellData,

      onSubmit () {
        if (command.value === null) {
          return
        }
        try {
          const jsonMessage = {
            id: uid(),
            token: uid(),
            command: command.value
          }
          window.chrome.webview.postMessage(jsonMessage)
          rows.value.push({
            status: 'Starting',
            uid: jsonMessage.id,
            result: 'null'
          })
        } catch (error) {
          console.error('Lazy Admin error: Failed to post message from UI to C# backend. Caught error:', error.message)
        }
      },

      onReset () {
        runspacestables.value.rows.find(row => row[runspacestables.value.rowKey] === '123').status = '321'
        command.value = null
      }
    }
  }
})
</script>
