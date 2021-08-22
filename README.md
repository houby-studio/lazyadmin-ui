# Lazy Admin UI (lazyadmin-ui)

A Quasar Framework app

## Development

### VSCode configuration

#### Links

* <https://quasar.dev/start/vs-code-configuration>

Install extension according to guide in link.

**Required**:

* ESLint (dbaeumer.vscode-eslint)
* Vetur (octref.vetur)

**Recommended**:

* Auto Rename Tag (formulahendry.auto-rename-tag)
* Auto Close Tag (formulahendry.auto-close-tag)
* Bracket Pair Colorizer (CoenraadS.bracket-pair-colorizer)
* vscode-icons (CoenraadS.bracket-pair-colorizer)
* Sorting HTML and Jade attributes (mrmlnc.vscode-attrs-sorter)
* Vue Peek (dariofuzinato.vue-peek)

Refer to settings.json in `.vscode/settings.json` to view optimal project configuration for Visual Studio Code.

## Install the dependencies

```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Build the app and copy to Lazy Admin

Press `Ctrl+Shift+B` to trigger `powershell: copy dist files Lazy Admin` task inside VSCode.

### Lint the files

```bash
yarn run lint
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.conf.js](https://v2.quasar.dev/quasar-cli/quasar-conf-js).
