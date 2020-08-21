import { IStore } from 'vue-state-store';
/**
 * Contains the vuex store to be
 * injected into the vue-devtools.
 */
export declare let devtoolsVuexStore: any;
interface IDevtoolsOption {
    enableToastMessage: boolean;
}
/**
 * Starts a sync with vue-devtools.
 * Only stores created after
 * init invoke are connected to devtools.
 *
 * @param option IDevtoolsOption
 */
export declare const devtoolsInit: (option?: IDevtoolsOption) => Promise<void>;
/**
 * Connect the vue-state-store
 * to the vuex store.
 */
export declare const devtoolsBind: <T>(store: IStore<T>, storeName: string) => Promise<void>;
export {};
