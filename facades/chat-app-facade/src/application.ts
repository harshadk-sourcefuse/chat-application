// Copyright (c) 2022 Sourcefuse Technologies
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
import { BootMixin } from '@loopback/boot';
import { ApplicationConfig } from '@loopback/core';
import { RepositoryMixin } from '@loopback/repository';
import { RestApplication } from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import { ServiceMixin } from '@loopback/service-proxy';
import {
  BearerVerifierBindings,
  BearerVerifierComponent,
  BearerVerifierConfig,
  BearerVerifierType,
  CoreComponent,
  SecureSequence,
  SECURITY_SCHEME_SPEC
} from '@sourceloop/core';
import { AuthenticationComponent } from 'loopback4-authentication';
import {
  AuthorizationBindings,
  AuthorizationComponent
} from 'loopback4-authorization';
import * as path from 'path';
import { AuthserviceProvider, MessageserviceProvider, NotificationserviceProvider } from './services';

import * as dotenv from 'dotenv';
import * as dotenvExt from 'dotenv-extended';

export { ApplicationConfig };

export class FacadeApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    dotenv.config();
    dotenvExt.load({
      schema: '.env',
      errorOnMissing: process.env.NODE_ENV !== 'test',
      includeProcessEnv: true,
    });
    super(options);

    this.api({
      openapi: '3.0.0',
      paths: {},
      info: {
        title: 'Chat Facade app',
        version: '1.0',
      },
      components: {
        securitySchemes: SECURITY_SCHEME_SPEC,
      },
    });

    // Set up the custom sequence
    this.sequence(SecureSequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.component(CoreComponent);
    this.component(AuthenticationComponent);
    this.bind(BearerVerifierBindings.Config).to({
      type: BearerVerifierType.facade,
    } as BearerVerifierConfig);
    this.component(BearerVerifierComponent);

    this.bind(AuthorizationBindings.CONFIG).to({
      allowAlwaysPaths: ['/explorer'],
    });
    this.component(AuthorizationComponent);

    this.bind("services.Messageservice").toProvider(MessageserviceProvider);
    this.bind("services.Authservice").toProvider(AuthserviceProvider);
    this.bind("services.Notificationservice").toProvider(NotificationserviceProvider);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }
}
