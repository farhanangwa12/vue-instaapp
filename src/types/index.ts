export interface User {
    id: number;
    username: string;
    email: string;
}

export interface Post {
    id: number;
    user_id: number;
    content: string;
    image: string | null;
    created_at: string;
    user: User;
    likes: { id: number; user_id: number }[];
    comments: { id: number; user_id: number; content: string; user: User }[];
}