﻿// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { inject } from '@loopback/core';
import { juggler } from '@loopback/repository';
import { AuthClient } from '@sourceloop/authentication-service';
import { DefaultSoftCrudRepository } from '@sourceloop/core';

import { AuthDbSourceName } from '../types';

export class AuthClientRepository extends DefaultSoftCrudRepository<
  AuthClient,
  typeof AuthClient.prototype.id
> {
  constructor(
    @inject(`datasources.${AuthDbSourceName}`) dataSource: juggler.DataSource,
  ) {
    super(AuthClient, dataSource);
  }
}
