import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { db } from "./firebase";

// Types
export interface Announcement {
  id: string;
  title: string;
  date: string;
  category: string;
  content: string;
  src?: string;
  slug: string;
}

export interface Lecture {
  id: string;
  title: string;
  description?: string;
  [key: string]: unknown;
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  schemaImage?: string;
  [key: string]: unknown;
}

export interface Member {
  id: string;
  name: string;
  role?: string;
  img?: string;
  imageUrl?: string;
  [key: string]: unknown;
}

// Get all announcements ordered by date (descending)
export async function getAnnouncements(): Promise<Announcement[]> {
  try {
    const announcementsRef = collection(db, "announcements");
    const q = query(announcementsRef, orderBy("date", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Announcement[];
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return [];
  }
}

// Get latest N announcements
export async function getLatestAnnouncements(limitCount: number = 3): Promise<Announcement[]> {
  try {
    const announcementsRef = collection(db, "announcements");
    const q = query(announcementsRef, orderBy("date", "desc"), limit(limitCount));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Announcement[];
  } catch (error) {
    console.error("Error fetching latest announcements:", error);
    return [];
  }
}

// Get all lectures
export async function getLectures(): Promise<Lecture[]> {
  try {
    const lecturesRef = collection(db, "lectures");
    const snapshot = await getDocs(lecturesRef);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Lecture[];
  } catch (error) {
    console.error("Error fetching lectures:", error);
    return [];
  }
}

// Get quizzes, optionally filtered by category
export async function getQuizzes(category?: string): Promise<Quiz[]> {
  try {
    const quizzesRef = collection(db, "quizzes");
    const q = category
      ? query(quizzesRef, where("category", "==", category))
      : query(quizzesRef);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Quiz[];
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return [];
  }
}

// Get all members
export async function getMembers(): Promise<Member[]> {
  try {
    const membersRef = collection(db, "members");
    const snapshot = await getDocs(membersRef);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Member[];
  } catch (error) {
    console.error("Error fetching members:", error);
    return [];
  }
}
