
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.StoreAdminScalarFieldEnum = {
  id: 'id',
  name: 'name',
  username: 'username',
  email: 'email',
  passwordHash: 'passwordHash',
  role: 'role',
  status: 'status',
  phone: 'phone',
  avatar: 'avatar',
  lastLoginAt: 'lastLoginAt',
  lastLoginIp: 'lastLoginIp',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StoreSettingScalarFieldEnum = {
  id: 'id',
  key: 'key',
  value: 'value',
  updatedAt: 'updatedAt'
};

exports.Prisma.LicenseCacheScalarFieldEnum = {
  id: 'id',
  licenseKey: 'licenseKey',
  plan: 'plan',
  status: 'status',
  domain: 'domain',
  installationUuid: 'installationUuid',
  entitlementsJson: 'entitlementsJson',
  expiresAt: 'expiresAt',
  lastValidatedAt: 'lastValidatedAt',
  gracePeriodUntil: 'gracePeriodUntil',
  centralApiUrl: 'centralApiUrl',
  updatedAt: 'updatedAt'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  image: 'image',
  parentId: 'parentId',
  sortOrder: 'sortOrder',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  shortDescription: 'shortDescription',
  description: 'description',
  regularPrice: 'regularPrice',
  salePrice: 'salePrice',
  sku: 'sku',
  stockQuantity: 'stockQuantity',
  categoryId: 'categoryId',
  status: 'status',
  featured: 'featured',
  metaTitle: 'metaTitle',
  metaDescription: 'metaDescription',
  videoUrl: 'videoUrl',
  videoTitle: 'videoTitle',
  relatedProductIds: 'relatedProductIds',
  isComboDeal: 'isComboDeal',
  comboProductIds: 'comboProductIds',
  comboDiscountPercent: 'comboDiscountPercent',
  comboTitle: 'comboTitle',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MediaAssetScalarFieldEnum = {
  id: 'id',
  fileName: 'fileName',
  fileUrl: 'fileUrl',
  fileType: 'fileType',
  mimeType: 'mimeType',
  fileSize: 'fileSize',
  altText: 'altText',
  createdAt: 'createdAt'
};

exports.Prisma.ProductReviewScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  authorName: 'authorName',
  rating: 'rating',
  comment: 'comment',
  isApproved: 'isApproved',
  createdAt: 'createdAt'
};

exports.Prisma.ProductImageScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  url: 'url',
  altText: 'altText',
  isPrimary: 'isPrimary',
  sortOrder: 'sortOrder'
};

