
const { pool, sql } = require('../config/db');

// Get all collector queries
exports.getAllCollectorQueries = async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query('SELECT * FROM ped_collector_query');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching collector queries:', error);
    res.status(500).json({ message: 'Error fetching collector queries', error: error.message });
  }
};

// Get collector query by ID
exports.getCollectorQueryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.connect();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM ped_collector_query WHERE id = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Collector query not found' });
    }
    
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching collector query by ID:', error);
    res.status(500).json({ message: 'Error fetching collector query', error: error.message });
  }
};

// Create new collector query
exports.createCollectorQuery = async (req, res) => {
  try {
    const { query_text, target_country, target_document_type, is_active } = req.body;
    
    // Validate input
    if (!query_text || !target_country || !target_document_type) {
      return res.status(400).json({ 
        message: 'Query text, target country, and target document type are required' 
      });
    }
    
    await pool.connect();
    const result = await pool.request()
      .input('query_text', sql.VarChar(500), query_text)
      .input('target_country', sql.VarChar(50), target_country)
      .input('target_document_type', sql.VarChar(50), target_document_type)
      .input('is_active', sql.Bit, is_active || true)
      .query(`
        INSERT INTO ped_collector_query 
        (query_text, target_country, target_document_type, created_at, last_run_at, is_active)
        VALUES (@query_text, @target_country, @target_document_type, GETDATE(), GETDATE(), @is_active);
        
        SELECT SCOPE_IDENTITY() AS id;
      `);
    
    const newId = result.recordset[0].id;
    
    res.status(201).json({ 
      id: newId,
      query_text,
      target_country,
      target_document_type,
      created_at: new Date(),
      last_run_at: new Date(),
      is_active: is_active || true
    });
  } catch (error) {
    console.error('Error creating collector query:', error);
    res.status(500).json({ message: 'Error creating collector query', error: error.message });
  }
};

// Update collector query
exports.updateCollectorQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { query_text, target_country, target_document_type, is_active } = req.body;
    
    await pool.connect();
    
    // Check if record exists
    const checkResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM ped_collector_query WHERE id = @id');
    
    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Collector query not found' });
    }
    
    // Update record
    await pool.request()
      .input('id', sql.Int, id)
      .input('query_text', sql.VarChar(500), query_text)
      .input('target_country', sql.VarChar(50), target_country)
      .input('target_document_type', sql.VarChar(50), target_document_type)
      .input('is_active', sql.Bit, is_active)
      .input('last_run_at', sql.DateTime, new Date())
      .query(`
        UPDATE ped_collector_query
        SET query_text = @query_text,
            target_country = @target_country,
            target_document_type = @target_document_type,
            last_run_at = @last_run_at,
            is_active = @is_active
        WHERE id = @id
      `);
    
    res.status(200).json({ 
      id: parseInt(id),
      query_text,
      target_country,
      target_document_type,
      last_run_at: new Date(),
      is_active
    });
  } catch (error) {
    console.error('Error updating collector query:', error);
    res.status(500).json({ message: 'Error updating collector query', error: error.message });
  }
};

// Delete collector query
exports.deleteCollectorQuery = async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.connect();
    
    // Check if record exists
    const checkResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM ped_collector_query WHERE id = @id');
    
    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Collector query not found' });
    }
    
    // Delete record
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM ped_collector_query WHERE id = @id');
    
    res.status(200).json({ message: 'Collector query deleted successfully' });
  } catch (error) {
    console.error('Error deleting collector query:', error);
    res.status(500).json({ message: 'Error deleting collector query', error: error.message });
  }
};

// Execute query and update last run time
exports.executeCollectorQuery = async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.connect();
    
    // Check if record exists
    const checkResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM ped_collector_query WHERE id = @id');
    
    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Collector query not found' });
    }
    
    const query = checkResult.recordset[0];
    
    if (!query.is_active) {
      return res.status(400).json({ message: 'Query is not active' });
    }
    
    // Update last run time
    await pool.request()
      .input('id', sql.Int, id)
      .input('last_run_at', sql.DateTime, new Date())
      .query(`
        UPDATE ped_collector_query
        SET last_run_at = @last_run_at
        WHERE id = @id
      `);
    
    // Here you would implement the actual query execution logic
    // For now, we'll just return a success message
    
    res.status(200).json({ 
      message: 'Query executed successfully',
      queryId: parseInt(id),
      executedAt: new Date()
    });
  } catch (error) {
    console.error('Error executing collector query:', error);
    res.status(500).json({ message: 'Error executing collector query', error: error.message });
  }
};
