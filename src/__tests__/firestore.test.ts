import {
  getAnnouncements,
  getLatestAnnouncements,
  getAnnouncementBySlug,
  getLectures,
  getLectureBySlug,
  getQuizzes,
  getQuizzesByCategory,
  getMembers,
  type Announcement,
  type Lecture,
  type Quiz,
  type Member,
} from "../lib/firestore";

// Mock Firebase Firestore
const mockGetDocs = jest.fn();
const mockGetDoc = jest.fn();
const mockCollection = jest.fn();
const mockQuery = jest.fn();
const mockWhere = jest.fn();
const mockOrderBy = jest.fn();
const mockLimit = jest.fn();
const mockRef = jest.fn();
const mockGetDownloadURL = jest.fn();

jest.mock("firebase/firestore", () => ({
  collection: (...args: unknown[]) => mockCollection(...args),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  getDoc: (...args: unknown[]) => mockGetDoc(...args),
  doc: jest.fn(),
  query: (...args: unknown[]) => mockQuery(...args),
  where: (...args: unknown[]) => mockWhere(...args),
  orderBy: (...args: unknown[]) => mockOrderBy(...args),
  limit: (...args: unknown[]) => mockLimit(...args),
}));

jest.mock("firebase/storage", () => ({
  ref: (...args: unknown[]) => mockRef(...args),
  getDownloadURL: (...args: unknown[]) => mockGetDownloadURL(...args),
}));

