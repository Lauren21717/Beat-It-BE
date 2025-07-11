import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getApiDocumentation(): {
        "GET /api": {
            description: string;
        };
    };
}
