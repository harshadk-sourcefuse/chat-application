// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';
import { AuthCacheSourceName } from '@sourceloop/core';
import { authcacheDbConfig } from './authcache.db.config';


// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class AuthcacheDataSource
  extends juggler.DataSource
  implements LifeCycleObserver {

  static dataSourceName = AuthCacheSourceName;
  static readonly defaultConfig = authcacheDbConfig;

  constructor(
    @inject('datasources.config.auditdb', {optional: true})
    dsConfig: object = {...authcacheDbConfig},
  ) {
    // Override data source config from environment variables
    Object.assign(dsConfig, {
      host: process.env.AUTH_DB_HOST,
      port: process.env.AUTH_DB_PORT,
      password: process.env.AUTH_DB_PASSWORD,
      db: process.env.AUTH_DB_DATABASE,
    });
    console.log(dsConfig);
    super(dsConfig);
  }
}
