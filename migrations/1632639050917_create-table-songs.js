/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    year: {
        type: 'SMALLINT',
        notNull: true,
    },
    performer: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    genre: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    duration: {
        type: 'SMALLINT',
        notNull: true,
    },
    created_at: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    updated_at: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
  });
};

exports.down = pgm => {};
