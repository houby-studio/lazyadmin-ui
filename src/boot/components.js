// Globally registers all base components.

import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

export default async ({ app }) => {
  // https://webpack.js.org/guides/dependency-management/#require-context
  const requireComponent = require.context(
    // Look for files in the current directory
    '../components',
    // Look in subdirectories
    true,
    // Match .vue viles
    /[\w-]+\.vue$/
  )

  requireComponent.keys().forEach((fileName) => {
    const componentConfig = requireComponent(fileName)

    const componentName = upperFirst(
      camelCase(
        // Gets the file name regardless of folder depth without extension
        fileName
          .split('/')
          .pop()
          .replace(/\.\w+$/, '')
      )
    )
    app.component(
      componentName,
      componentConfig.default || componentConfig
    )
  })
}
