# Introduction

This is a quick start demo for [GreptimeCloud](https://greptime.cloud/). It collects the system metric data such as CPU and memory usage through Opentelemetry and sends the metrics to GreptimeCloud. You can view the metrics on the GreptimeCloud dashboard.

## Quick Start

Use the following command line to start sending metrics without cloning the project:

```shell
npx greptime-cloud-quick-start --host=<host> --db=<dbname> --username=<username> --password=<password>
```

Or clone the project and run the following command line:

```shell
npm install
npx ts-node app.ts --host=<host> --db=<dbname> --username=<username> --password=<password>
```

## npm-publish

1. Compile typescript to javascript.

    ```shell
    tsc
    ```

2. Change the version in package.json.
3. Commit and push code
4. Create a tag with the version and push it.

    ```shell
    git tag v<major>.<minor>.<patch>
    git push origin v<major>.<minor>.<patch>
    ```

5. Run `npm publish`
6. Write change log in Github Release.
