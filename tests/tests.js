const stream = require("stream");
const expect = require("chai").expect;
const assert = require("chai").assert;
const nock = require('nock');
const makeHttpRequest = require("../index");

describe("should make tests", function () {
    let fakeApp;
    let fakeSecureApp;

    before(async function () {
        fakeApp = nock("http://127.0.0.1:3000");
        fakeSecureApp = nock("https://127.0.0.1:3000");
    });

    after(async function () {
        nock.cleanAll();
    });

    it("should get json parsed body", async function () {
        const expectedResult = {result: 1};
        fakeApp
            .get("/test_route").once()
            .reply(200, expectedResult);

        const actualResult = await makeHttpRequest(
            false,
            "http://127.0.0.1:3000",
            undefined,
            undefined,
            "GET",
            "/test_route",
            undefined,
            undefined,
            undefined,
            );
        expect(actualResult).to.be.eql(expectedResult);
    });

    it("should get json parsed body with base auth", async function () {
        const expectedResult = {result: 1};
        fakeApp
            .get("/test_route").basicAuth({ user: "john", pass: "galt" }).once()
            .reply(200, expectedResult);

        const actualResult = await makeHttpRequest(
            false,
            "http://127.0.0.1:3000",
            "john",
            "galt",
            "GET",
            "/test_route",
            undefined,
            undefined,
            undefined,
        );
        expect(actualResult).to.be.eql(expectedResult);
    });

    it("should send json body and get string", async function () {
        const expectedResult = "some response";
        fakeApp
            .post("/test_route", { request: 1 }).once()
            .reply(200, expectedResult);

        const actualResult = await makeHttpRequest(
            false,
            "http://127.0.0.1:3000",
            "john",
            "galt",
            "POST",
            "/test_route",
            { request: 1 },
            undefined,
            undefined,
        );
        expect(actualResult).to.be.eql(expectedResult);
    });

    it("should send json body and get string via https", async function () {
        const expectedResult = "some response";
        fakeSecureApp
            .post("/test_route", { request: 1 }).once()
            .reply(200, expectedResult);

        const actualResult = await makeHttpRequest(
            true,
            "127.0.0.1:3000",
            "john",
            "galt",
            "POST",
            "/test_route",
            { request: 1 },
            undefined,
            undefined,
        );
        expect(actualResult).to.be.eql(expectedResult);
    });

    it("should get response as stream", async function () {
        const expectedResult = "some response";
        fakeApp
            .post("/test_route", { request: 1 }).once()
            .reply(200, expectedResult);

        const actualResult = await makeHttpRequest(
            false,
            "http://127.0.0.1:3000",
            "john",
            "galt",
            "POST",
            "/test_route",
            { request: 1 },
            undefined,
            true,
        );
        expect(actualResult).to.be.an.instanceof(stream.Readable);
        // TODO check stream content
    });

    it("should throw error when try parse corrupted json", async function () {
        const expectedResult = "corrupted json";
        fakeApp
            .post("/test_route", { request: 1 }).once()
            .reply(200, expectedResult, {"Content-Type": "application/json"});

        try {
            await makeHttpRequest(
                false,
                "http://127.0.0.1:3000",
                "john",
                "galt",
                "POST",
                "/test_route",
                {request: 1},
                undefined,
                undefined,
            );
        } catch (err) {
            expect(err).to.be.an.instanceof(SyntaxError);
            return;
        }
        assert.fail("error should be throw above");
    });

    it("should throw error (with error field) when get not 200 code", async function () {
        const expectedResult = {error: "some error"};
        fakeApp
            .post("/test_route", { request: 1 }).once()
            .reply(400, expectedResult);

        try {
            await makeHttpRequest(
                false,
                "http://127.0.0.1:3000",
                "john",
                "galt",
                "POST",
                "/test_route",
                {request: 1},
                undefined,
                undefined,
            );
        } catch (err) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.be.equal("some error");
            return;
        }
        assert.fail("error should be throw above");
    });

    it("should throw error (with string value) when get not 200 code", async function () {
        const expectedResult = "some error";
        fakeApp
            .post("/test_route", { request: 1 }).once()
            .reply(400, expectedResult);

        try {
            await makeHttpRequest(
                false,
                "http://127.0.0.1:3000",
                "john",
                "galt",
                "POST",
                "/test_route",
                {request: 1},
                undefined,
                undefined,
            );
        } catch (err) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.be.equal("some error");
            return;
        }
        assert.fail("error should be throw above");
    });

    it("should throw error (with object value) when get not 200 code", async function () {
        const expectedResult = {resp: "some error"};
        fakeApp
            .post("/test_route", { request: 1 }).once()
            .reply(400, expectedResult);

        try {
            await makeHttpRequest(
                false,
                "http://127.0.0.1:3000",
                "john",
                "galt",
                "POST",
                "/test_route",
                {request: 1},
                undefined,
                undefined,
            );
        } catch (err) {
            expect(err).to.be.an.instanceof(Error);
            expect(err.message).to.be.equal("{\"resp\":\"some error\"}");
            return;
        }
        assert.fail("error should be throw above");
    });
});
