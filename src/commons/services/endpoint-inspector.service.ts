import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { PATH_METADATA, METHOD_METADATA } from '@nestjs/common/constants';
import { RequestMethod } from '@nestjs/common';

@Injectable()
export class EndpointInspectorService implements OnModuleInit {
  constructor(
    private readonly discovery: DiscoveryService,
    private readonly scanner: MetadataScanner,
    private readonly reflector: Reflector,
  ) {}

  onModuleInit() {
    // kasih delay kecil supaya semua module pasti keload
    setTimeout(() => {
      this.printTable();
    }, 500);
  }

  private printTable() {
    const rows: any[] = [];

    const controllers = this.discovery.getControllers();

    for (const wrapper of controllers) {
      const instance = wrapper.instance;
      const controllerClass = wrapper.metatype;

      if (!instance || !controllerClass) continue;

      const controllerPath =
        this.reflector.get<string>(PATH_METADATA, controllerClass) ?? '';

      this.scanner.scanFromPrototype(
        instance,
        Object.getPrototypeOf(instance),
        (methodName) => {
          const handler = instance[methodName];

          const method = this.reflector.get<RequestMethod>(
            METHOD_METADATA,
            handler,
          );

          if (method === undefined) return;

          const routePath =
            this.reflector.get<string>(PATH_METADATA, handler) ?? '';

          // ===== Guards =====
          const guards =
            this.reflector.get<any[]>('__guards__', handler) ?? [];

          const guardNames = guards.map((g) => g?.name ?? '');

          const hasJwt = guardNames.includes('JwtAuthGuard');
          const hasRefresh = guardNames.includes('RefreshTokenGuard');
          const hasPermissionGuard =
            guardNames.includes('PermissionsGuard');
          const hasRateLimitGuard =
            guardNames.includes('RateLimitGuard');

          // ===== Permission =====
          const permission =
            this.reflector.get<string>('permission', handler) ?? '-';

          // ===== Rate Limit =====
          const rateLimit =
            this.reflector.get<{ limit: number; minutes: number }>(
              'rate_limit',
              handler,
            );

          rows.push({
            Method: RequestMethod[method],
            Endpoint: `/${controllerPath}/${routePath}`
              .replace(/\/+/g, '/')
              .replace(/\/$/, ''),

            JWT: hasJwt ? '✅' : '❌',
            Refresh: hasRefresh ? '✅' : '❌',
            PermissionGuard: hasPermissionGuard ? '✅' : '❌',
            RateLimitGuard: hasRateLimitGuard ? '✅' : '❌',

            Permission: permission,
            RateLimit: rateLimit
              ? `${rateLimit.limit}/${rateLimit.minutes}m`
              : '-',
          });
        },
      );
    }

    console.log('\n================ API ENDPOINT INSPECTOR ================');
    console.table(rows);
  }
}
