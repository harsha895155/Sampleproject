const mongoose = require('mongoose');

// Map to store tenant database connections for reuse
const tenantConnections = new Map();

/**
 * Get or create a connection to a specific tenant database
 * @param {string} dbName - The unique database name for the tenant
 * @returns {Promise<mongoose.Connection>}
 */
const getTenantConnection = async (dbName) => {
    if (tenantConnections.has(dbName)) {
        console.log(`ℹ️ Using existing connection for tenant: ${dbName}`);
        return tenantConnections.get(dbName);
    }

    const tenantUri = `${process.env.TENANT_DB_BASE_URI}${dbName}?authSource=admin`;
    
    try {
        const connection = await mongoose.createConnection(tenantUri);

        connection.on('connected', () => {
            console.log(`✅ Tenant Database [${dbName}] connected`);
        });

        connection.on('error', (err) => {
            console.error(`❌ Tenant Database [${dbName}] error:`, err);
        });

        tenantConnections.set(dbName, connection);
        return connection;
    } catch (error) {
        console.error(`❌ Failed to connect to tenant database [${dbName}]:`, error);
        throw error;
    }
};

module.exports = { getTenantConnection };


// const mongoose = require('mongoose');

// // Map to store tenant database connections for reuse
// const tenantConnections = new Map();

// /**
//  * Get or create a connection to a specific tenant database
//  * @param {string} dbName - The unique database name for the tenant
//  * @returns {Promise<mongoose.Connection>}
//  */
// const getTenantConnection = async (dbName) => {
//     if (tenantConnections.has(dbName)) {
//         console.log(`ℹ️ Using existing connection for tenant: ${dbName}`);
//         return tenantConnections.get(dbName);
//     }

//     const tenantUri = `${process.env.TENANT_DB_BASE_URI}${dbName}?authSource=admin`;
    
//     try {
//         const connection = await mongoose.createConnection(tenantUri);

//         connection.on('connected', () => {
//             console.log(`✅ Tenant Database [${dbName}] connected`);
//         });

//         connection.on('error', (err) => {
//             console.error(`❌ Tenant Database [${dbName}] error:`, err);
//         });

//         tenantConnections.set(dbName, connection);
//         return connection;
//     } catch (error) {
//         console.error(`❌ Failed to connect to tenant database [${dbName}]:`, error);
//         throw error;
//     }
// };

// module.exports = { getTenantConnection };
