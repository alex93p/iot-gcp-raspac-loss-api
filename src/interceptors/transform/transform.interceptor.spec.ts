import { AddDataTransformInterceptor } from "./addData.transform.interceptor";

describe("TransformInterceptor", () => {
    it("should be defined", () => {
        expect(new AddDataTransformInterceptor()).toBeDefined();
    });
});
