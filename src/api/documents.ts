
import { Document } from '@/types';

// Mock data for document examples - representing sensitive documents found online
const mockDocuments: Document[] = [
  {
    transactionId: "doc-1",
    sessionId: 1001,
    image_url: "https://shuftipro.com/wp-content/uploads/Passport-31.png",
    page_url: "https://example.com/exposed-document-1",
    country: "United States",
    document_type: "Passport",
    created_at: "2025-01-15T08:30:00Z",
    state: "California",
    ped_search_country: "US",
    ped_search_document_type: "PASS",
    loaded_to_sfm: true
  },
  {
    transactionId: "doc-2",
    sessionId: 1002,
    image_url: "http://images5.fanpop.com/image/photos/29400000/My-ID-Card-penguins-of-madagascar-29400603-1020-676.png",
    page_url: "https://example.org/personal-data-leak",
    country: "Madagascar",
    document_type: "IDs",
    created_at: "2025-02-03T14:20:00Z",
    state: "",
    ped_search_country: "MG",
    ped_search_document_type: "ID",
    loaded_to_sfm: false
  },
  {
    transactionId: "doc-3",
    image_url: "https://shuftipro.com/wp-content/uploads/Driving-License-min-50.png",
    page_url: "https://leaked-docs.net/financial-records",
    country: "United Kingdom",
    document_type: "Driving License",
    created_at: "2025-03-11T11:45:00Z",
    state: "",
    ped_search_country: "UK",
    ped_search_document_type: "DL",
    loaded_to_sfm: true
  },
  {
    transactionId: "doc-4",
    image_url: "http://www.madagaszkar.hu/images/inter-license.jpg",
    page_url: "https://data-breach.com/personal-info",
    country: "Australia",
    document_type: "Driving License",
    created_at: "2025-02-18T09:15:00Z",
    state: "New South Wales",
    ped_search_country: "AU",
    ped_search_document_type: "DL",
    loaded_to_sfm: false
  },
  {
    transactionId: "doc-5",
    image_url: "http://images6.fanpop.com/image/photos/34600000/Corpse-party-I-D-card-skipper-penguins-of-madagascar-34698561-790-600.jpg",
    page_url: "https://insecure-site.org/documents",
    country: "Germany",
    document_type: "IDs",
    created_at: "2025-01-27T16:40:00Z",
    state: "",
    ped_search_country: "DE",
    ped_search_document_type: "ID",
    loaded_to_sfm: true
  },
  {
    transactionId: "doc-6",
    image_url: "http://www.madagaszkar.hu/images/passport.png",
    page_url: "https://poor-security.com/files",
    country: "France",
    document_type: "Passport",
    created_at: "2025-03-05T10:20:00Z",
    state: "",
    ped_search_country: "FR",
    ped_search_document_type: "PASS",
    loaded_to_sfm: false
  },
  {
    transactionId: "doc-7",
    image_url: "https://www.thalesgroup.com/sites/default/files/gemalto/biometric-ID-card-cameroon-renditionid-1.jpg",
    page_url: "https://exposed-api.net/customer-data",
    country: "Japan",
    document_type: "IDs",
    created_at: "2025-02-10T13:50:00Z",
    state: "",
    ped_search_country: "JP",
    ped_search_document_type: "ID",
    loaded_to_sfm: true
  },
  {
    transactionId: "doc-8",
    image_url: "http://images6.fanpop.com/image/photos/34600000/Corpse-party-I-D-card-private-penguins-of-madagascar-34698600-790-600.jpg",
    page_url: "https://misconfigured-server.com/private",
    country: "Brazil",
    document_type: "IDs",
    created_at: "2025-01-09T09:00:00Z",
    state: "São Paulo",
    ped_search_country: "BR",
    ped_search_document_type: "ID",
    loaded_to_sfm: false
  },
  {
    transactionId: "doc-9",
    image_url: "http://www.madagaszkar.hu/images/permis%20de%20conduite-1.png",
    page_url: "https://leaked-database.org/records",
    country: "India",
    document_type: "Driving License",
    created_at: "2025-03-22T15:30:00Z",
    state: "Maharashtra",
    ped_search_country: "IN",
    ped_search_document_type: "DL",
    loaded_to_sfm: true
  },
  {
    transactionId: "doc-10",
    image_url: "https://www.semlex.com/wp-content/uploads/2015/02/Cartes_Permis-de-conduire_Semlex.jpg",
    page_url: "https://public-folder.cloud/documents",
    country: "South Africa",
    document_type: "Driving License",
    created_at: "2025-02-28T11:10:00Z",
    state: "",
    ped_search_country: "ZA",
    ped_search_document_type: "DL",
    loaded_to_sfm: false
  },
  {
    transactionId: "doc-11",
    image_url: "https://www.expat-quotes.com/images/articles/Malta-P-ID%20Card.jpg",
    page_url: "https://unsecured-storage.net/personal",
    country: "Mexico",
    document_type: "IDs",
    created_at: "2025-01-20T14:15:00Z",
    state: "Jalisco",
    ped_search_country: "MX",
    ped_search_document_type: "ID",
    loaded_to_sfm: true
  },
  {
    transactionId: "doc-12",
    image_url: "https://visafoto.com/img/docs/mg_passport_40x40_mm.jpg",
    page_url: "https://open-bucket.storage/sensitive",
    country: "Spain",
    document_type: "Passport",
    created_at: "2025-03-18T08:45:00Z",
    state: "",
    ped_search_country: "ES",
    ped_search_document_type: "PASS",
    loaded_to_sfm: false
  },
  {
    transactionId: "doc-13",
    image_url: "https://farm3.static.flickr.com/2928/14230720722_4945db1d74.jpg",
    page_url: "https://data-exposure.com/documents",
    country: "Canada",
    document_type: "IDs",
    created_at: "2025-01-25T10:15:00Z",
    state: "Ontario",
    ped_search_country: "CA",
    ped_search_document_type: "ID",
    loaded_to_sfm: true
  },
  {
    transactionId: "doc-14",
    image_url: "https://optics.org/objects/news/thumb/9/3/33/Gemutopiaidcard03M.jpg",
    page_url: "https://leaked-data.org/ids",
    country: "Italy",
    document_type: "IDs",
    created_at: "2025-02-14T13:25:00Z",
    state: "",
    ped_search_country: "IT",
    ped_search_document_type: "ID",
    loaded_to_sfm: false
  },
  {
    transactionId: "doc-15",
    image_url: "http://images6.fanpop.com/image/photos/34600000/Corpse-party-I-D-card-Maurice-penguins-of-madagascar-34698589-790-600.jpg",
    page_url: "https://compromised-server.net/files",
    country: "Madagascar",
    document_type: "IDs",
    created_at: "2025-03-08T09:40:00Z",
    state: "",
    ped_search_country: "MG",
    ped_search_document_type: "ID",
    loaded_to_sfm: true
  },
  {
    transactionId: "doc-16",
    image_url: "https://m.media-amazon.com/images/I/71nGPF+3DXL.jpg",
    page_url: "https://unprotected-data.com/licenses",
    country: "Russia",
    document_type: "Driving License",
    created_at: "2025-01-30T15:50:00Z",
    state: "",
    ped_search_country: "RU",
    ped_search_document_type: "DL",
    loaded_to_sfm: false
  },
  {
    transactionId: "doc-17",
    image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Document_of_the_Deputy_of_the_Russian_Parliament_%286_calling%29.jpeg/640px-Document_of_the_Deputy_of_the_Russian_Parliament_%286_calling%29.jpeg",
    page_url: "https://data-dump.net/personal-documents",
    country: "Russia",
    document_type: "IDs",
    created_at: "2025-02-22T11:30:00Z",
    state: "Moscow",
    ped_search_country: "RU",
    ped_search_document_type: "ID",
    loaded_to_sfm: true
  },
  {
    transactionId: "doc-18",
    image_url: "https://www.thalesgroup.com/sites/default/files/gemalto/national-id-renditionid-1.jpg",
    page_url: "https://breached-database.org/documents",
    country: "Sweden",
    document_type: "IDs",
    created_at: "2025-03-15T14:10:00Z",
    state: "",
    ped_search_country: "SE",
    ped_search_document_type: "ID",
    loaded_to_sfm: false
  },
  {
    transactionId: "doc-19",
    image_url: "https://d1sr9z1pdl3mb7.cloudfront.net/wp-content/uploads/2020/04/28164335/Grow-digital-ID-system-for-emergency-and-reap-long-term-rewards-World-Bank-says.jpg",
    page_url: "https://exposed-credentials.com/ids",
    country: "Kenya",
    document_type: "IDs",
    created_at: "2025-01-12T12:20:00Z",
    state: "",
    ped_search_country: "KE",
    ped_search_document_type: "ID",
    loaded_to_sfm: true
  },
  {
    transactionId: "doc-20",
    image_url: "https://www.nytanintsika.org/en/wp-content/uploads/2020/05/rsz_cin_d%C3%A9livr%C3%A9_post_1_img_3128_-1024x768.jpg",
    page_url: "https://leaked-source.net/documents",
    country: "Madagascar",
    document_type: "IDs",
    created_at: "2025-02-05T09:05:00Z",
    state: "",
    ped_search_country: "MG",
    ped_search_document_type: "ID",
    loaded_to_sfm: false
  },
  {
    transactionId: "doc-21",
    image_url: "https://cdn.mega.mu/c/media/news/21/02/carte_didentite_mauricienne.jpg",
    page_url: "https://data-exposure.com/ids",
    country: "Mauritius",
    document_type: "IDs",
    created_at: "2025-03-20T10:50:00Z",
    state: "",
    ped_search_country: "MU",
    ped_search_document_type: "ID",
    loaded_to_sfm: true
  },
  {
    transactionId: "doc-22",
    image_url: "https://thumbs.dreamstime.com/z/madagascar-flag-business-card-standard-size-mm-business-card-template-bleed-under-clipping-mask-madagascar-flag-148218737.jpg",
    page_url: "https://insecure-api.com/personal-data",
    country: "Madagascar",
    document_type: "IDs",
    created_at: "2025-01-18T13:35:00Z",
    state: "",
    ped_search_country: "MG",
    ped_search_document_type: "ID",
    loaded_to_sfm: false
  },
  {
    transactionId: "doc-23",
    image_url: "https://c8.alamy.com/comp/2DFYFCC/madagascar-immigration-visa-closeup-visa-to-madagascar-focusing-on-word-visa-3d-rendering-travel-or-migration-to-madagascar-destination-concept-wit-2DFYFCC.jpg",
    page_url: "https://exposed-files.com/documents",
    country: "Madagascar",
    document_type: "Passport",
    created_at: "2025-02-25T15:15:00Z",
    state: "",
    ped_search_country: "MG",
    ped_search_document_type: "PASS",
    loaded_to_sfm: true
  },
  {
    transactionId: "doc-24",
    image_url: "https://c8.alamy.com/comp/2DFYFDD/madagascar-visa-document-with-madagascar-flag-in-background-madagascar-flag-with-close-up-text-visa-on-usa-visa-stamp-in-passport3d-renderingvisa-2DFYFDD.jpg",
    page_url: "https://data-breach.org/passports",
    country: "Madagascar",
    document_type: "Passport",
    created_at: "2025-03-01T11:55:00Z",
    state: "",
    ped_search_country: "MG",
    ped_search_document_type: "PASS",
    loaded_to_sfm: false
  }
];

