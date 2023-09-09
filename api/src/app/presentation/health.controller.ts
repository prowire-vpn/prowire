import {Controller, Get} from '@nestjs/common';
import {AppHealthResponseBodyDto} from './health.controller.dto';

@Controller('health')
export class HealthController {
  @Get()
  async health(): Promise<AppHealthResponseBodyDto> {
    return new AppHealthResponseBodyDto();
  }
}
