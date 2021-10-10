const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToModel, getSongs } = require('../../utils/mapDBModel');

class SongsService {
    constructor() {
        this._pool = new Pool();
    }

    async addSongs({
        title, year, performer, genre, duration,
    }) {
        const id = `song-${nanoid(16)}`;
        const insertedAt = new Date().toISOString();

        const query = {
            text: 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6, $7, $7) RETURNING id',
            values: [id, title, year, performer, genre, duration, insertedAt],
        };

        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Music gagal ditambahkan');
        }

        return result.rows[0].id;
    }

    async getSongs() {
        const result = await this._pool.query('SELECT * FROM songs');
        return result.rows.map(getSongs);
    }

    async getSongById(id) {
        const query = {
            text: 'SELECT id, title, performer FROM songs WHERE id = $1',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Music tidak ditemukan');
        }

        return result.rows.map(mapDBToModel)[0];
    }

    async editSongById(id, {
        title, year, performer, genre, duration,
    }) {
        const updatedAt = new Date().toISOString();
        const query = {
            text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, updated_at = $6 WHERE id = $7 RETURNING id',
            values: [title, year, performer, genre, duration, updatedAt, id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Gagal memperbarui music. Id tidak ditemukan!');
        }
    }

    async deleteSongById(id) {
        const query = {
            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('Gagal menghapus music. Id tidak ditemukan!');
        }
    }
}

module.exports = SongsService;