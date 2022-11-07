﻿// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {DefaultKeyValueRepository, juggler} from '@loopback/repository';
import { OtpCache } from '@sourceloop/authentication-service';

import {AuthCacheSourceName} from '../types';

export class OtpCacheRepository extends DefaultKeyValueRepository<OtpCache> {
  constructor(
    @inject(`datasources.${AuthCacheSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(OtpCache, dataSource);
  }
}
