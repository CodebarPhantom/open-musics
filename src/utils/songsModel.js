const mapDBToModel = ({
  // eslint-disable-next-line camelcase
  id, title, year, performer, genre, duration, inserted_at, updated_at,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  insertedAt: inserted_at,
  updatedAt: updated_at,
});

const getSongs = ({ id, title, performer }) => ({
  id,
  title,
  performer,
});

module.exports = { mapDBToModel, getSongs };