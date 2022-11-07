// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { Getter, inject } from '@loopback/core';
import { BelongsToAccessor, juggler, repository } from '@loopback/repository';
import {
  DefaultSoftCrudRepository
} from '@sourceloop/core';


import { UserLevelPermission, UserTenant } from '@sourceloop/authentication-service';
import { AuthDbSourceName } from '../types';
import { UserTenantRepository } from './user-tenant.repository';

export class UserLevelPermissionRepository extends DefaultSoftCrudRepository<
  UserLevelPermission,
  typeof UserLevelPermission.prototype.id
> {
  public readonly userTenant: BelongsToAccessor<
    UserTenant,
    typeof UserLevelPermission.prototype.id
  >;

  constructor(
    @inject(`datasources.${AuthDbSourceName}`)
    dataSource: juggler.DataSource,
    @repository.getter('UserTenantRepository')
    protected userTenantRepositoryGetter: Getter<UserTenantRepository>,
  ) {
    super(UserLevelPermission, dataSource);
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
