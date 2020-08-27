import { IStore } from 'vue-state-store'
import { Operational } from './diff'
import * as Flatted from 'flatted'

import Vue from 'vue'
import Vuex from 'vuex'
declare var window: any

/**
 * Processing points for nuxt
 */
const target: any = typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
    ? global
    : {}

/**
 * Contains the hook variable space
 * provided by the vue-devtools.
 */
const devtoolsHook = target.__VUE_DEVTOOLS_GLOBAL_HOOK__

/**
 * Contains the vuex store to be
 * injected into the vue-devtools.
 */
export let devtoolsVuexStore: any = undefined

interface IDevtoolsOption {
  enableToastMessage: boolean
}

let isTryingInit = false
let initAfterRegisterQueue: [IStore<any>, string][] = []
/**
 * Starts a sync with vue-devtools.
 * Only stores created after
 * init invoke are connected to devtools.
 * 
 * @param option IDevtoolsOption
 */
export const devtoolsInit = async (
  option: IDevtoolsOption = {
    enableToastMessage: true,
  }
) => {
  if (devtoolsVuexStore) return
  if (!devtoolsHook) return

  // For using vue obserber in vuex
  Vue.use(Vuex)

  isTryingInit = true

  try {
    if (!Vuex
      || typeof Vuex['version'] === 'undefined'
      || typeof Vuex['install'] === 'undefined'
    ) {
      if (option.enableToastMessage && target.__VUE_DEVTOOLS_TOAST__)
        target.__VUE_DEVTOOLS_TOAST__('[Vue-State-Store] Failed to import Vuex .')
      isTryingInit = false
      return
    }
  } catch (e) { }

  devtoolsVuexStore = new Vuex.Store({ strict: false })
  target.devtoolsVuexStore = devtoolsVuexStore
  injectStore(devtoolsVuexStore)

  if (option.enableToastMessage && target.__VUE_DEVTOOLS_TOAST__)
    target.__VUE_DEVTOOLS_TOAST__('Enabled Vue-State-Store')

  for (let initAfterRegisterItem of initAfterRegisterQueue)
    await devtoolsBind(initAfterRegisterItem[0], initAfterRegisterItem[1])

  initAfterRegisterQueue = []
  isTryingInit = false
}

export const devtoolsStoreMap: {
  [storeName in string]: IStore<any>
} = {}

/**
 * Connect the vue-state-store
 * to the vuex store.
 */
export const devtoolsBind = async <T>(store: IStore<T>, storeName: string) => {
  if (isTryingInit) {
    initAfterRegisterQueue.push([store, storeName])
    return
  }

  if (!devtoolsHook) return
  if (!storeName) return
  if (!devtoolsVuexStore) await devtoolsInit()
  if (!devtoolsVuexStore) return

  if (typeof devtoolsStoreMap[storeName] !== 'undefined') {
    console.warn('Vue-State-Store can track only one object value initially registered if the state store name is the same.')
    return
  }
  devtoolsStoreMap[storeName] = store

  // Dynamically register the created store.
  const moduleInstance = {
    namespaced: true,
    state: () => store.get()
  }
  devtoolsVuexStore.registerModule(storeName, moduleInstance)

  // Track the change in the value of the vue-state-store.
  let beforeData: any = undefined
  store.subscribe((changedData) => {
    let payload: any = {
      diff: {},
      stacktrace: []
    }
    let type = `${storeName}`

    try {
      const stack = traceParser(new Error('vue-state-store').stack)
      for (let i = 1; i <= 2; i++) stack.sub.shift()

      let fullStack: string[] = []
      for (let stackItem of stack.sub) {
        fullStack.push(`${stackItem.functionName} (${stackItem.fileName}:${stackItem.lineNumber}${stackItem.columnNumber})`)
      }

      payload.stacktrace = fullStack
      type = `${type} Mutation`
    } catch (e) { }

    // Reflects the value of the vue-state-store
    // changedData in the proxy of the vuex .
    devtoolsVuexStore.state[storeName] = changedData

    // The value that is caught overlapping Proxy is
    // shared between vuex and vue-state-store .
    devtoolsVuexStore.replaceState(devtoolsVuexStore.state)

    // If it is the first value, it does not generate an event.
    if (beforeData === undefined) {
      beforeData = Flatted.parse(Flatted.stringify(changedData))
      return
    }

    // Apply the changed value.
    try {
      const diff = Operational.diff(beforeData, changedData)
      if (diff) {
        payload.diff = Operational.changelogs(diff, beforeData)
        // payload.diffFormatted = `${Operational.changelogsFormatted({
        //   diff,
        //   format: 'console',
        //   original: beforeData
        // })})`
      }
    } catch (e) { }

    // Backup Before Data
    beforeData = Flatted.parse(Flatted.stringify(changedData))

    devtoolsHook.emit('vuex:mutation', {
      payload,
      type,
    })
  })
}

