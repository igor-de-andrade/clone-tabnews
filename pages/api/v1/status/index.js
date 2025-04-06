import database from "/infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const dbVersionResult = await database.query("SHOW server_version;");
  const dbVersion = dbVersionResult.rows[0].server_version;

  const dbMaxConnectionsResult = await database.query("SHOW max_connections;");
  const dbMaxConnections = dbMaxConnectionsResult.rows[0].max_connections;

  const dbName = process.env.POSTGRES_DB;
  const dbOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int AS open_connections FROM pg_stat_activity WHERE datname = $1;",
    values: [dbName],
  });
  const dbOpenedConnections =
    dbOpenedConnectionsResult.rows[0].open_connections;

  response.status(200).json({
    updated_at: updatedAt,
    database: {
      max_connections: parseInt(dbMaxConnections),
      opened_connections: dbOpenedConnections,
      version: dbVersion,
    },
  });
}

export default status;
