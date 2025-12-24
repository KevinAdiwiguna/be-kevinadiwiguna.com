import { SetMetadata } from '@nestjs/common';

export const RateLimit = (limit: number, minutes: number) => 
    SetMetadata("rate_limit", { limit, minutes });
