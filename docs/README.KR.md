<img src="https://i.imgur.com/R2wksCG.png" width="400"/>

<br/>

# ⚗️ vue-state-store-devtools

>   `vue-state-store`를 사용시 실험적으로 `vue-devtools`  를 통한 테스팅을 지원합니다.

이 프로젝트는 실험적인 시도로 `vue-devtools` 익스텐션 자체를 수정하지 않고, 임의로 별개 라이브러리를 구현해서 데이터를 전송하는 방식을 사용합니다.

<br/>

## 🍱 설치방법

> Vue 와 Nuxt 를 모두 지원합니다!

<br/>

### 🥪 Vue 의 경우

> `vue-state-store`를 적용시키는 방법을 사용한 실제 예시로 보고 싶으신 분들을 위해서, Codepen 에서 동작하는 예시를 준비하였습니다. [[링크]](https://codepen.io/hmmhmmhm/pen/xxVOwgg)

아래 HTML 헤더를 통해서 스크립트를 설치합니다.

```html
<script src="https://unpkg.com/vue-state-store-devtools@1.0.2/export/devtools.js"></script>
```

> 위 스크립트가 주입된 후 생성된 스토어에 한해서만 정상적으로 디버깅이 가능합니다.

<br/>

아래 스크립트를 최초 컴포넌트를 렌더링 하기 전 미리 불러줍니다.

```js
Vue.config.devtools = true
```

> 위 방법만으로도 실행될 수 있으나, 만약 실패한다면 아래 내용도 사용해야 합니다.

<br/>

최초 Vue 컴포넌트가 렌더링 된 후 아래와 같이 `Vue` 또는 `Vue.constructor` 를 데브툴에 제공한 후 다시한 번 Vue 에서 `devtools` 옵션을 활성화 합니다.

```js
if(typeof window.__VUE_DEVTOOLS_GLOBAL_HOOK__ != 'undefined')
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.Vue = Vue
Vue.config.devtools = true
```

<br/>

### 🍔 Nuxt 의 경우

> Nuxt 의 경우 프로젝트에 Vuex 가 내장되어 있습니다. Nuxt에서 `vue-devtools` 를 통한  `vue-state-store` 의 디버깅을 하려는 경우 먼저 `vue-devtools` 를 기존에 사용 중인  `Vuex` 를 제거해야합니다.

<br/>

#### 🍽 Vuex 제거

`nuxt.config.js` 에서 Nuxt 내 Webpack 의 설정을 확장해서 Vuex 가 내장되지 않도록 설정합니다.

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

아래와 같이 `nuxt.config.js` 에서 vuex 관련 모듈 사용코드들을 제거합니다.

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

사용하지 않는 Vuex 를 제거한 후 Nuxt 의 작동을 위한 Vuex 최소한의 코드만 남깁니다.

```js
config.head.script.push({
  innerHTML: 'window.vuex={Store:function(){return{replaceState:function(){}}}}',
  type: 'text/javascript',
  charset: 'utf-8'
})
```

> 만약 `vuex` 를 제거하지 않는다면 `vuex` 가 `vue-devtools` 에 먼저 설치되어서 `vue-state-store` 의 디버깅 정보가 제대로 등록되지 않습니다.

<br/>

#### 🍝 Devtools 설치

`nuxt.config.js` 에 아래와 같은 코드를 넣어서 `vue-state-store-devtools` 가 작동가능하도록 합니다.

```js
if (process.env.NODE_ENV !== 'production') {
  config.head.script.push({
    src: 'https://unpkg.com/vue-state-store-devtools@1.0.2/export/devtools.js'
  })
}
```

만약 아직 devtools 가 활성화 되지 않는다면 아래와 같이 Nuxt 에 옵션을 추가합니다.

```js
export config = {
  vue: {
    config: {
      devtools: process.env.NODE_ENV !== 'production'
    }
  }
}
```



## 📝 라이센스

MIT Licensed.