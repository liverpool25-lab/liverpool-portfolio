export type Language = "en" | "id";

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  categoryKey: string;
  timeline: string;
  descriptionKey: string;
  image: string;
  technologies: string[];
  liveUrl?: string;
  repoUrl?: string;
  statusKey?: string;
  badge?: string;
  featured?: boolean;
}

export type GalleryCategory = "all" | "art" | "hiking" | "personal" | "events";

export interface GalleryItem {
  id: string;
  titleEn: string;
  titleId: string;
  category: GalleryCategory;
  categoryLabelEn: string;
  categoryLabelId: string;
  captionEn: string;
  captionId: string;
  subEn: string;
  subId: string;
  badgeEn?: string;
  badgeId?: string;
  src: string;
  aspectRatio?: string;
}

export interface GuestbookEntry {
  id: string;
  user_id: string;
  author_name: string;
  author_email?: string;
  author_avatar?: string;
  message: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  display_name: string;
  avatar_url?: string;
  email?: string;
}
