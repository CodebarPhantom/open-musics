const path = require('path');

const routes = (handler) => [
    {
        method: 'POST',
        path: '/upload/pictures',
        handler: handler.postUploadImagesHandler,
        options: {
            payload: {
                allow: 'multipart/form-data',
                multipart: true,
                maxBytes: 500000,
                output: 'stream',
            },
        },
    },
    {
        method: 'GET',
        path: '/upload/pictures/{param*}',
        handler: {
            directory: {
                path: path.resolve(__dirname, 'pictures'),
            },
        },
    },
];

module.exports = routes;
