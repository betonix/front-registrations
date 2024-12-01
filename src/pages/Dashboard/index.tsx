import { useEffect, useState } from "react";
import Collumns from "./components/Columns";
import * as S from "./styles";
import { SearchBar } from "./components/Searchbar";
import useFetchRegistrations from "~/hooks/registrations/useFetchRegistrations/useFetchRegistrations";
import LoadingScreen from "~/components/Loading";

const DashboardPage = () => {
  const { data, fetchRegistrations, loading } = useFetchRegistrations();
  const [cpf, setCPF] = useState("");

  useEffect(() => {
    fetchRegistrations(cpf);
  }, [cpf, fetchRegistrations]);

  return (
    <S.Container data-testid="dashboard-page">
      {loading && <LoadingScreen />}
      <SearchBar
        onSearch={(cpf: string) => setCPF(cpf)}
        onRefresh={() => fetchRegistrations(cpf)}
      />
      <Collumns
        registrations={data}
        onStatusChange={() => fetchRegistrations(cpf)}
      />
    </S.Container>
  );
};

export default DashboardPage;
