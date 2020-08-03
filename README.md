# light-req [![NPM version](https://badge.fury.io/js/light-req.svg)](http://badge.fury.io/js/light-req) [![CI Pipeline](https://badgen.now.sh/travis/v-electrolux/light-req)](https://badgen.now.sh/travis/v-electrolux/light-req) [![Code Coverage](https://badgen.now.sh/codecov/c/github/v-electrolux/light-req)](https://badgen.now.sh/codecov/c/github/v-electrolux/light-req) [![Package size](https://badgen.net/packagephobia/install/light-req)](https://badgen.net/packagephobia/install/light-req)

A very tiny package (zero dependencies) that allows you to make http and https requests (some wrap and sugar for nodejs http and https)

## Install

```bash
$ npm install light-req
```

## Usage

Some arguments are optional, but you can not skip them, you should use undefined instead of correct values, except they are last

makeHttpRequest function arguments
- isSecure - false if you want http, true if you want https, required
- url - string with host and port, with or without protocol, required
- login - base auth user, optional
- password - base auth password, optional
- method - http method, required
- path - path to resource (if you want to explicit type conversion from string for environment variables), required
- body - json body object, optional
- options - you can specify most of http and https options, optional
- parseResponseOptions - optional, ParseResponseOptions enumeration
  - AsJsonTry: default behavior, if response content-type is json tries to parse and throw error if can not
  - AsJsonForce: regardless of content-type tries to parse and throw error if can not
  - AsReadStream: not reading response stream at all and return readable stream

## Example

```js
const { makeHttpRequest, ParseResponseOptions } = require("../index");

const actualResult = await makeHttpRequest(
        false,
        "http://127.0.0.1:3000",
        "user",// or undefined
        "pass",// or undefined
        "POST",
        "/test_route",
        {request: 1},// or undefined
        { timeout: 20000 },// or undefined
        ParseResponseOptions.AsJsonForce,// or undefined
    );
// actualResult is JSON object or throw Error if not

```
