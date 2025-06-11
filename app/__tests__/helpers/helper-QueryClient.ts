const defaultQueryClient = {
    invalidateQueries: () => {},
    setQueryData: () => {},
};

let currentMock = () => defaultQueryClient;

export function setMockUseQueryClient(overrides = {}) {
    currentMock = () => ({ ...defaultQueryClient, ...overrides });
}

export function mockUseQueryClient() {
    return currentMock();
}
