const iterate = async (limit, fn) => {
  const iterator = async (offset) => {
    const response = await fn(offset, limit)
    return response.total > (offset + limit)
      ? [...response.items, ...await iterator(offset + limit)]
      : response.items
  }
  return iterator(0)
}

module.exports = { iterate }

