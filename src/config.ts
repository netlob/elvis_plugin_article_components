export class Config {
    /**
     * Elvis server url.
     */
    static elvisUrl: string = process.env.IR_ELVIS_URL || 'http://localhost:8080';

    /**
     * HTTP Port where the app runs.
     */
    static httpPort: string = process.env.IR_HTTP_PORT || '7050';

    /**
     * CORS header. Default value is elvisUrl. You can change this value to, for example '*' to open up access to other domains than the Elvis URL. 
     * This can be useful when tou want to access the Image Recognition Server API from a non - Elvis web client webpage.
     * 
     * Note: with Elvis 6.7 or higher, it's advised to keep the setting default and access the API via the Elvis Server which adds authentication.
     * In this case you configure the cors settings in Elvis Server: https://helpcenter.woodwing.com/hc/en-us/articles/115002689986-Elvis-6-API-cross-origin
     */
    static corsHeader: string = process.env.IR_CORS_HEADER || Config.elvisUrl;

    /**
     * Elvis webhook token. Create a webhook that listens for "asset_update_metadata" events and that returns the "assetDomain" metadata field.
     * 
     * More info on creating a webhook: https://helpcenter.woodwing.com/hc/en-us/articles/115001884346
     */
    static elvisToken: string = process.env.IR_ELVIS_TOKEN || 'BNAioOs+6QqjK79LB9hfsg==';

    /**
     * Elvis username. 
     * 
     * Permission configuration:
     * - This user should be licensed as an API user.
     * - Ensure that the user can access the preview of all images imported in Elvis.
     */
    static elvisUsername: string = process.env.IR_ELVIS_USER || 'importmodule';

    /**
     * Elvis password.
     */
    static elvisPassword: string = process.env.IR_ELVIS_PASSWORD || 'changemenow';

    static fields = {
        cf_title: [],
        cf_subtitle: [],
        cf_author: [],
        cf_components: [],
        cf_quote: [],
        cf_crosshead: []
    }
}