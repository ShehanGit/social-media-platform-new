export interface User {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  bio: string | null;
  profilePictureUrl: string | null;
  website: string | null;
  phone: string | null;
  location: string | null;
}

export interface Post {
  id: number;
  caption: string;
  mediaUrl: string | null;
  mediaType: 'IMAGE' | 'VIDEO' | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
    profilePictureUrl: string | null;
  };
  likesCount: number;
  commentsCount: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
}
  
  export interface Comment {
    id: number;
    content: string;
    userEmail: string;
    userName: string;
    createdAt: string;
    updatedAt: string;
    isAuthor: boolean;
  }
  
  export interface Like {
    id: number;
    user: User;
    post: Post;
    createdAt: string;
  }
  
  export interface RelationshipStats {
    followersCount: number;
    followingCount: number;
    isFollowing: boolean;
  }
  
  export interface PaginatedResponse<T> {
    content: T[];
    pageable: {
      pageNumber: number;
      pageSize: number;
    };
    totalElements: number;
    totalPages: number;
    last: boolean;
  }
  
  
  export interface AuthResponse {
    token: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
    captchaToken: string;
  }
  
  export interface RegisterData {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    captchaToken: string;
  }
  
  export interface UserUpdateData {
    username?: string;
    firstname?: string;
    lastname?: string;
    bio?: string;
    website?: string;
    phone?: string;
    location?: string;
  }

  export const config = {
    API_URL: 'http://localhost:8080/api/v1',
    MEDIA_URL: 'http://localhost:8080'  
  };