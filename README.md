# reshuffle-polling-connector

### Reshuffle Polling Connector

This connector allows polling an external service periodically, and potentially firing events based on the results of the polling action.

A good use-case for a polling connector is for systems that do not provide a push (e.g. webhook) mechanism. In such systems, you'll need to poll periodically to capture changes and operate upon them.


For example - you can use the polling connector to sample an S3 bucket for changes in its file list, and fire a relevant event using `on`when a file is added or deleted.

Normally, the connector will need to compare current and previous state of external data. This package provides a simple persistent store to allow for that.
#### Configuration Options:

The only configuration this connector exposes is the polling interval.

`RESHUFFLE_INTERVAL_DELAY_MS` (defaults to 30000)

To define a polling interval set the `RESHUFFLE_INTERVAL_DELAY_MS` environment variable (in milliseconds).
The connector will fire its `onInterval()` function at `RESHUFFLE_INTERVAL_DELAY_MS` intervals.


## Get started
To implement a new polling connector, create a new class extending the `PollingConnector` class from this package.

Example:
```js
import { PollingConnector } from 'reshuffle-polling-connector'

class MyCustomPollingConnector extends PollingConnector<MyConnectorConfigOptions, MyConnectorEventOptions> {
    
  constructor(app, options, id /* your custom options */) {
    super(app, options, id)
    // ...
  }
  
  async onInterval(): Promise<void> {
    // Implement custom polling logic
  }

  // Functions below belong to Reshuffle Base Connector which the Polling connector extends
  // See https://github.com/reshufflehq/reshuffle-base-connector
  
  onStart() {
    // ...
  }

  onStop() {
    // ...
  }

  on(options: EventOptionsType, eventId: EventConfiguration['id']): EventConfiguration {
    // ...
  }

}
```