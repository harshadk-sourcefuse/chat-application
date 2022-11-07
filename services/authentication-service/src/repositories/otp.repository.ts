﻿// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import {inject} from '@loopback/core';
import {DefaultKeyValueRepository, juggler} from '@loopback/repository';
import { Otp } from '@sourceloop/authentication-service';

import {AuthCacheSourceName} from '../types';

export class OtpRepository extends DefaultKeyValueRepository<Otp> {
  constructor(
    @inject(`datasources.${AuthCacheSourceName}`)
    dataSource: juggler.DataSource,
  ) {
    super(Otp, dataSource);
  }
}
