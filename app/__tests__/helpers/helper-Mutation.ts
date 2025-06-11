const defaultUseMutation = {
    isPending: false,
};

let currentMock = { ...defaultUseMutation };

export function setMockUseMutation(overrides = {}) {
    currentMock = { ...defaultUseMutation, ...overrides };
}

export function mockUseMutation() {
    return currentMock;
}
