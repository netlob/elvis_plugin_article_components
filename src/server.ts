import express = require('express');
import http = require('http');
import fs = require('fs');
import { Application } from 'express';
import bodyParser = require('body-parser');
import { Config } from './config';
import { ElvisApi } from './elvis-api/api';
import { ApiManager } from './elvis-api/api-manager';
import uuidV4 = require('uuid/v4');

class Server {
    private static instance: Server;

    public static getInstance(): Server {
        return this.instance || (this.instance = new this());
    }

    private app: Application;
    private httpApp: Application;
    private apiManager: ElvisApi = ApiManager.getApi();

    private constructor() {
        this.httpApp = express();
        this.app = this.httpApp;
    }

    public start(): void {
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(this.allowCrossDomain);

        http.createServer(this.httpApp).listen(Config.httpPort, () => {
            this.logStartupMessage('HTTP Server started at port: ' + Config.httpPort);
        });

        this.app.post('/', async (req, res) => {
            try {
                const file = await this.downloadFile(`http://localhost:8080/api/asset/${req.body.assetId}/original`, `dump/${req.body.assetId}_${uuidV4()}.json`)
                const article = JSON.parse(fs.readFileSync(file, "utf8"));
                let metadata = {
                    cf_title: [],
                    cf_subtitle: [],
                    cf_components: [],
                    cf_heroTitle: [],
                    cf_heroSubtitle: [],
                    cf_heroAuthor: []
                };
                article.data.content.forEach(component => {
                    if (!metadata.cf_components.includes(component.identifier)) metadata.cf_components.push(component.identifier);
                    if (component.identifier == "headline") component.identifier = "title";
                    if (!["title", "subtitle", "hero"].includes(component.identifier)) return;
                    else if (component.identifier == "hero") {
                        for (const identifier in component.content) {
                            const tag = `cf_hero${identifier[0].toUpperCase() + identifier.substr(1)}`;
                            if (typeof metadata[tag] != "object") continue;
                            let val = JSON.stringify(component.content[identifier]);
                            val = val.substr(val.indexOf('"insert":"') + 10);
                            val = val.slice(0, val.indexOf('"'));
                            metadata[tag].push(val);
                            // metadata[tag].push(component.content[identifier].map(a => a.insert).join(','));
                        }
                    } else {
                        let val = JSON.stringify(component.content);
                        val = val.substr(val.indexOf('"insert":"') + 10);
                        val = val.slice(0, val.indexOf('"'));
                        metadata[`cf_${component.identifier}`].push(val);
                    }
                });
                for (const field in metadata) {
                    if (field == "cf_components") continue;
                    metadata[field] = metadata[field].join(", ")
                }
                console.log(metadata)
                this.apiManager.update(req.body.assetId, JSON.stringify(metadata));
                res.sendStatus(200);
                fs.unlinkSync(file);
            } catch (e) {
                console.error(e);
                res.sendStatus(200);
            }
        });
    }

    private async downloadFile(url: string, destination: string): Promise<string> {
        return await this.createDestinationDirectory(destination).then(async () => {
            return await this.apiManager.elvisRequest.requestFile(url, destination);
        });
    }

    private createDestinationDirectory(file: string): Promise<string> {
        let dir: string = require('path').dirname(file);
        return new Promise<string>((resolve, reject) => {
            fs.mkdir(dir, error => {
                if (!error || (error && error.code === 'EEXIST')) {
                    resolve(dir);
                }
                else {
                    reject(error);
                }
            });
        });
    }

    private logStartupMessage(serverMsg: string): void {
        console.info('Running NodeJS ' + process.version + ' on ' + process.platform + ' (' + process.arch + ')');
        console.info(serverMsg);
    }

    private allowCrossDomain = (req, res, next) => {
        req = req;

        res.header('Access-Control-Allow-Origin', Config.corsHeader);
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept');

        next();
    }
}


let server: Server = Server.getInstance();
server.start();
