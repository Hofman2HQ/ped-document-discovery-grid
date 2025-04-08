
const { pool, sql } = require('../config/db');

// Get all PED details
exports.getAllPedDetails = async (req, res) => {
  try {
    const { country, state } = req.query;
    
    await pool.connect();
    let query = 'SELECT * FROM ped_details WHERE 1=1';
    const inputs = [];
    
    if (country) {
      query += ' AND country = @country';
      inputs.push({ name: 'country', type: sql.VarChar(50), value: country });
    }
    
    if (state) {
      query += ' AND state = @state';
      inputs.push({ name: 'state', type: sql.VarChar(50), value: state });
    }
    
    const request = pool.request();
    inputs.forEach(input => {
      request.input(input.name, input.type, input.value);
    });
    
    const result = await request.query(query);
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

// Get states by country
exports.getStatesByCountry = async (req, res) => {
  try {
    const { country } = req.params;
    
    await pool.connect();
    const result = await pool.request()
      .input('country', sql.VarChar(50), country)
      .query('SELECT DISTINCT state FROM ped_details WHERE country = @country AND state IS NOT NULL AND state <> \'\'');
    
    const states = result.recordset.map(record => record.state);
    res.status(200).json(states);
  } catch (error) {
    console.error('Error fetching states by country:', error);
    res.status(500).json({ message: 'Error fetching states', error: error.message });
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
