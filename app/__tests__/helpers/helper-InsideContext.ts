import { defaultInsideContextValues } from "./helpers";

let currentMock = { ...defaultInsideContextValues };

export function setMockInsideContext(overrides = {}) {
    currentMock = { ...defaultInsideContextValues, ...overrides };
}

export function mockUseInsideContext() {
    return currentMock;
}
