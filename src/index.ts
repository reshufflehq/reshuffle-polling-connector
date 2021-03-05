import objhash from 'object-hash'
import {
  BaseConnector,
  EventConfiguration,
  Reshuffle,
} from 'reshuffle-base-connector'
import { CorePersistentStore } from "./CorePersistentStore";
import { CoreEventManager } from "./CoreEventManager";

export { Reshuffle }
export { EventConfiguration }
export { CorePersistentStore }
export { CoreEventManager }
export type Options = Record<string, any>

export type CoreEventFilter = (ec: EventConfiguration) => boolean
export type CoreEventHandler = (event: Record<string, any>) => void
export type CoreEventMapper = (ec: EventConfiguration) => any

const INTERVAL_DELAY_MS = parseInt(process.env.RESHUFFLE_INTERVAL_DELAY_MS || '30000', 10)

export class PollingConnector extends BaseConnector {
  protected eventManager = new CoreEventManager(this)
  protected store: CorePersistentStore
  protected interval?: NodeJS.Timer

  constructor(app: Reshuffle, protected options: Options, id?: string) {
    super(app, options, id)
    this.store = new CorePersistentStore(this, options)
  }

  public onStart(): void {
    const onInterval = (this as any).onInterval
    if (typeof onInterval === 'function') {
      this.interval = setInterval(onInterval.bind(this), INTERVAL_DELAY_MS)
    }
  }

  public onStop(): void {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = undefined
    }
  }

  public onRemoveEvent(event: EventConfiguration): void {
    this.eventManager.removeEvent(event)
  }

  public async onInterval(): Promise<void> {
    // implement polling logic here
  }
}