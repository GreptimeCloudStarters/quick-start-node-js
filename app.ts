#!/usr/bin/env node

// For troubleshooting, set the log level to DiagLogLevel.DEBUG
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

import {OTLPMetricExporter} from "@opentelemetry/exporter-metrics-otlp-proto";
import {PeriodicExportingMetricReader, MeterProvider} from "@opentelemetry/sdk-metrics";
import {HostMetrics} from '@opentelemetry/host-metrics';

function main() {
    var argv = require('minimist')(process.argv.slice(2));
    const dbHost = argv.host || 'localhost'
    const db = argv.db || 'public'
    const username = argv.username
    const password = argv.password
    const endpoint = argv.endpoint
    const port = argv.port

    var url = ''
    if (endpoint != '') {
        url = endpoint
    } else {
        url = `https://`
        url += `${dbHost}`
        if (port) {
            url += `:${port}`
        }
        url += `/v1/otlp/v1/metrics`
    }
    
    const auth = Buffer.from(`${username}:${password}`).toString('base64')
    const metricReader = new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
            url: url,
            headers: {
                Authorization: `Basic ${auth}`,
                "x-greptime-db-name": db,
            },
            timeoutMillis: 5000,
        }),
        exportIntervalMillis: 5000,
    })

    const meterProvider = new MeterProvider();
    meterProvider.addMetricReader(metricReader);
    const hostMetrics = new HostMetrics({ meterProvider, name: 'quick-start-demo-node' });
    hostMetrics.start();
    console.log('Sending metrics...')
    setInterval(() => {}, 1000);
}

if (require.main === module) {
    main();
}

