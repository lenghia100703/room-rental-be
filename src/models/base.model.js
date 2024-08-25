import mongoose from 'mongoose'

class BaseModel {
    constructor(schemaDefinition) {
        this.schema = new mongoose.Schema(
            {
                ...schemaDefinition,
                createdBy: {
                    type: String,
                },
                updatedBy: {
                    type: String,
                },
            },
            {
                timestamps: true,
            }
        )
    }

    createModel(modelName) {
        return mongoose.model(modelName, this.schema)
    }
}

export default BaseModel