// Return all unique countries for filtering
export const getUniqueCountries = (): string[] => {
  const countries = mockDocuments.map(doc => doc.country);
  return [...new Set(countries)];
};

// Return all unique document types for filtering
export const getUniqueDocumentTypes = (): string[] => {
  // We'll force the exact document types required
  return ["IDs", "Passport", "Driving License"];
};

// Return all unique states for filtering
export const getUniqueStates = (): string[] => {
  const states = mockDocuments.map(doc => doc.state).filter(state => state !== "");
  return [...new Set(states)];
};

// Get the states for a particular country
export const getStatesForCountry = (country: string): string[] => {
  if (!country || country === 'all') return [];
  
  const states = mockDocuments
    .filter(doc => doc.country === country && doc.state !== "")
    .map(doc => doc.state);
  
  return [...new Set(states)];
};

// Check if a country has multiple states
export const countryHasMultipleStates = (country: string): boolean => {
  if (!country || country === 'all') return false;
  
  const states = getStatesForCountry(country);
  return states.length > 0;
};

// Fetch documents with optional filtering
export const fetchDocuments = async (filters?: {
  searchText?: string;
  country?: string;
  documentType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  state?: string;
  transactionId?: string;
  sessionId?: string;
}): Promise<Document[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  let filteredDocs = [...mockDocuments];

  // Apply filters if provided
  if (filters) {
    if (filters.searchText) {
      const searchLower = filters.searchText.toLowerCase();
      filteredDocs = filteredDocs.filter(doc => 
        doc.image_url.toLowerCase().includes(searchLower)
      );
    }

    if (filters.country && filters.country !== 'All') {
      filteredDocs = filteredDocs.filter(doc => doc.country === filters.country);
    }

    if (filters.documentType && filters.documentType !== 'All') {
      filteredDocs = filteredDocs.filter(doc => doc.document_type === filters.documentType);
    }

    if (filters.dateFrom) {
      filteredDocs = filteredDocs.filter(doc => 
        new Date(doc.created_at) >= filters.dateFrom!
      );
    }

    if (filters.dateTo) {
      // Add one day to include the end date
      const endDate = new Date(filters.dateTo);
      endDate.setDate(endDate.getDate() + 1);
      filteredDocs = filteredDocs.filter(doc => 
        new Date(doc.created_at) <= endDate
      );
    }

    if (filters.state && filters.state !== 'All') {
      filteredDocs = filteredDocs.filter(doc => doc.state === filters.state);
    }

    // Add new filters for transaction ID and session ID
    if (filters.transactionId) {
      filteredDocs = filteredDocs.filter(doc =>
        doc.transactionId.toLowerCase().includes(filters.transactionId!.toLowerCase())
      );
    }

    if (filters.sessionId) {
      filteredDocs = filteredDocs.filter(doc =>
        doc.sessionId !== undefined && 
        doc.sessionId.toString().includes(filters.sessionId)
      );
    }
  }

  return filteredDocs;
};
