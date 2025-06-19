import { reactive } from "vue"
import { useRuntimeConfig } from "#app"

interface Plugin {
  id: string
  name: string
  version: string
  description: string
  enabled: boolean
  options: Record<string, any>
}

interface ExtensionPoint {
  id: string
  handlers: Array<{
    pluginId: string
    handler: (...args: any[]) => any
  }>
}

const plugins = reactive<Record<string, Plugin>>({})
const extensionPoints = reactive<Record<string, ExtensionPoint>>({})

export function usePluginRegistry() {
  const config = useRuntimeConfig().public.core

  const registerPlugin = (plugin: Plugin) => {
    if (plugins[plugin.id]) {
      if (config.debug) {
        console.warn(`Plugin ${plugin.id} is already registered`)
      }
      return false
    }

    plugins[plugin.id] = plugin
    if (config.debug) {
      console.log(`Plugin ${plugin.id} registered successfully`)
    }
    return true
  }

  const enablePlugin = (pluginId: string) => {
    if (!plugins[pluginId]) {
      return false
    }
    plugins[pluginId].enabled = true
    return true
  }

  const disablePlugin = (pluginId: string) => {
    if (!plugins[pluginId]) {
      return false
    }
    plugins[pluginId].enabled = false
    return true
  }

  const registerExtensionPoint = (id: string) => {
    if (!extensionPoints[id]) {
      extensionPoints[id] = {
        id,
        handlers: [],
      }
    }
    return extensionPoints[id]
  }

  const registerExtensionHandler = (extensionPointId: string, pluginId: string, handler: (...args: any[]) => any) => {
    if (!plugins[pluginId]) {
      if (config.debug) {
        console.warn(`Cannot register extension for unknown plugin ${pluginId}`)
      }
      return false
    }

    const extensionPoint = registerExtensionPoint(extensionPointId)
    extensionPoint.handlers.push({
      pluginId,
      handler,
    })

    return true
  }

  const executeExtension = async (extensionPointId: string, ...args: any[]) => {
    if (!extensionPoints[extensionPointId]) {
      return []
    }

    const results = []
    for (const { pluginId, handler } of extensionPoints[extensionPointId].handlers) {
      if (plugins[pluginId]?.enabled) {
        try {
          results.push(await handler(...args))
        } catch (error) {
          if (config.debug) {
            console.error(`Error executing extension from plugin ${pluginId}:`, error)
          }
        }
      }
    }

    return results
  }

  return {
    plugins,
    extensionPoints,
    registerPlugin,
    enablePlugin,
    disablePlugin,
    registerExtensionPoint,
    registerExtensionHandler,
    executeExtension,
  }
}
