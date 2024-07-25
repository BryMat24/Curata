declare module "youtube-transcript" {
    export interface Transcript {
        text: string;
    }

    export class YoutubeTranscript {
        static fetchTranscript(
            videoId: string,
            { lang: string, country: string }
        ): Promise<Transcript[]>;
    }
}
