import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getApiDocumentation() {
    return {
      "GET /api": {
        "description": "serves up a json representation of all the available endpoints of the api"
      }
    };
  }
}