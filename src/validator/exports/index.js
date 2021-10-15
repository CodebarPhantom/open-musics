const { ExportSongsSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const ExportsValidator = {
    validateExportSongsPayload: (payload) => {
        const validationResult = ExportSongsSchema.validate(payload);

        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = ExportsValidator;
