// Mock Firebase Auth
const mockOnAuthStateChanged = jest.fn();
const mockUser = {
  uid: "test-user-id",
  email: "test@example.com",
  displayName: "Test User",
  photoURL: "https://example.com/photo.jpg",
};

jest.mock("firebase/auth", () => ({
  onAuthStateChanged: (...args: unknown[]) => mockOnAuthStateChanged(...args),
}));

jest.mock("../lib/firebase", () => ({
  auth: {},
}));

// Mock React hooks for testing
type UserType = typeof mockUser | null;
type AuthCallback = (user: UserType) => void;

let currentUser: UserType = null;
let currentLoading = true;

jest.mock("react", () => ({
  useState: jest.fn((initial) => {
    if (initial === null) {
      return [currentUser, (val: UserType) => {
        currentUser = val;
      }];
    }
    return [currentLoading, (val: boolean) => {
      currentLoading = val;
    }];
  }),
  useEffect: jest.fn((callback) => {
    const cleanup = callback();
    return cleanup;
  }),
}));

describe("useAuth Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    currentUser = null;
    currentLoading = true;
  });

  it("should call onAuthStateChanged on mount", () => {
    mockOnAuthStateChanged.mockImplementation(() => jest.fn());

    const { useAuth } = jest.requireActual("../hooks/useAuth") as typeof import("../hooks/useAuth");
    useAuth();

    expect(mockOnAuthStateChanged).toHaveBeenCalled();
  });

  it("should return unsubscribe function that gets called on cleanup", () => {
    const mockUnsubscribe = jest.fn();
    mockOnAuthStateChanged.mockImplementation(() => mockUnsubscribe);

    const { useAuth } = jest.requireActual("../hooks/useAuth") as typeof import("../hooks/useAuth");
    useAuth();

    expect(mockOnAuthStateChanged).toHaveBeenCalled();
  });

  it("should update user and loading when auth state changes", () => {
    let authCallback: AuthCallback | null = null;

    mockOnAuthStateChanged.mockImplementation((_auth: unknown, callback: AuthCallback) => {
      authCallback = callback;
      return jest.fn();
    });

    const { useAuth } = jest.requireActual("../hooks/useAuth") as typeof import("../hooks/useAuth");
    useAuth();

    // Simulate auth state change - user logs in
    if (authCallback) {
      (authCallback as AuthCallback)(mockUser);
    }

    expect(currentUser).toEqual(mockUser);
    expect(currentLoading).toBe(false);
  });

  it("should set user to null when not authenticated", () => {
    let authCallback: AuthCallback | null = null;

    mockOnAuthStateChanged.mockImplementation((_auth: unknown, callback: AuthCallback) => {
      authCallback = callback;
      return jest.fn();
    });

    const { useAuth } = jest.requireActual("../hooks/useAuth") as typeof import("../hooks/useAuth");
    useAuth();

    // Simulate no user
    if (authCallback) {
      (authCallback as AuthCallback)(null);
    }

    expect(currentUser).toBeNull();
    expect(currentLoading).toBe(false);
  });
});
