export interface Post {
    _id: string,
    user: string,
    caption: string,
    ai: AI,
    likes: string[],
    comments: Comment[]
}

export interface AI {
    adult: {
        adultScore: number,
        isAdultContent: boolean
        goreScore: number,
        isGoryContent: boolean,
        racyScore: number,
        isRacyContent: boolean
    },
    description: {
        captions: {
            text: string,
            confidence: number
        }[]
    },
    objects: {
        object: string,
        confidence: number,
        rectangle: Object
    }[],
    brands: {
        name: string,
        confidence: number,
        rectangle: Object
    }[],
    faces: {
        age: number,
        gender: String,
        faceRectangle: Object
    }[],
    tags: {
        name: string,
        confidence: number
    }[]
}

export interface Comment {
    _id: string,
    user: string,
    text: string
}