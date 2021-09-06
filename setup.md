# Production Deployment Guide

## Prerequisites

Start a development server following the instructions given in README.md

## Install global packages

```
npm install -g node-windows
```

## Build Sources

```

ng build --prod --output-path ./dist

```

## Create and run a Windows Service

```
node ./svc.js
```

## Go to deployed server URL:

```
http://localhost/login
```
