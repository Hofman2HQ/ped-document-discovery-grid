
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

// Backend interfaces
export interface PedDetails {
  id: number;
  transaction_id: string;
  document_type: string;
  country: string;
  state: string;
  created_at: Date;
  loaded_to_sfm: boolean;
}

export interface PedSearchSession {
  id: number;
  transaction_id: string;
  search_country: string;
  search_document_type: string;
  search_timestamp: Date;
}

export interface PedSourceUrl {
  id: number;
  transaction_id: string;
  image_url: string;
  page_url: string;
  discovered_at: Date;
}

export interface PedCollectorQuery {
  id: number;
  query_text: string;
  target_country: string;
  target_document_type: string;
  created_at: Date;
  last_run_at: Date;
  is_active: boolean;
}
