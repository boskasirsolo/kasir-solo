
export interface WriterConfig {
    authorName: string;
    tones: string[];
    wordCount: number;
    userNotes?: string;
    city?: { name: string; type: string };
    pillarParent?: { title: string; slug: string };
    relatedPillars?: { title: string; slug: string }[];
    productsJson?: string;
    galleryJson?: string;
}
