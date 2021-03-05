import {BaseConnector, EventConfiguration} from "reshuffle-base-connector";
import objhash from "object-hash";
import {CoreEventFilter, CoreEventHandler, CoreEventMapper, Options} from "./index";

export class CoreEventManager {
  eventConfigurationSet: Record<string, EventConfiguration> = {}

  constructor(private connector: BaseConnector) {}

  public addEvent(
    eventOptions: Options,
    handler: CoreEventHandler,
    eventId: string | Record<string, any>,
  ): EventConfiguration {
    const id =
      typeof eventId === 'string'
        ? eventId
        : `${this.connector.constructor.name}:${objhash(eventId)}:${this.connector.id}`
    const ec = new EventConfiguration(id, this.connector, eventOptions)
    this.eventConfigurationSet[ec.id] = ec
    this.connector.app.when(ec, handler as any)
    return ec
  }

  public removeEvent(ec: EventConfiguration): void {
    delete this.eventConfigurationSet[ec.id]
  }

  public mapEvents(mapper: CoreEventMapper): any[] {
    return Object.values(this.eventConfigurationSet)
      .map(mapper)
      .sort()
      .filter((e, i, a) => i === a.indexOf(e)) // unique
  }

  public async fire(filter: CoreEventFilter, events: any | any[]): Promise<void> {
    const evs = Array.isArray(events) ? events : [events]
    const ecs = Object.values(this.eventConfigurationSet).filter(filter)
    for (const ec of ecs) {
      for (const ev of evs) {
        await this.connector.app.handleEvent(ec.id, ev)
      }
    }
  }
}