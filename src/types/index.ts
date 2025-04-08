
export interface Document {
  transactionId: string;
  image_url: string;
  page_url: string;
  country: string;
  document_type: string;
  created_at: string;
  state: string;
  ped_search_country: string;
  ped_search_document_type: string;
  loaded_to_sfm: boolean;
}

export interface SearchFilters {
  searchText: string;
  country: string;
  documentType: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  state: string;
}
