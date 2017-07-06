/**
 * A DataLoader with loadAll()
 * Source: https://gist.github.com/ryanspradlin/1e951a4dcf737e3fb194
 */

/* eslint-disable */

import DataLoader from 'dataloader';

type BatchLoadFn<K, V> = (keys: Array<K>) => Promise<Array<V | Error>>;

type LoadAllFn<K, V> = () => Promise<Array<[K, V]>>;

type Options<K, V> = {
  batch?: boolean,
  cache?: boolean,
  cacheMap?: CacheMap<K, Promise<V>>,
  cacheKeyFn?: (key: any) => any
};

export default class AllDataLoader<K, V> extends DataLoader<K, V> {
  _loadAllFn: LoadAllFn<K, V>;
  _shouldCache: boolean;
  _trackedKeys: Array<K>;

  constructor(
    batchLoadFn: BatchLoadFn<K, V>,
    loadAllFn: LoadAllFn<K, V>,
    options?: Options<K, V>) {

    super(batchLoadFn, options);
    this._loadAllFn = loadAllFn;
    this._shouldCache = !options || options.cache !== false;
    this._trackedKeys = [];
  }

  async loadAll(): Promise<Array<V>> {
    if (this._shouldCache && this._trackedKeys.length > 0) {
      return super.loadMany(this._trackedKeys);
    }

    const entries = await this._loadAllFn();

    const keys = new Array(entries.length);
    const values = new Array(entries.length);
    entries.forEach(
      ([key, value], index) => {
        super.prime(key, value);
        keys[index] = key;
        values[index] = value;
      }
    );

    this._trackedKeys = keys;
    return values;
  }

  clear(key: K): AllDataLoader<K, V> {
    super.clear(key);
    return this;
  }

  clearAll(): AllDataLoader<K, V> {
    this._trackedKeys = [];
    super.clearAll();
    return this;
  }
}
