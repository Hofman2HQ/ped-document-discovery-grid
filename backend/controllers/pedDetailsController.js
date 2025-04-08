const { pool, sql } = require('../config/db');
const axios = require('axios');

// Get all PED details
exports.getAllPedDetails = async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query('SELECT * FROM ped_details');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching PED details:', error);
    res.status(500).json({ message: 'Error fetching PED details', error: error.message });
  }
};

// Get PED detail by ID
exports.getPedDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.connect();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM ped_details WHERE id = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'PED detail not found' });
    }
    
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching PED detail by ID:', error);
    res.status(500).json({ message: 'Error fetching PED detail', error: error.message });
  }
};

// Get PED details by transaction ID
exports.getPedDetailsByTransactionId = async (req, res) => {
  try {
    const { transactionId } = req.params;
    
    await pool.connect();
    const result = await pool.request()
      .input('transactionId', sql.VarChar(50), transactionId)
      .query('SELECT * FROM ped_details WHERE transaction_id = @transactionId');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'No PED details found for this transaction ID' });
    }
    
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching PED details by transaction ID:', error);
    res.status(500).json({ message: 'Error fetching PED details', error: error.message });
  }
};

// Create new PED detail
exports.createPedDetail = async (req, res) => {
  try {
    const { transaction_id, document_type, country, state, loaded_to_sfm } = req.body;
    
    // Validate input
    if (!transaction_id || !document_type || !country) {
      return res.status(400).json({ message: 'Transaction ID, document type, and country are required' });
    }
    
    await pool.connect();
    const result = await pool.request()
      .input('transaction_id', sql.VarChar(50), transaction_id)
      .input('document_type', sql.VarChar(50), document_type)
      .input('country', sql.VarChar(50), country)
      .input('state', sql.VarChar(50), state || '')
      .input('loaded_to_sfm', sql.Bit, loaded_to_sfm || false)
      .query(`
        INSERT INTO ped_details (transaction_id, document_type, country, state, created_at, loaded_to_sfm)
        VALUES (@transaction_id, @document_type, @country, @state, GETDATE(), @loaded_to_sfm);
        
        SELECT SCOPE_IDENTITY() AS id;
      `);
    
    const newId = result.recordset[0].id;
    
    res.status(201).json({ 
      id: newId,
      transaction_id,
      document_type,
      country,
      state: state || '',
      created_at: new Date(),
      loaded_to_sfm: loaded_to_sfm || false
    });
  } catch (error) {
    console.error('Error creating PED detail:', error);
    res.status(500).json({ message: 'Error creating PED detail', error: error.message });
  }
};

// Update PED detail
exports.updatePedDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { document_type, country, state, loaded_to_sfm } = req.body;
    
    await pool.connect();
    
    // Check if record exists
    const checkResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM ped_details WHERE id = @id');
    
    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: 'PED detail not found' });
    }
    
    // Update record
    await pool.request()
      .input('id', sql.Int, id)
      .input('document_type', sql.VarChar(50), document_type)
      .input('country', sql.VarChar(50), country)
      .input('state', sql.VarChar(50), state || '')
      .input('loaded_to_sfm', sql.Bit, loaded_to_sfm)
      .query(`
        UPDATE ped_details
        SET document_type = @document_type,
            country = @country,
            state = @state,
            loaded_to_sfm = @loaded_to_sfm
        WHERE id = @id
      `);
    
    res.status(200).json({ 
      id: parseInt(id),
      document_type,
      country,
      state: state || '',
      loaded_to_sfm
    });
  } catch (error) {
    console.error('Error updating PED detail:', error);
    res.status(500).json({ message: 'Error updating PED detail', error: error.message });
  }
};

// Delete PED detail
exports.deletePedDetail = async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.connect();
    
    // Check if record exists
    const checkResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM ped_details WHERE id = @id');
    
    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: 'PED detail not found' });
    }
    
    // Delete record
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM ped_details WHERE id = @id');
    
    res.status(200).json({ message: 'PED detail deleted successfully' });
  } catch (error) {
    console.error('Error deleting PED detail:', error);
    res.status(500).json({ message: 'Error deleting PED detail', error: error.message });
  }
};

// Extract document details using OCR
exports.extractDocumentDetailsWithOCR = async (req, res) => {
  try {
    const { image_url } = req.body;

    if (!image_url) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    // Use the OCR utility function to extract document details
    const documentDetails = await extractDocumentDetailsWithOCR(image_url);

    res.status(200).json(documentDetails);
  } catch (error) {
    console.error('Error extracting document details with OCR:', error);
    res.status(500).json({ 
      message: 'Error extracting document details', 
      error: error.message 
    });
  }
};

// OCR utility function to extract document details from image
async function extractDocumentDetailsWithOCR(imageUrl) {
  try {
    // For demo purposes, we'll use a rule-based approach to identify document types and countries
    // In a production environment, you would use a proper OCR API like Google Cloud Vision, Azure Computer Vision, or Tesseract.js
    
    const imageUrlLower = imageUrl.toLowerCase();
    
    // Default values
    let documentType = 'IDs';
    let country = 'Unknown';
    let ped_search_document_type = 'ID';
    
    // Document type detection based on URL patterns
    if (imageUrlLower.includes('passport') || imageUrlLower.includes('visa')) {
      documentType = 'Passport';
      ped_search_document_type = 'PASS';
    } else if (imageUrlLower.includes('license') || imageUrlLower.includes('driving') || 
              imageUrlLower.includes('permis') || imageUrlLower.includes('conduire')) {
      documentType = 'Driving License';
      ped_search_document_type = 'DL';
    } else {
      documentType = 'IDs';
      ped_search_document_type = 'ID';
    }
    
    // Country detection based on URL patterns
    if (imageUrlLower.includes('madagascar') || imageUrlLower.includes('malagasy')) {
      country = 'Madagascar';
      ped_search_country = 'MG';
    } else if (imageUrlLower.includes('uk') || imageUrlLower.includes('united-kingdom')) {
      country = 'United Kingdom';
      ped_search_country = 'UK';
    } else if (imageUrlLower.includes('us') || imageUrlLower.includes('united-states')) {
      country = 'United States';
      ped_search_country = 'US';
    } else if (imageUrlLower.includes('cameroon')) {
      country = 'Cameroon';
      ped_search_country = 'CM';
    } else if (imageUrlLower.includes('malta')) {
      country = 'Malta';
      ped_search_country = 'MT';
    } else if (imageUrlLower.includes('russia')) {
      country = 'Russia';
      ped_search_country = 'RU';
    } else if (imageUrlLower.includes('mauritius') || imageUrlLower.includes('mauricienne')) {
      country = 'Mauritius';
      ped_search_country = 'MU';
    } else if (imageUrlLower.includes('semlex')) {
      // Semlex is a Belgian company that produces IDs for African countries
      country = 'Democratic Republic of Congo';
      ped_search_country = 'CD';
    } else {
      // Default fallback to Madagascar for demo purposes
      country = 'Madagascar';
      ped_search_country = 'MG';
    }
    
    return {
      document_type: documentType,
      country: country,
      ped_search_document_type,
      ped_search_country
    };
  } catch (error) {
    console.error('Error in OCR utility function:', error);
    throw new Error('Failed to extract document details');
  }
}
