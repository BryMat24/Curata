declare module "youtube-transcript" {
    export interface Transcript {
        text: string;
    }

    export class YoutubeTranscript {
        static fetchTranscript(videoId: string): Promise<Transcript[]>;
    }
}
