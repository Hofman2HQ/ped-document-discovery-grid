
export interface Document {
  id: string;
  image_url: string;
  page_url: string;
  country: string;
  document_type: string;
  created_at: string;
  state: string;
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
