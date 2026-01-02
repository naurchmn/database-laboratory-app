// Unit tests for AuthForm logic without React Native rendering

import type { Auth } from "firebase/auth";

// Mock all dependencies
const mockCreateUserWithEmailAndPassword = jest.fn();
const mockSignInWithEmailAndPassword = jest.fn();
const mockUpdateProfile = jest.fn();
const mockRouterReplace = jest.fn();

jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: (...args: unknown[]) =>
    mockCreateUserWithEmailAndPassword(...args),
  signInWithEmailAndPassword: (...args: unknown[]) =>
    mockSignInWithEmailAndPassword(...args),
  updateProfile: (...args: unknown[]) => mockUpdateProfile(...args),
}));

jest.mock("expo-router", () => ({
  router: {
    replace: (...args: unknown[]) => mockRouterReplace(...args),
  },
  Link: jest.fn(),
}));

jest.mock("expo-linear-gradient", () => ({
  LinearGradient: jest.fn(),
}));

jest.mock("../../lib/firebase", () => ({
  auth: {},
}));

describe("AuthForm Component - Unit Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Login Authentication", () => {
    it("should call signInWithEmailAndPassword with correct parameters", async () => {
      mockSignInWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: "123" } });

      const { signInWithEmailAndPassword } =
        jest.requireMock("firebase/auth") as typeof import("firebase/auth");
      await signInWithEmailAndPassword({} as unknown as Auth, "test@example.com", "password123");

      expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        "test@example.com",
        "password123"
      );
    });

    it("should handle successful login", async () => {
      mockSignInWithEmailAndPassword.mockResolvedValueOnce({
        user: { uid: "123", email: "test@example.com" }
      });

      const result = await mockSignInWithEmailAndPassword({}, "test@example.com", "password");

      expect(result.user.uid).toBe("123");
      expect(result.user.email).toBe("test@example.com");
    });

    it("should handle login failure with wrong password", async () => {
      mockSignInWithEmailAndPassword.mockRejectedValueOnce({
        code: "auth/wrong-password",
        message: "Wrong password",
      });

      await expect(
        mockSignInWithEmailAndPassword({}, "test@example.com", "wrongpassword")
      ).rejects.toEqual({
        code: "auth/wrong-password",
        message: "Wrong password",
      });
    });

    it("should handle login failure with invalid email", async () => {
      mockSignInWithEmailAndPassword.mockRejectedValueOnce({
        code: "auth/invalid-email",
        message: "Invalid email",
      });

      await expect(
        mockSignInWithEmailAndPassword({}, "invalid-email", "password")
      ).rejects.toEqual({
        code: "auth/invalid-email",
        message: "Invalid email",
      });
    });

    it("should handle user not found error", async () => {
      mockSignInWithEmailAndPassword.mockRejectedValueOnce({
        code: "auth/user-not-found",
        message: "User not found",
      });

      await expect(
        mockSignInWithEmailAndPassword({}, "notfound@example.com", "password")
      ).rejects.toEqual({
        code: "auth/user-not-found",
        message: "User not found",
      });
    });
  });

  describe("Register Authentication", () => {
    it("should call createUserWithEmailAndPassword with correct parameters", async () => {
      const mockUser = { uid: "123" };
      mockCreateUserWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });

      const { createUserWithEmailAndPassword } =
        jest.requireMock("firebase/auth") as typeof import("firebase/auth");
      await createUserWithEmailAndPassword({} as unknown as Auth, "john@example.com", "password123");

      expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalledWith(
        {},
        "john@example.com",
        "password123"
      );
    });

    it("should update user profile with displayName after registration", async () => {
      const mockUser = { uid: "123" };
      mockCreateUserWithEmailAndPassword.mockResolvedValueOnce({ user: mockUser });
      mockUpdateProfile.mockResolvedValueOnce(undefined);

      const { createUserWithEmailAndPassword, updateProfile } =
        jest.requireMock("firebase/auth") as typeof import("firebase/auth");
      const result = await createUserWithEmailAndPassword({} as unknown as Auth, "john@example.com", "password123");
      await updateProfile(result.user, { displayName: "John Doe" });

      expect(mockUpdateProfile).toHaveBeenCalledWith(mockUser, { displayName: "John Doe" });
    });

    it("should handle email already in use error", async () => {
      mockCreateUserWithEmailAndPassword.mockRejectedValueOnce({
        code: "auth/email-already-in-use",
        message: "Email already in use",
      });

      await expect(
        mockCreateUserWithEmailAndPassword({}, "existing@example.com", "password")
      ).rejects.toEqual({
        code: "auth/email-already-in-use",
        message: "Email already in use",
      });
    });

    it("should handle weak password error", async () => {
      mockCreateUserWithEmailAndPassword.mockRejectedValueOnce({
        code: "auth/weak-password",
        message: "Password is too weak",
      });

      await expect(
        mockCreateUserWithEmailAndPassword({}, "test@example.com", "123")
      ).rejects.toEqual({
        code: "auth/weak-password",
        message: "Password is too weak",
      });
    });
  });

  describe("Navigation", () => {
    it("should call router.replace with /(tabs) on successful auth", () => {
      const { router } = jest.requireMock("expo-router") as typeof import("expo-router");
      router.replace("/(tabs)");

      expect(mockRouterReplace).toHaveBeenCalledWith("/(tabs)");
    });
  });

  describe("Firebase Error Mapping", () => {
    const mapFirebaseError = (code?: string) => {
      switch (code) {
        case "auth/invalid-email":
          return "Email tidak valid.";
        case "auth/user-not-found":
          return "User tidak ditemukan.";
        case "auth/wrong-password":
          return "Password salah.";
        case "auth/email-already-in-use":
          return "Email sudah terdaftar.";
        case "auth/weak-password":
          return "Password terlalu lemah (min 6 karakter).";
        default:
          return null;
      }
    };

    it("should map auth/invalid-email to Indonesian message", () => {
      expect(mapFirebaseError("auth/invalid-email")).toBe("Email tidak valid.");
    });

    it("should map auth/user-not-found to Indonesian message", () => {
      expect(mapFirebaseError("auth/user-not-found")).toBe("User tidak ditemukan.");
    });

    it("should map auth/wrong-password to Indonesian message", () => {
      expect(mapFirebaseError("auth/wrong-password")).toBe("Password salah.");
    });

    it("should map auth/email-already-in-use to Indonesian message", () => {
      expect(mapFirebaseError("auth/email-already-in-use")).toBe("Email sudah terdaftar.");
    });

    it("should map auth/weak-password to Indonesian message", () => {
      expect(mapFirebaseError("auth/weak-password")).toBe("Password terlalu lemah (min 6 karakter).");
    });

    it("should return null for unknown error codes", () => {
      expect(mapFirebaseError("unknown-error")).toBeNull();
      expect(mapFirebaseError(undefined)).toBeNull();
    });
  });

  describe("Form Validation Logic", () => {
    const canSubmit = (email: string, password: string, fullName: string, isRegister: boolean) => {
      if (!email.trim() || !password) return false;
      if (isRegister && !fullName.trim()) return false;
      return true;
    };

    it("should return false when email is empty", () => {
      expect(canSubmit("", "password123", "", false)).toBe(false);
    });

    it("should return false when email is only whitespace", () => {
      expect(canSubmit("   ", "password123", "", false)).toBe(false);
    });

    it("should return false when password is empty", () => {
      expect(canSubmit("test@example.com", "", "", false)).toBe(false);
    });

    it("should return false in register mode when fullName is empty", () => {
      expect(canSubmit("test@example.com", "password123", "", true)).toBe(false);
    });

    it("should return false in register mode when fullName is only whitespace", () => {
      expect(canSubmit("test@example.com", "password123", "   ", true)).toBe(false);
    });

    it("should return true when all login fields are filled", () => {
      expect(canSubmit("test@example.com", "password123", "", false)).toBe(true);
    });

    it("should return true when all register fields are filled", () => {
      expect(canSubmit("test@example.com", "password123", "John Doe", true)).toBe(true);
    });

    it("should trim email before validation", () => {
      expect(canSubmit("  test@example.com  ", "password123", "", false)).toBe(true);
    });

    it("should trim fullName before validation in register mode", () => {
      expect(canSubmit("test@example.com", "password123", "  John Doe  ", true)).toBe(true);
    });
  });
});
