#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// For troubleshooting, set the log level to DiagLogLevel.DEBUG
const api_1 = require("@opentelemetry/api");
api_1.diag.setLogger(new api_1.DiagConsoleLogger(), api_1.DiagLogLevel.INFO);
const exporter_metrics_otlp_proto_1 = require("@opentelemetry/exporter-metrics-otlp-proto");
const sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
const host_metrics_1 = require("@opentelemetry/host-metrics");
function main() {
    var argv = require('minimist')(process.argv.slice(2));
    const dbHost = argv.host || 'localhost';
    const db = argv.db || 'public';
    const username = argv.username;
    const password = argv.password;
    const secure = argv.secure;
    const port = argv.port;
    var url = '';
    if (secure) {
        url = `https://`;
    }
    else {
        url = `http://`;
    }
    url += `${dbHost}`;
    if (port) {
        url += `:${port}`;
    }
    url += `/v1/otlp/v1/metrics`;
    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    const metricReader = new sdk_metrics_1.PeriodicExportingMetricReader({
        exporter: new exporter_metrics_otlp_proto_1.OTLPMetricExporter({
            url: url,
            headers: {
                Authorization: `Basic ${auth}`,
                "x-greptime-db-name": db,
            },
            timeoutMillis: 5000,
        }),
        exportIntervalMillis: 5000,
    });
    const meterProvider = new sdk_metrics_1.MeterProvider();
    meterProvider.addMetricReader(metricReader);
    const hostMetrics = new host_metrics_1.HostMetrics({ meterProvider, name: 'quick-start-demo-node' });
    hostMetrics.start();
    console.log('Sending metrics...');
    setInterval(() => { }, 1000);
}
if (require.main === module) {
    main();
}
