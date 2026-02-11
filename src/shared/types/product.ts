export type GCPType = 8 | 9 | 10 | 11 | 12;

export type BarcodeType = "EAN-13" | "EAN-8";

export type ProductStatus = "pending" | "verified" | "rejected";

export interface Manufacturer {
  id: string;
  name: string;
  gcp: string;
  gcpType: GCPType;
  availableBarcodes: number;
  usedBarcodes: number;
  nextSequenceNumber: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  weight: string;
  unit: string;
  packaging: string;
  shelfLife?: string;
  imageUrl?: string;
  gtin: string;
  barcodeType: BarcodeType;
  status: ProductStatus;
  verifiedByGS1: boolean;
  manufacturerId: string;
  createdAt: string;
}

export interface GTINGenerationResult {
  gtin: string;
  barcodeType: BarcodeType;
  gcp: string;
  sequenceNumber: string;
  checkDigit: number;
  breakdown: {
    prefix: string;
    gcpPart: string;
    sequencePart: string;
    checkDigitPart: string;
  };
}
