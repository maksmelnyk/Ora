export interface Language {
  name: string;
  code: string;
  nativeName?: string;
  type: "living" | "extinct" | "ancient" | "historic" | "constructed";
}
