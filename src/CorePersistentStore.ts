import {BaseConnector, PersistentStore, Updater} from "reshuffle-base-connector";
import objhash from "object-hash";

export class CorePersistentStore implements PersistentStore {
  private readonly prefix: string

  constructor(private connector: BaseConnector, descriptor?: Record<string, any>) {
    this.prefix = `${this.connector.constructor.name}:`
    if (descriptor) {
      this.prefix += `${objhash(descriptor)}:`
    }
  }

  private getStore() {
    return this.connector.app.getPersistentStore()
  }

  public del(key: string): Promise<void> {
    this.validateKey(key)
    return this.getStore().del(this.prefix + key)
  }

  public get(key: string): Promise<any> {
    this.validateKey(key)
    return this.getStore().get(this.prefix + key)
  }

  public async list(): Promise<string[]> {
    const array = await this.getStore().list()
    return array.filter((key) => key.startsWith(this.prefix))
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public set(key: string, value: any): Promise<any> {
    this.validateKey(key)
    this.validateValue(value)
    return this.getStore().set(this.prefix + key, value)
  }

  public async update(key: string, updater: Updater): Promise<any[]> {
    this.validateKey(key)
    return this.getStore().update(this.prefix + key, updater)
  }

  public validateKey(key: string): void {
    if (typeof key !== 'string' || key.length === 0) {
      throw new Error(`PersistentStore: Invalid key: ${key}`)
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public validateValue(value: any): void {
    if (value === undefined) {
      throw new Error(`PersistentStore: Invalid value: ${value}`)
    }
  }
}