import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <ApplicationStatus />
    </>
  );
}

function ApplicationStatus() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let appData = "Carregando...";

  if (!isLoading && data) {
    let updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
    let databaseInfo = data.database;
    appData = (
      <div>
        <p>Última atualização: {updatedAtText}</p>
        <p>Versão do PostgreSQL: {databaseInfo.version}</p>
        <p>Limite de conexões: {databaseInfo.max_connections}</p>
        <p>Conexões em uso: {databaseInfo.opened_connections}</p>
      </div>
    );
  }
  return appData;
}