exports.Prisma.ProductVariantScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  title: 'title',
  sku: 'sku',
  price: 'price',
  stockQuantity: 'stockQuantity',
  attributesJson: 'attributesJson',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InventoryLogScalarFieldEnum = {
  id: 'id',
  productId: 'productId',
  variantId: 'variantId',
  changeAmount: 'changeAmount',
  resultingStock: 'resultingStock',
  reason: 'reason',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.StoreCustomerScalarFieldEnum = {
  id: 'id',
  email: 'email',
  name: 'name',
  phone: 'phone',
  passwordHash: 'passwordHash',
  isGuest: 'isGuest',
  avatar: 'avatar',
  lastLoginAt: 'lastLoginAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WishlistItemScalarFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  guestId: 'guestId',
  productId: 'productId',
  createdAt: 'createdAt'
};

exports.Prisma.AddressScalarFieldEnum = {
  id: 'id',
  customerId: 'customerId',
  fullName: 'fullName',
  addressLine1: 'addressLine1',
  addressLine2: 'addressLine2',
  city: 'city',
  state: 'state',
  postalCode: 'postalCode',
  country: 'country',
  phone: 'phone',
  isDefault: 'isDefault'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  orderNumber: 'orderNumber',
  customerId: 'customerId',
  customerName: 'customerName',
  customerEmail: 'customerEmail',
  customerPhone: 'customerPhone',
  shippingAddressJson: 'shippingAddressJson',
  billingAddressJson: 'billingAddressJson',
  subtotal: 'subtotal',
  discount: 'discount',
  shippingFee: 'shippingFee',
  total: 'total',
  couponCode: 'couponCode',
  orderStatus: 'orderStatus',
  paymentMethod: 'paymentMethod',
  paymentStatus: 'paymentStatus',
  transactionId: 'transactionId',
  shippingProvider: 'shippingProvider',
  trackingNumber: 'trackingNumber',
  shippingLabelUrl: 'shippingLabelUrl',
  customerNotes: 'customerNotes',
  adminNotes: 'adminNotes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.OrderItemScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  productId: 'productId',
  variantId: 'variantId',
  title: 'title',
  variantTitle: 'variantTitle',
  sku: 'sku',
  price: 'price',
  quantity: 'quantity',
  total: 'total'
};

exports.Prisma.CouponScalarFieldEnum = {
  id: 'id',
  code: 'code',
  discountType: 'discountType',
  discountValue: 'discountValue',
  minOrderAmount: 'minOrderAmount',
  usageLimit: 'usageLimit',
  usedCount: 'usedCount',
  expiresAt: 'expiresAt',
  isActive: 'isActive',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PaymentGatewaySettingScalarFieldEnum = {
  id: 'id',
  provider: 'provider',
  isEnabled: 'isEnabled',
  isTestMode: 'isTestMode',
  title: 'title',
  description: 'description',
  configJson: 'configJson',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ShippingProviderSettingScalarFieldEnum = {
  id: 'id',
  provider: 'provider',
  isEnabled: 'isEnabled',
  isTestMode: 'isTestMode',
  title: 'title',
  configJson: 'configJson',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StoreThemeSettingScalarFieldEnum = {
  id: 'id',
  activeTheme: 'activeTheme',
  brandName: 'brandName',
  logoUrl: 'logoUrl',
  faviconUrl: 'faviconUrl',
  primaryColor: 'primaryColor',
  accentColor: 'accentColor',
  fontFamily: 'fontFamily',
  bannerHeadline: 'bannerHeadline',
  bannerSubheadline: 'bannerSubheadline',
  bannerImageUrl: 'bannerImageUrl',
  heroBadge: 'heroBadge',
  heroCtaText: 'heroCtaText',
  heroCtaLink: 'heroCtaLink',
  companyAddress: 'companyAddress',
  companyCity: 'companyCity',
  companyState: 'companyState',
  companyPostalCode: 'companyPostalCode',
  companyCountry: 'companyCountry',
  supportEmail: 'supportEmail',
  supportPhone: 'supportPhone',
  taxId: 'taxId',
  announcementBarText: 'announcementBarText',
  showAnnouncementBar: 'showAnnouncementBar',
  socialLinksJson: 'socialLinksJson',
  footerText: 'footerText',
  updatedAt: 'updatedAt'
};

exports.Prisma.CustomPageScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  content: 'content',
  metaTitle: 'metaTitle',
  metaDescription: 'metaDescription',
  status: 'status',
  showInFooter: 'showInFooter',
  showInNav: 'showInNav',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  StoreAdmin: 'StoreAdmin',
  StoreSetting: 'StoreSetting',
  LicenseCache: 'LicenseCache',
  Category: 'Category',
  Product: 'Product',
  MediaAsset: 'MediaAsset',
  ProductReview: 'ProductReview',
  ProductImage: 'ProductImage',
  ProductVariant: 'ProductVariant',
  InventoryLog: 'InventoryLog',
  StoreCustomer: 'StoreCustomer',
  WishlistItem: 'WishlistItem',
  Address: 'Address',
  Order: 'Order',
  OrderItem: 'OrderItem',
  Coupon: 'Coupon',
  PaymentGatewaySetting: 'PaymentGatewaySetting',
  ShippingProviderSetting: 'ShippingProviderSetting',
  StoreThemeSetting: 'StoreThemeSetting',
  CustomPage: 'CustomPage'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
