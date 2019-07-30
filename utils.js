function asyncMetadataRead(conn, object) {
  return new Promise((resolve, reject) => {
    conn.metadata.read('CustomObject', [object], (error, metadata) => {
      if (error) reject(error);
      resolve(metadata);
    });
  });
}

module.exports = {
  asyncMetadataRead
};
