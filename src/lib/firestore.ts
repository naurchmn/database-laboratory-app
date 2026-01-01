import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";

// Types
export interface Announcement {
  id: string;
  title: string;
  alt?: string;
  Matkul?: string;
  date: string;
  category: string;
  content: string;
  src?: string;
  slug: string;
}

export interface Material {
  title: string;
  filePath: string;
  fileUrl?: string;
}

export interface Lecture {
  id: string;
  slug: string;
  code: string;
  title: string;
  image: string;
  materials?: Material[];
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
  email?: string;
  info?: string;
}

// Get announcement by slug
export async function getAnnouncementBySlug(slug: string): Promise<Announcement | null> {
  try {
    const announcementsRef = collection(db, "announcements");
    const q = query(announcementsRef, where("slug", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as Announcement;
  } catch (error) {
    console.error("Error fetching announcement by slug:", error);
    return null;
  }
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
      slug: doc.id, // Use document ID as slug
      ...doc.data(),
    })) as Lecture[];
  } catch (error) {
    console.error("Error fetching lectures:", error);
    return [];
  }
}

// Get lecture by slug (document ID) with materials and resolved file URLs
export async function getLectureBySlug(slug: string): Promise<Lecture | null> {
  try {
    const { doc: getDoc, getDoc: getDocSnapshot } = await import("firebase/firestore");
    const docRef = getDoc(db, "lectures", slug);
    const docSnap = await getDocSnapshot(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data() as Omit<Lecture, 'id' | 'slug'>;

    // Resolve file URLs for materials
    const materialsWithUrls: Material[] = [];
    if (data.materials && Array.isArray(data.materials)) {
      for (const material of data.materials) {
        try {
          const fileRef = ref(storage, material.filePath);
          const fileUrl = await getDownloadURL(fileRef);
          materialsWithUrls.push({
            ...material,
            fileUrl,
          });
        } catch (err) {
          console.error(`Error getting URL for ${material.filePath}:`, err);
          materialsWithUrls.push({
            ...material,
            fileUrl: undefined,
          });
        }
      }
    }

    return {
      id: docSnap.id,
      slug: docSnap.id, // Use document ID as slug
      ...data,
      materials: materialsWithUrls,
    };
  } catch (error) {
    console.error("Error fetching lecture by slug:", error);
    return null;
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

// Get all members with resolved image URLs
export async function getMembers(): Promise<Member[]> {
  try {
    const membersRef = collection(db, "members");
    const snapshot = await getDocs(membersRef);

    const members: Member[] = [];
    for (const doc of snapshot.docs) {
      const data = doc.data();
      let imageUrl: string | undefined;

      // Resolve image URL from Firebase Storage
      if (data.img) {
        try {
          const imageRef = ref(storage, data.img);
          imageUrl = await getDownloadURL(imageRef);
        } catch (err) {
          console.error(`Error getting image URL for ${data.img}:`, err);
        }
      }

      members.push({
        id: doc.id,
        name: data.name,
        role: data.role,
        img: data.img,
        imageUrl,
        email: data.email,
        info: data.info,
      });
    }

    return members;
  } catch (error) {
    console.error("Error fetching members:", error);
    return [];
  }
}
