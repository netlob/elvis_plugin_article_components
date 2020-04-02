# elvis_plugin_article_components

## Installation
The server can either be installed on the Elvis Server or on a separate machine.

* Clone or download this package.
* Open src/config.ts and configure the settings. You can either configure the settings in this config file or by setting environment variables.
* Install nodejs (6.9 or higher).
* Open a terminal and go to the package folder.
* Install TypeScript via npm: npm install -g typescript
* Install node modules: npm install
* Start the server: npm start
* The server is correctly started when a startup message is showed.

## Configure webhook
An Elvis webhook needs to be configured if you want to detect description updates directly when they are changed in Elvis. 

- Log-in to the Elvis web client as admin user.
- Go to the management console, webhooks section and add a new webhook.
- Name: For example, "Tag Translation".
- URL: Point it to the URL where the image recognition server is running, if it's running on the same machine as Elvis and you did not change the port number in `src/config.ts`, this will be: http://localhost:7080/.
- Event type: `asset_create`.
- Metadata to include: none
- Asset event configuration: none
- Save the webhook.
- The generated secret token needs to be specified in the `src/config.ts` file later on.

Detailed information on setting up and using webhooks can be found on [Help Center](https://helpcenter.woodwing.com/hc/en-us/articles/115001884346).

An example webhook is:
![Example webhook](https://media.discordapp.net/attachments/252530467478306816/695059316591296533/unknown.png)

## Configure custom-assetinfo.xml
Some extra metadata fields have to be added in order for this plugin to work.
- In `/data/elvis/config/custom-assetinfo.xml` add a new line in the "fieldGroups" tag on the top of the file:
  ```
  <fieldGroup name="ArticleComponents" />
  ```

- Add the end of the "assetTypeBaseExt" tag in `/data/elvis/config/custom-assetinfo.xml` you will need to add a couple fields.
- Required fields:
    ```
    <field name="cf_title" group="ArticleComponents">
        <storage storeInMetadata="true"/>
        <compass index="tokenized" store="yes" excludeFromAll="false" />
        <data editable="true" datatype="text" multivalue="true" />
    </field>
    <field name="cf_subtitle" group="ArticleComponents">
        <storage storeInMetadata="true"/>
        <compass index="tokenized" store="yes" excludeFromAll="false" />
        <data editable="true" datatype="text" multivalue="true" />
    </field>
    <field name="cf_author" group="ArticleComponents">
        <storage storeInMetadata="true"/>
        <compass index="tokenized" store="yes" excludeFromAll="false" />
        <data editable="true" datatype="text" multivalue="true" />
    </field>
    <field name="cf_components" group="ArticleComponents">
        <storage storeInMetadata="true"/>
        <compass index="tokenized" analyzer="pureLowerCase" store="yes" excludeFromAll="false" />
        <data editable="true" datatype="text" multivalue="true" />
    </field>
    <field name="cf_quote" group="ArticleComponents">
        <storage storeInMetadata="true"/>
        <compass index="tokenized" store="yes" excludeFromAll="false" />
        <data editable="true" datatype="text" multivalue="true" />
    </field>
    <field name="cf_crosshead" group="ArticleComponents">
        <storage storeInMetadata="true"/>
        <compass index="tokenized" store="yes" excludeFromAll="false" />
        <data editable="true" datatype="text" multivalue="true" />
    </field>
    ```