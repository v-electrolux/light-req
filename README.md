# light-req [![NPM version](https://badge.fury.io/js/light-req.svg)](https://badge.fury.io/js/light-req) [![Build Status](https://travis-ci.com/v-electrolux/light-req.svg?branch=master)](https://travis-ci.com/v-electrolux/light-req) [![Code Coverage](https://badgen.now.sh/codecov/c/github/v-electrolux/light-req)](https://badgen.now.sh/codecov/c/github/v-electrolux/light-req) [![install size](https://packagephobia.com/badge?p=light-req)](https://packagephobia.com/result?p=light-req)

A very tiny package (zero dependencies) that allows you to make http and https requests (some wrap and sugar for nodejs http and https)

## Install

```bash
$ npm install light-req
```

## Usage

Some arguments are optional, but you can not skip them, you should use undefined instead of correct values, except they are last

makeHttpRequest function arguments
- isSecure - false if you want http, true if you want https, boolean, required
- url - string with host and port, with or without protocol, string, required
- login - base auth user, string, optional
- password - base auth password, string, optional
- method - http method, string, required
- path - path to resource (if you want to explicit type conversion from string for environment variables), string, required
- body - json body object, optional
- options - you can specify most of http and https options, object, optional
- doNotReadResponse - set to true if you want to read response stream yourself, boolean, optional

## Example

```js
const makeHttpRequest = require("light-req");

const actualResult = await makeHttpRequest(
        false,
        "http://127.0.0.1:3000",
        "user",// or undefined
        "pass",// or undefined
        "POST",
        "/test_route",
        {request: 1},// or undefined
        { timeout: 20000 },// or undefined
        true,// or undefined
    );
```
