#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// For troubleshooting, set the log level to DiagLogLevel.DEBUG
var api_1 = require("@opentelemetry/api");
api_1.diag.setLogger(new api_1.DiagConsoleLogger(), api_1.DiagLogLevel.INFO);
var exporter_metrics_otlp_proto_1 = require("@opentelemetry/exporter-metrics-otlp-proto");
var sdk_metrics_1 = require("@opentelemetry/sdk-metrics");
var host_metrics_1 = require("@opentelemetry/host-metrics");
function main() {
    var argv = require('minimist')(process.argv.slice(2));
    var dbHost = argv.host;
    var db = argv.db;
    var username = argv.username;
    var password = argv.password;
    var auth = Buffer.from("".concat(username, ":").concat(password)).toString('base64');
    var metricReader = new sdk_metrics_1.PeriodicExportingMetricReader({
        exporter: new exporter_metrics_otlp_proto_1.OTLPMetricExporter({
            url: "https://".concat(dbHost, "/v1/otlp/v1/metrics"),
            headers: {
                Authorization: "Basic ".concat(auth),
                "x-greptime-db-name": db,
            },
            timeoutMillis: 5000,
        }),
        exportIntervalMillis: 2000,
    });
    var meterProvider = new sdk_metrics_1.MeterProvider();
    meterProvider.addMetricReader(metricReader);
    var hostMetrics = new host_metrics_1.HostMetrics({ meterProvider: meterProvider, name: 'quick-start-demo-node' });
    hostMetrics.start();
    console.log('Sending metrics...');
    setInterval(function () { }, 1000);
}
if (require.main === module) {
    main();
}
