import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return { status: 'ok', uptime: process.uptime() };
  }

  @Get('metrics')
  getMetrics() {
    const memoryUsage = process.memoryUsage();
    return {
      rss: memoryUsage.rss,
      heapTotal: memoryUsage.heapTotal,
      heapUsed: memoryUsage.heapUsed,
      external: memoryUsage.external,
      uptime: process.uptime(),
    };
  }
}