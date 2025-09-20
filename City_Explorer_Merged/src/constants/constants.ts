export enum ImageType {
  LOGO = "logo",
  PROFILE_PICTURE = "profile_pic",
  EVENT = "event",
  PROMO = "promo",
  GENERAL = "general",
  BUSINESS_COVER = "business_cover"
}

export enum TableMaps {
  LOGO = "business",
  BUSINESS_COVER = "business",
  PROFILE_PICTURE = "user",
  EVENT = "event",
  PROMO = "promo",
};

export const TableConfig = {
  LOGO: { table: 'business', pk: 'businessId', field: 'logo', isArray: false },
  BUSINESS_COVER: { table: 'business', pk: 'businessId', field: 'image', isArray: false },
  PROFILE_PICTURE: { table: 'user', pk: 'userId', field: 'profilePic', isArray: false },
  EVENT: { table: 'event', pk: 'eventId', field: 'images', isArray: true },
  PROMO: { table: 'promo', pk: 'promoId', field: 'images', isArray: true },
} as const;