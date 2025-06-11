const defaultDrawerContext = {
    isDrawerOpen: false,
    setIsDrawerOpen: () => {},
    drawerContent: { header: null, body: null, footer: null },
    setDrawerContent: () => {},
    isDrawerActionLoading: false,
    setIsDrawerActionLoading: () => {},
};

let currentMock = { ...defaultDrawerContext };

export function setMockUseDrawer(overrides = {}) {
    currentMock = { ...defaultDrawerContext, ...overrides };
}

export function mockUseDrawer() {
    return currentMock;
}
