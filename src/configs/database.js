import assert from 'node:assert'
import mongoose from 'mongoose'
import config from '#configs/environment'
import logger from '#configs/logger'

/**
 * @typedef {import('mongoose').Connection} Connection
 */

const formatArg = mongoose.Collection.prototype.$format

if (config.log.databaseQueries) {
    mongoose.set('debug', queryLogger)
}

/**
 * Connects to the MongoDB database.
 *
 * @param {string} uri - The MongoDB URI
 * @returns {Promise<Connection>} MongoDB connection
 */
export async function connect(uri) {
    await mongoose.connect(uri)
    return mongoose.connection
}

/**
 * Disconnects from the MongoDB database.
 */
export async function disconnect() {
    await mongoose.disconnect()
}

/**
 * Pings the MongoDB database.
 */
export async function ping() {
    const result = await mongoose.connection.db.admin().ping()
    assert(result?.ok === 1)
}

/**
 * Logs MongoDB queries.
 *
 * @param {string} collectionName - The collection name
 * @param {string} methodName - The method name
 * @param {any[]} methodArgs - The method arguments
 */
function queryLogger(collectionName, methodName, ...methodArgs) {
    const functionCall = [collectionName, methodName].join('.')

    const args = []
    for (let arg = methodArgs.length - 1; arg >= 0; --arg) {
        if (formatArg(methodArgs[arg]) || args.length > 0) {
            args.unshift(formatArg(methodArgs[arg]))
        }
    }

    const query = `${functionCall}(${args.join(', ')})`
    logger.debug({ query }, 'executing mongodb query')
}