
const { pool, sql } = require('../config/db');

// Mock data for development
const mockQueries = [
  {
    id: 1,
    query: "nederland id card",
    insertDatetime: "2021-11-03T14:18:54.546Z",
    updateDatetime: "2021-11-14T09:57:52.780Z"
  },
  {
    id: 2,
    query: "Israel Driver license",
    insertDatetime: "2022-07-19T07:38:10.476Z",
    updateDatetime: "2022-07-19T07:38:10.476Z"
  },
  {
    id: 3,
    query: "Algeria Id Card",
    insertDatetime: "2022-07-19T07:38:10.640Z",
    updateDatetime: "2022-07-19T07:38:10.640Z"
  },
  {
    id: 4,
    query: "United Kingdom Passport",
    insertDatetime: "2023-01-15T11:22:33.123Z",
    updateDatetime: "2023-02-20T15:30:45.987Z"
  },
  {
    id: 5,
    query: "France National ID",
    insertDatetime: "2023-05-10T08:45:12.333Z",
    updateDatetime: "2023-05-10T08:45:12.333Z"
  },
  {
    id: 6,
    query: "Germany Residence Permit",
    insertDatetime: "2023-09-22T16:30:05.777Z",
    updateDatetime: "2023-10-15T12:20:45.123Z"
  }
];

// Get all collector queries
exports.getAllCollectorQueries = async (req, res) => {
  try {
    // For development, return mock data
    return res.status(200).json(mockQueries);
    
    // When database is ready, use this:
    /*
    await pool.connect();
    const result = await pool.request().query('SELECT * FROM ped_collector_query');
    res.status(200).json(result.recordset);
    */
  } catch (error) {
    console.error('Error fetching collector queries:', error);
    res.status(500).json({ message: 'Error fetching collector queries', error: error.message });
  }
};

// Get collector query by ID
exports.getCollectorQueryById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // For development, return mock data
    const query = mockQueries.find(q => q.id === parseInt(id));
    if (!query) {
      return res.status(404).json({ message: 'Collector query not found' });
    }
    return res.status(200).json(query);
    
    // When database is ready, use this:
    /*
    await pool.connect();
    const result = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM ped_collector_query WHERE id = @id');
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'Collector query not found' });
    }
    
    res.status(200).json(result.recordset[0]);
    */
  } catch (error) {
    console.error('Error fetching collector query by ID:', error);
    res.status(500).json({ message: 'Error fetching collector query', error: error.message });
  }
};

// Create new collector query
exports.createCollectorQuery = async (req, res) => {
  try {
    const { query } = req.body;
    
    // Validate input
    if (!query) {
      return res.status(400).json({ 
        message: 'Query text is required' 
      });
    }
    
    // For development, return mock data
    const now = new Date();
    const newQuery = {
      id: mockQueries.length > 0 ? Math.max(...mockQueries.map(q => q.id)) + 1 : 1,
      query,
      insertDatetime: now.toISOString(),
      updateDatetime: now.toISOString()
    };
    
    mockQueries.push(newQuery);
    return res.status(201).json(newQuery);
    
    // When database is ready, use this:
    /*
    await pool.connect();
    const result = await pool.request()
      .input('query', sql.VarChar(500), query)
      .query(`
        INSERT INTO ped_collector_query 
        (query, insertDatetime, updateDatetime)
        VALUES (@query, GETDATE(), GETDATE());
        
        SELECT SCOPE_IDENTITY() AS id;
      `);
    
    const newId = result.recordset[0].id;
    
    res.status(201).json({ 
      id: newId,
      query,
      insertDatetime: new Date(),
      updateDatetime: new Date(),
    });
    */
  } catch (error) {
    console.error('Error creating collector query:', error);
    res.status(500).json({ message: 'Error creating collector query', error: error.message });
  }
};

// Update collector query
exports.updateCollectorQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const { query } = req.body;
    
    // For development, update mock data
    const queryIndex = mockQueries.findIndex(q => q.id === parseInt(id));
    if (queryIndex === -1) {
      return res.status(404).json({ message: 'Collector query not found' });
    }
    
    const now = new Date();
    const updatedQuery = {
      ...mockQueries[queryIndex],
      query,
      updateDatetime: now.toISOString()
    };
    
    mockQueries[queryIndex] = updatedQuery;
    return res.status(200).json(updatedQuery);
    
    // When database is ready, use this:
    /*
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
      .input('query', sql.VarChar(500), query)
      .query(`
        UPDATE ped_collector_query
        SET query = @query,
            updateDatetime = GETDATE()
        WHERE id = @id
      `);
    
    res.status(200).json({ 
      id: parseInt(id),
      query,
      updateDatetime: new Date()
    });
    */
  } catch (error) {
    console.error('Error updating collector query:', error);
    res.status(500).json({ message: 'Error updating collector query', error: error.message });
  }
};

// Delete collector query
exports.deleteCollectorQuery = async (req, res) => {
  try {
    const { id } = req.params;
    
    // For development, delete from mock data
    const queryIndex = mockQueries.findIndex(q => q.id === parseInt(id));
    if (queryIndex === -1) {
      return res.status(404).json({ message: 'Collector query not found' });
    }
    
    mockQueries.splice(queryIndex, 1);
    return res.status(200).json({ message: 'Collector query deleted successfully' });
    
    // When database is ready, use this:
    /*
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
    */
  } catch (error) {
    console.error('Error deleting collector query:', error);
    res.status(500).json({ message: 'Error deleting collector query', error: error.message });
  }
};

// Execute query and update last run time
exports.executeCollectorQuery = async (req, res) => {
  try {
    const { id } = req.params;
    
    // For development, find in mock data
    const query = mockQueries.find(q => q.id === parseInt(id));
    if (!query) {
      return res.status(404).json({ message: 'Collector query not found' });
    }
    
    const executedAt = new Date();
    const updatedQuery = {
      ...query,
      updateDatetime: executedAt.toISOString()
    };
    
    // Update the mock data
    const queryIndex = mockQueries.findIndex(q => q.id === parseInt(id));
    mockQueries[queryIndex] = updatedQuery;
    
    // Return success message
    return res.status(200).json({ 
      message: 'Query executed successfully',
      queryId: parseInt(id),
      executedAt
    });
    
    // When database is ready, use this:
    /*
    await pool.connect();
    
    // Check if record exists
    const checkResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM ped_collector_query WHERE id = @id');
    
    if (checkResult.recordset.length === 0) {
      return res.status(404).json({ message: 'Collector query not found' });
    }
    
    // Update last run time
    await pool.request()
      .input('id', sql.Int, id)
      .input('updateDatetime', sql.DateTime, new Date())
      .query(`
        UPDATE ped_collector_query
        SET updateDatetime = @updateDatetime
        WHERE id = @id
      `);
    
    res.status(200).json({ 
      message: 'Query executed successfully',
      queryId: parseInt(id),
      executedAt: new Date()
    });
    */
  } catch (error) {
    console.error('Error executing collector query:', error);
    res.status(500).json({ message: 'Error executing collector query', error: error.message });
  }
};
