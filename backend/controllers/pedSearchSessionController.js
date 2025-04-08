
const { pool, sql } = require('../config/db');

// Get all search sessions
exports.getAllSearchSessions = async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query('SELECT * FROM ped_search_session');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching search sessions:', error);
    res.status(500).json({ message: 'Error fetching search sessions', error: error.message });
  }
};

// Get search session by ID
exports.getSearchSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.connect();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM ped_search_session WHERE id = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Search session not found' });
    }
    
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching search session by ID:', error);
    res.status(500).json({ message: 'Error fetching search session', error: error.message });
  }
};

// Create new search session
exports.createSearchSession = async (req, res) => {
  try {
    const { transaction_id, search_country, search_document_type } = req.body;
    
    // Validate input
    if (!transaction_id || !search_country || !search_document_type) {
      return res.status(400).json({ 
        message: 'Transaction ID, search country, and search document type are required' 
      });
    }
    
    await pool.connect();
    const result = await pool.request()
      .input('transaction_id', sql.VarChar(50), transaction_id)
      .input('search_country', sql.VarChar(50), search_country)
      .input('search_document_type', sql.VarChar(50), search_document_type)
      .query(`
        INSERT INTO ped_search_session 
        (transaction_id, search_country, search_document_type, search_timestamp)
        VALUES (@transaction_id, @search_country, @search_document_type, GETDATE());
        
        SELECT SCOPE_IDENTITY() AS id;
      `);
    
    const newId = result.recordset[0].id;
    
    res.status(201).json({ 
      id: newId,
      transaction_id,
      search_country,
      search_document_type,
      search_timestamp: new Date()
    });
  } catch (error) {
    console.error('Error creating search session:', error);
    res.status(500).json({ message: 'Error creating search session', error: error.message });
  }
};

// Update search session
exports.updateSearchSession = async (req, res) => {
  try {
    const { id } = req.params;
    const { search_country, search_document_type } = req.body;
    
    await pool.connect();
    
    // Check if record exists
    const checkResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM ped_search_session WHERE id = @id');
    
    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Search session not found' });
    }
    
    // Update record
    await pool.request()
      .input('id', sql.Int, id)
      .input('search_country', sql.VarChar(50), search_country)
      .input('search_document_type', sql.VarChar(50), search_document_type)
      .query(`
        UPDATE ped_search_session
        SET search_country = @search_country,
            search_document_type = @search_document_type
        WHERE id = @id
      `);
    
    res.status(200).json({ 
      id: parseInt(id),
      search_country,
      search_document_type
    });
  } catch (error) {
    console.error('Error updating search session:', error);
    res.status(500).json({ message: 'Error updating search session', error: error.message });
  }
};

// Delete search session
exports.deleteSearchSession = async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.connect();
    
    // Check if record exists
    const checkResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM ped_search_session WHERE id = @id');
    
    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Search session not found' });
    }
    
    // Delete record
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM ped_search_session WHERE id = @id');
    
    res.status(200).json({ message: 'Search session deleted successfully' });
  } catch (error) {
    console.error('Error deleting search session:', error);
    res.status(500).json({ message: 'Error deleting search session', error: error.message });
  }
};
