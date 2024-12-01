import * as S from "./styles";
import RegistrationCard from "../RegistrationCard";
import { RegistrationStatus, SeparatedData } from "~/types/registrations";

export const allColumns = [
  { status: "REVIEW", title: "Pronto para revisar" },
  { status: "APPROVED", title: "Aprovado" },
  { status: "REPROVED", title: "Reprovado" },
];

type Props = {
  registrations: SeparatedData;
  onStatusChange: () => void;
};

const Collumns = ({ registrations, onStatusChange }: Props) => {
  const renderColumnContent = (status: RegistrationStatus) => {
    const items = registrations[status] || [];
    return items.map((registration) => (
      <RegistrationCard
        data-testid="registration-card"
        onStatusChange={() => onStatusChange()}
        data={registration}
        key={registration.id}
      />
    ));
  };

  return (
    <S.Container>
      {allColumns.map(({ status, title }) => (
        <S.Column status={status} key={status}>
          <S.TitleColumn status={status}>{title}</S.TitleColumn>
          <S.CollumContent>
            {renderColumnContent(status as RegistrationStatus)}
          </S.CollumContent>
        </S.Column>
      ))}
    </S.Container>
  );
};

export default Collumns;
