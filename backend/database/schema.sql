
-- Database Schema for PED (Publicly Exposed Documents) System

-- Create database if it doesn't exist
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'PedDatabase')
BEGIN
  CREATE DATABASE PedDatabase;
END
GO

USE PedDatabase;
GO

-- Create ped_details table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ped_details')
BEGIN
  CREATE TABLE ped_details (
    id INT IDENTITY(1,1) PRIMARY KEY,
    transaction_id VARCHAR(50) NOT NULL,
    document_type VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    state VARCHAR(50),
    created_at DATETIME DEFAULT GETDATE(),
    loaded_to_sfm BIT DEFAULT 0
  );
END
GO

-- Create ped_search_session table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ped_search_session')
BEGIN
  CREATE TABLE ped_search_session (
    id INT IDENTITY(1,1) PRIMARY KEY,
    transaction_id VARCHAR(50) NOT NULL,
    search_country VARCHAR(50) NOT NULL,
    search_document_type VARCHAR(50) NOT NULL,
    search_timestamp DATETIME DEFAULT GETDATE()
  );
END
GO

-- Create ped_source_url table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ped_source_url')
BEGIN
  CREATE TABLE ped_source_url (
    id INT IDENTITY(1,1) PRIMARY KEY,
    transaction_id VARCHAR(50) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    page_url VARCHAR(500) NOT NULL,
    discovered_at DATETIME DEFAULT GETDATE()
  );
END
GO

-- Create ped_collector_query table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ped_collector_query')
BEGIN
  CREATE TABLE ped_collector_query (
    id INT IDENTITY(1,1) PRIMARY KEY,
    query_text VARCHAR(500) NOT NULL,
    target_country VARCHAR(50) NOT NULL,
    target_document_type VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    last_run_at DATETIME DEFAULT GETDATE(),
    is_active BIT DEFAULT 1
  );
END
GO

-- Add indexes
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_ped_details_transaction_id')
BEGIN
  CREATE INDEX idx_ped_details_transaction_id ON ped_details(transaction_id);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_ped_search_session_transaction_id')
BEGIN
  CREATE INDEX idx_ped_search_session_transaction_id ON ped_search_session(transaction_id);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_ped_source_url_transaction_id')
BEGIN
  CREATE INDEX idx_ped_source_url_transaction_id ON ped_source_url(transaction_id);
END
GO

-- Create relationships via foreign keys
-- Note: In a production environment, you might want to add foreign key constraints
-- between transaction_id fields across tables to ensure data integrity