/**
 * Insert the store into the Devtool.
 */
const injectStore = (store) => {
  const hook = devtoolsHook

  // * Force vuex:init sequence.
  hook.store = store
  hook.initialState = JSON.parse(JSON.stringify(store.state))
  const origReplaceState = store.replaceState.bind(store)
  store.replaceState = state => {
    hook.initialState = JSON.parse(JSON.stringify(state))
    origReplaceState(state)
  }
  // Dynamic modules
  let origRegister, origUnregister
  if (store.registerModule) {
    hook.storeModules = []
    origRegister = store.registerModule.bind(store)
    store.registerModule = (path, module, options) => {
      if (typeof path === 'string') path = [path]
      hook.storeModules.push({ path, module, options })
      origRegister(path, module, options)
    }
    origUnregister = store.unregisterModule.bind(store)
    store.unregisterModule = (path) => {
      if (typeof path === 'string') path = [path]
      const key = path.join('/')
      const index = hook.storeModules.findIndex(m => m.path.join('/') === key)
      if (index !== -1) hook.storeModules.splice(index, 1)
      origUnregister(path)
    }
  }
  hook.flushStoreModules = () => {
    store.replaceState = origReplaceState
    if (store.registerModule) {
      store.registerModule = origRegister
      store.unregisterModule = origUnregister
    }
    return hook.storeModules || []
  }
}

const traceParser = (input) => {
  let parse = {
    main: {} as any,
    sub: [] as any
  }

  let context1 = input.split(`\r`).join(``)
  context1 = context1.split('Error: ')
  let head = context1[0].split(`\n`)

  let context2 = head[0].split(':')
  let lineNumber = context2.pop()
  let fileName = context2.join(':')
  let lineText = head[1]

  let context3 = context1[1].split(`\n`)
  let text = context3.shift()

  context3 = context3.join(`\n`).split(`at `)

  // Add Main Error Stack
  parse.main = {
    text,
    fileName,
    lineNumber,
    lineText
  }

  for (let subContext of context3) {
    let context4 = subContext.split(` (`)
    let functionName = context4.shift()
    let typeName = ``
    let methodName = ``
    let context6 = functionName.split('.')
    if (context6.length == 1) {
      methodName = context6[0]
    } else {
      methodName = context6.pop()
      typeName = context6.join('.')
    }

    let context5 = context4.join('').split(`)`)
    context5.pop()
    context5 = context5.join(`)`).split(':')
    let columnNumber = context5.pop()
    let lineNumber = context5.pop()
    let fileName = context5.join(':')

    if (fileName.length != 0) {
      // Add Sub Error Stack
      parse.sub.push({
        functionName,
        typeName,
        methodName,

        columnNumber,
        lineNumber,
        fileName
      })
    } else {
      if (subContext.split(' ').join('').length != 0)
        parse.main.text += subContext
    }
  }
  return parse
}