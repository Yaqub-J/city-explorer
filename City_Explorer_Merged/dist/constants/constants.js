"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TableConfig = exports.TableMaps = exports.ImageType = void 0;
var ImageType;
(function (ImageType) {
    ImageType["LOGO"] = "logo";
    ImageType["PROFILE_PICTURE"] = "profile_pic";
    ImageType["EVENT"] = "event";
    ImageType["PROMO"] = "promo";
    ImageType["GENERAL"] = "general";
    ImageType["BUSINESS_COVER"] = "business_cover";
})(ImageType || (exports.ImageType = ImageType = {}));
var TableMaps;
(function (TableMaps) {
    TableMaps["LOGO"] = "business";
    TableMaps["BUSINESS_COVER"] = "business";
    TableMaps["PROFILE_PICTURE"] = "user";
    TableMaps["EVENT"] = "event";
    TableMaps["PROMO"] = "promo";
})(TableMaps || (exports.TableMaps = TableMaps = {}));
;
exports.TableConfig = {
    LOGO: { table: 'business', pk: 'businessId', field: 'logo', isArray: false },
    BUSINESS_COVER: { table: 'business', pk: 'businessId', field: 'image', isArray: false },
    PROFILE_PICTURE: { table: 'user', pk: 'userId', field: 'profilePic', isArray: false },
    EVENT: { table: 'event', pk: 'eventId', field: 'images', isArray: true },
    PROMO: { table: 'promo', pk: 'promoId', field: 'images', isArray: true },
};
