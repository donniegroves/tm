import { defaultInsideContext } from "./helpers";

let currentMock = { ...defaultInsideContext };

export function setMockInsideContext(overrides = {}) {
    currentMock = { ...defaultInsideContext, ...overrides };
}

export function mockUseInsideContext() {
    return currentMock;
}
