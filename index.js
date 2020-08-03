"use strict";
const { URL } = require("url");
const http = require("http");
const https = require("https");

const ParseResponseOptions = {
    AsJsonTry: "try_parse_json",
    AsJsonForce: "force_parse_json",
    AsReadStream: "do_not_read_stream",
};

async function makeHttpRequest(isSecure, url, login, password, method, path, body, options, parseResponseOptions) {
    options = options || {};
    url = isSecure
        ? url.startsWith("https://") ? url : "https://" + url
        : url.startsWith("http://") ? url : "http://" + url;
    const fullUrl = new URL(path, url).toString();
    options.method = method;
    if ((typeof login === "string") && (typeof password === "string")) {
        options.auth = login + ":" + password;
    }
    if (body) {
        body = JSON.stringify(body);
        if (!options.hasOwnProperty("headers")) {
            options.headers = {};
        }
        options.headers["Content-Type"] = "application/json";
        options.headers["Content-Length"] = Buffer.byteLength(body);
    }

    const protocolModule = isSecure ? https : http;
    const request = protocolModule.request(fullUrl, options);

    return new Promise(function(resolve, reject) {
        request.on("response", function (response) {
            if (parseResponseOptions !== ParseResponseOptions.AsReadStream) {
                const dataChunks = [];
                response.on("data", (chunk) => {
                    dataChunks.push(chunk);
                });
                response.on("end", () => {
                    const responseBodyBuffer = Buffer.concat(dataChunks);
                    const responseBodyString = responseBodyBuffer.toString("utf8");
                    let responseBody;
                    const isJsonResponse = response.headers.hasOwnProperty("content-type") && response.headers["content-type"].includes("application/json");
                    if (isJsonResponse || (parseResponseOptions === ParseResponseOptions.AsJsonForce)) {
                        try {
                            responseBody = JSON.parse(responseBodyString);
                        } catch (err) {
                            reject(err);
                            return;
                        }
                    } else {
                        responseBody = responseBodyString;
                    }

                    if (response.statusCode !== 200) {
                        reject(new ExternalServiceError(response.statusCode, response.statusMessage, responseBody));
                    } else {
                        resolve(responseBody);
                    }
                });
            } else {
                resolve(response);
            }
        });
        request.on("error", (err) => reject(err));
        if (body) {
            request.write(body);
        }
        request.end();
    });
}

class ExternalServiceError extends Error {
    constructor(status, statusMessage, response) {
        let message;
        if ((typeof response === "object") && ("error" in response)) {
            message = response["error"];
        } else if (typeof response === "string") {
            message = response;
        } else {
            message = JSON.stringify(response);
        }
        super(message);
        this.name = this.constructor.name;
        this.status = status;
        this.statusMessage = statusMessage;
    }
}

module.exports.ParseResponseOptions = ParseResponseOptions;
module.exports.makeHttpRequest = makeHttpRequest;
