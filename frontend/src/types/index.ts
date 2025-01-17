export interface User {
  id: number;
  username?: string;
  firstname?: string;
  lastname?: string;
  email: string;
  profilePictureUrl?: string;
  bio?: string;
  website?: string;
  phone?: string;
  location?: string;
}

export interface Post {
  id: number;
  caption: string;
  mediaUrl: string | null;
  mediaType: 'IMAGE' | 'VIDEO' | null;
  createdAt: string;
  updatedAt: string;
  user: {
    email: string;
    id: number;
    username: string;
    firstname?: string;
    lastname?: string;
    profilePictureUrl: string | null;
  };
  likesCount: number;
  commentsCount: number;
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

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
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
  
  
  export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    updateUser: (userData: Partial<User>) => Promise<void>;
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