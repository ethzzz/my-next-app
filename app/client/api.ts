export const ROLES = ["system", "user", "admin"] as const;
export type MessageRole = (typeof ROLES)[number];

export interface MultimodalContent {
    type: "text" | "image_url";
    text?: string;
    image_url?: {
      url: string;
    };
}
  
export interface RequestMessage {
    role: MessageRole;
    content: string | MultimodalContent[];
}

export class ClientApi {
    public instance: any;

    constructor(provider: any) {
        switch (provider) {
            default:
                this.instance = {}
                break;
        }
    }
}