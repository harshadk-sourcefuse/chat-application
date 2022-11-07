// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, juggler, repository } from '@loopback/repository';
import {
  DefaultSoftCrudRepository
} from '@sourceloop/core';


import { UserLevelResource, UserTenant } from '@sourceloop/authentication-service';
import { AuthDbSourceName } from '../types';
import { UserTenantRepository } from './user-tenant.repository';

export class UserLevelResourceRepository extends DefaultSoftCrudRepository<
  UserLevelResource,
  typeof UserLevelResource.prototype.id
> {
  public readonly userTenant: BelongsToAccessor<
    UserTenant,
    typeof UserLevelResource.prototype.id
  >;

  constructor(
    @inject(`datasources.${AuthDbSourceName}`)
    dataSource: juggler.DataSource,
    @repository.getter('UserTenantRepository')
    protected userTenantRepositoryGetter: Getter<UserTenantRepository>,
  ) {
    super(UserLevelResource, dataSource);
    this.userTenant = this.createBelongsToAccessorFor(
      'userTenant',
      userTenantRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userTenant',
      this.userTenant.inclusionResolver,
    );
  }
}
