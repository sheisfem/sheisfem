/// <reference types="astro/client" />

declare module "*.css" {}

interface ImportMetaEnv {
  readonly KIT_API_KEY?: string;
  readonly KIT_FORM_ID?: string;
  readonly KIT_TAG_ID?: string;
}
