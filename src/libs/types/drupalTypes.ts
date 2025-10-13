// src/types/drupal.ts
export interface DrupalForm {
  id: string;
  titleForm: string;
  descriptionForm: string;
  alias: string;
  formUrl: string;
  banner: {
    id: string;
    bannerId: string;
    bannerInternalId: string;
    bannerUrl: string;
  };
}

export interface DrupalResponse {
  data: Array<{
    id: string;
    attributes: {
      title: string;
      field_description: string;
      drupal_internal__nid: number;
      path: {
        alias: string;
      };
    };
    relationships: {
      field_gge_banner_image: {
        data: {
          id: string;
          meta: {
            drupal_internal__target_id: number;
          };
        };
        links: {
          related: {
            href: string;
          };
        };
      };
    };
  }>;
}