
# PED Backend API

This is a Node.js backend application for the Publicly Exposed Documents (PED) system. It connects to a Microsoft SQL Server database and provides RESTful API endpoints for managing document data.

## Tables

The application manages the following tables:

1. **ped_details** - Core document information
2. **ped_search_session** - Search session metadata
3. **ped_source_url** - Source URLs where documents were found
4. **ped_collector_query** - Queries used to collect document information

## Setup

### Prerequisites

- Node.js (v14+)
- Microsoft SQL Server

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and update the values
4. Initialize the database:
   - Run the SQL commands in `database/schema.sql`

### Running the Application

Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### PED Details

- `GET /api/ped-details` - Get all PED details
- `GET /api/ped-details/:id` - Get PED detail by ID
- `POST /api/ped-details` - Create new PED detail
- `PUT /api/ped-details/:id` - Update PED detail
- `DELETE /api/ped-details/:id` - Delete PED detail

### Search Sessions

- `GET /api/search-sessions` - Get all search sessions
- `GET /api/search-sessions/:id` - Get search session by ID
- `POST /api/search-sessions` - Create new search session
- `PUT /api/search-sessions/:id` - Update search session
- `DELETE /api/search-sessions/:id` - Delete search session

### Source URLs

- `GET /api/source-urls` - Get all source URLs
- `GET /api/source-urls/:id` - Get source URL by ID
- `POST /api/source-urls` - Create new source URL
- `PUT /api/source-urls/:id` - Update source URL
- `DELETE /api/source-urls/:id` - Delete source URL

### Collector Queries

- `GET /api/collector-queries` - Get all collector queries
- `GET /api/collector-queries/:id` - Get collector query by ID
- `POST /api/collector-queries` - Create new collector query
- `PUT /api/collector-queries/:id` - Update collector query
- `DELETE /api/collector-queries/:id` - Delete collector query
- `POST /api/collector-queries/:id/execute` - Execute a collector query

## API Request Examples

### Create PED Detail

```json
POST /api/ped-details
{
  "transaction_id": "doc-123",
  "document_type": "Passport",
  "country": "United States",
  "state": "California",
  "loaded_to_sfm": true
}
```

### Create Search Session

```json
POST /api/search-sessions
{
  "transaction_id": "doc-123",
  "search_country": "US",
  "search_document_type": "PASS"
}
```

### Create Source URL

```json
POST /api/source-urls
{
  "transaction_id": "doc-123",
  "image_url": "https://example.com/image.jpg",
  "page_url": "https://example.com/page"
}
```

### Create Collector Query

```json
POST /api/collector-queries
{
  "query_text": "intext:passport filetype:jpg",
  "target_country": "US",
  "target_document_type": "PASS",
  "is_active": true
}
```
