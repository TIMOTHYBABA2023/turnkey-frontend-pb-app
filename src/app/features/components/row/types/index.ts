export interface ContactResponseData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  isFavorite: boolean;
  profilePicUrl: string;
  phoneNumber: string;
  mobileNumber: string;
  workPhone: string;
  contactGroup?: string;
  address?: {
    id?: number;
    country?: string;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

export interface AddressResponse {
  id: number;
  createdAt: string;
  modifiedAt: string;
  country: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ApiResponse<D> {
  length: number;
  data: D;
  success: boolean;
  message: string;
  statusCode: number;
}

export interface Data {
  content: ContactResponseData[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: Sort;
  empty: boolean;
}
export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface NewContactRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  mobileNumber?: string;
  workPhone?: string;
  contactGroup?: string;
  address?: {
    country?: string;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

export type UpdateContactRequest = Partial<NewContactRequest>;
