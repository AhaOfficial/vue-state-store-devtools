<img src="https://i.imgur.com/R2wksCG.png" width="400"/>

<br/>

# ⚗️ vue-state-store-devtools

> When using `vue-state-store`, experimental testing with `vue-devtools` is supported.

This project does not modify the `vue-devtools` extension, itself in an experimental attempt, but rather implements a separate library and transmits data to extension.

<br/>

## 🌎 Global

> The following multilingual documents are provided. (need pull request help)

([한국어 문서 보기](https://github.com/AhaOfficial/vue-state-store-devtools/blob/master/docs/README.KR.md))

<br/>

## 🍱 Installation

> Both Vue and Nuxt support!

<br/>

### 🥪 Install in Vue

> For those of you who want to see it as a real example using the method of applying vue-state-store, we have prepared an example of how it works in Codepen. [[Link]](https://codepen.io/hmmhmmhm/pen/xxVOwgg)

Install the script through the HTML header below.

```html
<script src="https://unpkg.com/vue-state-store-devtools@1.0.2/export/devtools.js"></script>
```

> Debugging normally is only possible for stores created after the above script has been injected.

<br/>

Before rendering the initial component, use the script below.

```js
Vue.config.devtools = true
```

> This might be work with the above method, but if it fails, the following should also be used.

<br/>

After the initial Vue component is rendered, provide `Vue` or `Vue.constructor` to DevTool as shown below, and once again enable 'devtools' option in Vue.

```js
if(typeof window.__VUE_DEVTOOLS_GLOBAL_HOOK__ != 'undefined')
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = Vue
Vue.config.devtools = true
```

<br/>

### 🍔 Install in Nuxt

> In the case of Nuxt, the project has Vuex embedded. In order to debug 'vue-state-store' through 'vue-devtools' in Nuxt, 'vue-devtools' must be removed first.

<br/>

#### 🍽 Remove Vuex

In `nuxt.config.js`, expand the settings of the Webpack in Nuxt to disable Vuex.

```js
export config = {
  build: {
    extend(config) {
      config.externals = {
        vuex: 'vuex'
      }
    }
  }
}
```

Remove the vuex related module usage codes from `nuxt.config.js` as shown below.

```js
import webpack from 'webpack'

export config = {
  build: {
    plugins: [
      new webpack.IgnorePlugin(new RegExp('/vuex/')),
    ]
  }
}
```

Remove unused Vuex and leave minimal Vuex code for Nuxt operation.

```js
config.head.script.push({
  innerHTML: 'window.vuex={Store:function(){return{replaceState:function(){}}}}',
  type: 'text/javascript',
  charset: 'utf-8'
})
```

> If `vuex` is not removed, `vuex` is installed in `vue-devtools` first, debugging information of `vue-state-store` is not registered properly.

<br/>

#### 🍝 Install Devtools

Insert the following code into `nuxt.config.js` to enable 'vue-state-store-devtools'.

```js
if (process.env.NODE_ENV !== 'production') {
  config.head.script.push({
    src: 'https://unpkg.com/vue-state-store-devtools@1.0.2/export/devtools.js'
  })
}
```

If devtools is not already enabled, add the option to Nuxt as shown below.

```js
export config = {
  vue: {
    config: {
      devtools: process.env.NODE_ENV !== 'production'
    }
  }
}
```



## 📝 License

MIT Licensed.