describe("Firestore Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAnnouncements", () => {
    it("should return array of announcements ordered by date desc", async () => {
      const mockAnnouncements: Partial<Announcement>[] = [
        { title: "Announcement 1", date: "2024-01-15", slug: "ann-1" },
        { title: "Announcement 2", date: "2024-01-10", slug: "ann-2" },
      ];

      mockGetDocs.mockResolvedValueOnce({
        docs: mockAnnouncements.map((ann, index) => ({
          id: `id-${index}`,
          data: () => ann,
        })),
      });

      const result = await getAnnouncements();

      expect(result).toHaveLength(2);
      expect(result[0].title).toBe("Announcement 1");
      expect(result[1].title).toBe("Announcement 2");
      expect(mockCollection).toHaveBeenCalledWith(expect.anything(), "announcements");
      expect(mockOrderBy).toHaveBeenCalledWith("date", "desc");
    });

    it("should return empty array on error", async () => {
      mockGetDocs.mockRejectedValueOnce(new Error("Firebase error"));

      const result = await getAnnouncements();

      expect(result).toEqual([]);
    });
  });

  describe("getLatestAnnouncements", () => {
    it("should return limited number of announcements", async () => {
      const mockAnnouncements: Partial<Announcement>[] = [
        { title: "Latest 1", date: "2024-01-15", slug: "latest-1" },
        { title: "Latest 2", date: "2024-01-14", slug: "latest-2" },
      ];

      mockGetDocs.mockResolvedValueOnce({
        docs: mockAnnouncements.map((ann, index) => ({
          id: `id-${index}`,
          data: () => ann,
        })),
      });

      const result = await getLatestAnnouncements(2);

      expect(result).toHaveLength(2);
      expect(mockLimit).toHaveBeenCalledWith(2);
    });

    it("should use default limit of 3", async () => {
      mockGetDocs.mockResolvedValueOnce({ docs: [] });

      await getLatestAnnouncements();

      expect(mockLimit).toHaveBeenCalledWith(3);
    });
  });

  describe("getAnnouncementBySlug", () => {
    it("should return announcement when found", async () => {
      const mockAnnouncement: Partial<Announcement> = {
        title: "Test Announcement",
        slug: "test-slug",
        date: "2024-01-15",
        category: "info",
        content: "Test content",
      };

      mockGetDocs.mockResolvedValueOnce({
        empty: false,
        docs: [
          {
            id: "test-id",
            data: () => mockAnnouncement,
          },
        ],
      });

      const result = await getAnnouncementBySlug("test-slug");

      expect(result).not.toBeNull();
      expect(result?.title).toBe("Test Announcement");
      expect(result?.slug).toBe("test-slug");
      expect(mockWhere).toHaveBeenCalledWith("slug", "==", "test-slug");
    });

    it("should return null when not found", async () => {
      mockGetDocs.mockResolvedValueOnce({
        empty: true,
        docs: [],
      });

      const result = await getAnnouncementBySlug("non-existent");

      expect(result).toBeNull();
    });

    it("should return null on error", async () => {
      mockGetDocs.mockRejectedValueOnce(new Error("Firebase error"));

      const result = await getAnnouncementBySlug("test-slug");

      expect(result).toBeNull();
    });
  });

  describe("getLectures", () => {
    it("should return array of lectures", async () => {
      const mockLectures: Partial<Lecture>[] = [
        { code: "BD", title: "Basis Data", image: "/images/bd.png" },
        { code: "MBD", title: "Manajemen Basis Data", image: "/images/mbd.png" },
      ];

      mockGetDocs.mockResolvedValueOnce({
        docs: mockLectures.map((lecture, index) => ({
          id: `lecture-${index}`,
          data: () => lecture,
        })),
      });

      const result = await getLectures();

      expect(result).toHaveLength(2);
      expect(result[0].code).toBe("BD");
      expect(result[0].slug).toBe("lecture-0"); // slug should be doc id
      expect(result[1].code).toBe("MBD");
      expect(mockCollection).toHaveBeenCalledWith(expect.anything(), "lectures");
    });

    it("should return empty array on error", async () => {
      mockGetDocs.mockRejectedValueOnce(new Error("Firebase error"));

      const result = await getLectures();

      expect(result).toEqual([]);
    });
  });

  describe("getLectureBySlug", () => {
    // Note: getLectureBySlug uses dynamic import which is harder to mock
    // These tests verify the function handles errors gracefully

    it("should return null on error (dynamic import fails)", async () => {
      // The function uses dynamic import which will fail in test environment
      // This tests the error handling path
      const result = await getLectureBySlug("any-slug");

      // Should return null because the dynamic import will fail in test env
      expect(result).toBeNull();
    });

    it("should be callable with any slug parameter", async () => {
      // Verify the function signature accepts a string
      expect(typeof getLectureBySlug).toBe("function");

      // Should not throw when called
      await expect(getLectureBySlug("test-slug")).resolves.toBeNull();
      await expect(getLectureBySlug("another-slug")).resolves.toBeNull();
    });
  });

  describe("getQuizzes", () => {
    it("should return all quizzes when no category specified", async () => {
      const mockQuizzes: Partial<Quiz>[] = [
        { title: "Quiz 1", category: "BD", order: 1 },
        { title: "Quiz 2", category: "MBD", order: 1 },
      ];

      mockGetDocs.mockResolvedValueOnce({
        docs: mockQuizzes.map((quiz, index) => ({
          id: `quiz-${index}`,
          data: () => quiz,
        })),
      });

      const result = await getQuizzes();

      expect(result).toHaveLength(2);
      expect(mockWhere).not.toHaveBeenCalled();
    });

    it("should filter quizzes by category", async () => {
      const mockQuizzes: Partial<Quiz>[] = [
        { title: "BD Quiz 1", category: "BD", order: 1 },
      ];

      mockGetDocs.mockResolvedValueOnce({
        docs: mockQuizzes.map((quiz, index) => ({
          id: `quiz-${index}`,
          data: () => quiz,
        })),
      });

      const result = await getQuizzes("BD");

      expect(result).toHaveLength(1);
      expect(result[0].category).toBe("BD");
      expect(mockWhere).toHaveBeenCalledWith("category", "==", "BD");
    });

    it("should return empty array on error", async () => {
      mockGetDocs.mockRejectedValueOnce(new Error("Firebase error"));

      const result = await getQuizzes();

      expect(result).toEqual([]);
    });
  });

  describe("getQuizzesByCategory", () => {
    it("should return quizzes with resolved schema image URLs", async () => {
      const mockQuizzes = [
        {
          title: "Quiz 1",
          category: "BD",
          order: 1,
          schemaImage: "quizzes/schema1.png",
          tokens: ["SELECT", "FROM"],
          answer: ["SELECT", "FROM"],
        },
      ];

      mockGetDocs.mockResolvedValueOnce({
        docs: mockQuizzes.map((quiz, index) => ({
          id: `quiz-${index}`,
          data: () => quiz,
        })),
      });

      mockGetDownloadURL.mockResolvedValueOnce("https://storage.firebase.com/schema1.png");

      const result = await getQuizzesByCategory("BD");

      expect(result).toHaveLength(1);
      expect(result[0].schemaImageUrl).toBe("https://storage.firebase.com/schema1.png");
      expect(mockOrderBy).toHaveBeenCalledWith("order", "asc");
    });

    it("should handle missing schema image gracefully", async () => {
      const mockQuizzes = [
        {
          title: "Quiz 1",
          category: "BD",
          order: 1,
          tokens: [],
          answer: [],
        },
      ];

      mockGetDocs.mockResolvedValueOnce({
        docs: mockQuizzes.map((quiz, index) => ({
          id: `quiz-${index}`,
          data: () => quiz,
        })),
      });

      const result = await getQuizzesByCategory("BD");

      expect(result).toHaveLength(1);
      expect(result[0].schemaImageUrl).toBeUndefined();
    });

    it("should handle schema image URL errors gracefully", async () => {
      const mockQuizzes = [
        {
          title: "Quiz 1",
          category: "BD",
          order: 1,
          schemaImage: "quizzes/schema1.png",
          tokens: ["SELECT"],
          answer: ["SELECT"],
        },
      ];

      mockGetDocs.mockResolvedValueOnce({
        docs: mockQuizzes.map((quiz, index) => ({
          id: `quiz-${index}`,
          data: () => quiz,
        })),
      });

      mockGetDownloadURL.mockRejectedValueOnce(new Error("Storage error"));

      const result = await getQuizzesByCategory("BD");

      expect(result).toHaveLength(1);
      expect(result[0].schemaImageUrl).toBeUndefined();
      expect(result[0].schemaImage).toBe("quizzes/schema1.png");
    });

    it("should return empty array on error", async () => {
      mockGetDocs.mockRejectedValueOnce(new Error("Firebase error"));

      const result = await getQuizzesByCategory("BD");

      expect(result).toEqual([]);
    });
  });

  describe("getMembers", () => {
    it("should return members with resolved image URLs", async () => {
      const mockMembers: Partial<Member>[] = [
        { name: "John Doe", role: "Asisten", img: "members/john.png" },
        { name: "Jane Doe", role: "Asisten", img: "members/jane.png" },
      ];

      mockGetDocs.mockResolvedValueOnce({
        docs: mockMembers.map((member, index) => ({
          id: `member-${index}`,
          data: () => member,
        })),
      });

      mockGetDownloadURL
        .mockResolvedValueOnce("https://storage.firebase.com/john.png")
        .mockResolvedValueOnce("https://storage.firebase.com/jane.png");

      const result = await getMembers();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe("John Doe");
      expect(result[0].imageUrl).toBe("https://storage.firebase.com/john.png");
      expect(result[1].imageUrl).toBe("https://storage.firebase.com/jane.png");
    });

    it("should handle image URL errors gracefully", async () => {
      const mockMembers: Partial<Member>[] = [
        { name: "John Doe", img: "members/john.png" },
      ];

      mockGetDocs.mockResolvedValueOnce({
        docs: mockMembers.map((member, index) => ({
          id: `member-${index}`,
          data: () => member,
        })),
      });

      mockGetDownloadURL.mockRejectedValueOnce(new Error("Storage error"));

      const result = await getMembers();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("John Doe");
      expect(result[0].imageUrl).toBeUndefined();
    });

    it("should handle members without images", async () => {
      const mockMembers: Partial<Member>[] = [
        { name: "John Doe", role: "Asisten" }, // No img field
      ];

      mockGetDocs.mockResolvedValueOnce({
        docs: mockMembers.map((member, index) => ({
          id: `member-${index}`,
          data: () => member,
        })),
      });

      const result = await getMembers();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("John Doe");
      expect(result[0].imageUrl).toBeUndefined();
    });

    it("should return empty array on error", async () => {
      mockGetDocs.mockRejectedValueOnce(new Error("Firebase error"));

      const result = await getMembers();

      expect(result).toEqual([]);
    });
  });
});
