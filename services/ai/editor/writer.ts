
import { WriterConfig } from './types';
import { PillarEngine } from './engines/pillar-engine';
import { ClusterEngine } from './engines/cluster-engine';

export const Writer = {
    writeArticle: async (
        title: string,
        tones: string[],
        type: string,
        authorName: string,
        wordCount: number,
        pillarContext?: { title: string; slug: string },
        relatedPillarsData?: { title: string; slug: string }[],
        galleryContextString?: string,
        userContext?: string,
        cityContext?: { name: string; type: string },
        productContextString?: string
    ) => {
        const config: WriterConfig = {
            authorName, tones, wordCount,
            userNotes: userContext,
            city: cityContext,
            pillarParent: pillarContext,
            relatedPillars: relatedPillarsData,
            productsJson: productContextString,
            galleryJson: galleryContextString
        };

        if (type === 'pillar') {
            return await PillarEngine.execute(title, config);
        } else {
            return await ClusterEngine.execute(title, config);
        }
    }
};
