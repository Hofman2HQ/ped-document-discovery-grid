
const { pool, sql } = require('../config/db');

// Get all source URLs
exports.getAllSourceUrls = async (req, res) => {
  try {
    await pool.connect();
    const result = await pool.request().query('SELECT * FROM ped_source_url');
    res.status(200).json(result.recordset);
  } catch (error) {
    console.error('Error fetching source URLs:', error);
    res.status(500).json({ message: 'Error fetching source URLs', error: error.message });
  }
};

// Get source URL by ID
exports.getSourceUrlById = async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.connect();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM ped_source_url WHERE id = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Source URL not found' });
    }
    
    res.status(200).json(result.recordset[0]);
  } catch (error) {
    console.error('Error fetching source URL by ID:', error);
    res.status(500).json({ message: 'Error fetching source URL', error: error.message });
  }
};

// Create new source URL
exports.createSourceUrl = async (req, res) => {
  try {
    const { transaction_id, image_url, page_url } = req.body;
    
    // Validate input
    if (!transaction_id || !image_url || !page_url) {
      return res.status(400).json({ 
        message: 'Transaction ID, image URL, and page URL are required' 
      });
    }
    
    await pool.connect();
    const result = await pool.request()
      .input('transaction_id', sql.VarChar(50), transaction_id)
      .input('image_url', sql.VarChar(500), image_url)
      .input('page_url', sql.VarChar(500), page_url)
      .query(`
        INSERT INTO ped_source_url 
        (transaction_id, image_url, page_url, discovered_at)
        VALUES (@transaction_id, @image_url, @page_url, GETDATE());
        
        SELECT SCOPE_IDENTITY() AS id;
      `);
    
    const newId = result.recordset[0].id;
    
    res.status(201).json({ 
      id: newId,
      transaction_id,
      image_url,
      page_url,
      discovered_at: new Date()
    });
  } catch (error) {
    console.error('Error creating source URL:', error);
    res.status(500).json({ message: 'Error creating source URL', error: error.message });
  }
};

// Update source URL
exports.updateSourceUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { image_url, page_url } = req.body;
    
    await pool.connect();
    
    // Check if record exists
    const checkResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM ped_source_url WHERE id = @id');
    
    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Source URL not found' });
    }
    
    // Update record
    await pool.request()
      .input('id', sql.Int, id)
      .input('image_url', sql.VarChar(500), image_url)
      .input('page_url', sql.VarChar(500), page_url)
      .query(`
        UPDATE ped_source_url
        SET image_url = @image_url,
            page_url = @page_url
        WHERE id = @id
      `);
    
    res.status(200).json({ 
      id: parseInt(id),
      image_url,
      page_url
    });
  } catch (error) {
    console.error('Error updating source URL:', error);
    res.status(500).json({ message: 'Error updating source URL', error: error.message });
  }
};

// Delete source URL
exports.deleteSourceUrl = async (req, res) => {
  try {
    const { id } = req.params;
    
    await pool.connect();
    
    // Check if record exists
    const checkResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM ped_source_url WHERE id = @id');
    
    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Source URL not found' });
    }
    
    // Delete record
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM ped_source_url WHERE id = @id');
    
    res.status(200).json({ message: 'Source URL deleted successfully' });
  } catch (error) {
    console.error('Error deleting source URL:', error);
    res.status(500).json({ message: 'Error deleting source URL', error: error.message });
  }
};
