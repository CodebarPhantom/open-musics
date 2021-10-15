require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

// error for pre response
const errorPreResponse = require('./api/exceptions');

// songs
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/tokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

// colaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

// exports
const _exports = require('./api/exports');
const ProducerService = require('./services/exports/ProducerService');
const ExportsValidator = require('./validator/exports');

// uploads
const uploads = require('./api/uploads');
const UploadsService = require('./services/uploads/UploadsService');
const UploadsValidator = require('./validator/uploads');

// caching
const CacheControl = require('./services/cache/CacheControl');


const init = async () => {
    const cacheControl = new CacheControl();
    const songsService = new SongsService(cacheControl);
    const usersService = new UsersService();
    const authenticationsService = new AuthenticationsService();
    const collaborationsService = new CollaborationsService(cacheControl);
    const playlistsService = new PlaylistsService(collaborationsService, cacheControl);
    const uploadsService = new UploadsService(path.resolve(__dirname, 'api/uploads/pictures'));

    const server = Hapi.server({
        host: process.env.HOST,
        port: process.env.PORT,
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    await server.register([
        {
            plugin: Jwt,
        },
        {
            plugin: Inert,
        },
    ]);

    // mendefinisikan strategy autentikasi jwt
    server.auth.strategy('openmusic_jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
            aud: false,
            iss: false,
            sub: false,
            maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
            isValid: true,
            credentials: {
                id: artifacts.decoded.payload.id,
            },
        }),
    });

    await server.register([
        {
            plugin: errorPreResponse,
        },
        {
            plugin: songs,
            options: {
                service: songsService,
                validator: SongsValidator,
            },
        },
        {
            plugin: users,
            options: {
                service: usersService,
                validator: UsersValidator,
            },
        },
        {
            plugin: authentications,
            options: {
                authenticationsService,
                usersService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            },
        },
        {
            plugin: playlists,
            options: {
                service: playlistsService,
                validator: PlaylistsValidator,
            },
        },
        {
            plugin: collaborations,
            options: {
                collaborationsService,
                playlistsService,
                validator: CollaborationsValidator,
            },
        },
        {
            plugin: _exports,
            options: {
                exportsService: ProducerService,
                playlistsService,
                validator: ExportsValidator,
            },
        },
        {
            plugin: uploads,
            options: {
                service: uploadsService,
                validator: UploadsValidator,
            },
        },
    ]);

    server.start();
    console.log(`Server telah berjalan pada ${server.info.uri}`);
};

init();
