// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, juggler, repository } from '@loopback/repository';
import { Tenant, TenantConfig } from '@sourceloop/authentication-service';
import {
  DefaultSoftCrudRepository
} from '@sourceloop/core';

import { AuthDbSourceName } from '../types';
import { TenantRepository } from './tenant.repository';

export class TenantConfigRepository extends DefaultSoftCrudRepository<
  TenantConfig,
  typeof TenantConfig.prototype.id,
  {}
> {
  public readonly tenant: BelongsToAccessor<
    Tenant,
    typeof TenantConfig.prototype.id
  >;

  constructor(
    @inject(`datasources.${AuthDbSourceName}`) dataSource: juggler.DataSource,
    @repository.getter('TenantRepository')
    protected tenantRepositoryGetter: Getter<TenantRepository>,
  ) {
    super(TenantConfig, dataSource);
    this.tenant = this.createBelongsToAccessorFor(
      'tenant',
      tenantRepositoryGetter,
    );
    this.registerInclusionResolver('tenant', this.tenant.inclusionResolver);
  }
}
