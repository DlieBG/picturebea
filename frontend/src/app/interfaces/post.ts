export interface Post {
    _id: string,
    user: string,
    caption: string,
    likes: string[],
    comments: Comment[]
}

export interface Comment {
    _id: string,
    user: string,
    text: string
}