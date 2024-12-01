import { useState } from "react";
import { ButtonSmall } from "~/components/Buttons";
import * as S from "./styles";
import {
  HiOutlineMail,
  HiOutlineUser,
  HiOutlineCalendar,
  HiOutlineTrash,
} from "react-icons/hi";
import { Registration, RegistrationStatus } from "~/types/registrations";
import useManageRegistrations from "~/hooks/registrations/useManageRegistrations/useManageRegistrations";
import { toast } from "react-toastify";
import ModalConfirmation from "~/components/ModalConfimation/ModalConfirmation";

type Props = {
  data: Registration;
  onStatusChange: () => void;
};

const RegistrationCard = ({ data, onStatusChange }: Props) => {
  const { removeRegistration, updateStatus } = useManageRegistrations();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<
    "delete" | RegistrationStatus | null
  >(null);

  const handleOpenModal = (action: "delete" | RegistrationStatus) => {
    setModalAction(action);
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    try {
      if (modalAction === "delete") {
        const response = await removeRegistration(data.id);
        if (response?.error) {
          return toast.error("Erro ao remover registro");
        }
        toast.success("Registro removido com sucesso");
      } else if (modalAction) {
        const response = await updateStatus(data.id, modalAction, data);
        if (response?.error) {
          return toast.error("Erro ao atualizar status");
        }
        toast.success(`Status atualizado para ${modalAction}`);
      }
      onStatusChange();
    } catch (err) {
      toast.error("Ocorreu um erro ao processar a ação.");
    } finally {
      setIsModalOpen(false);
      setModalAction(null);
    }
  };

  const handleCancelAction = () => {
    setIsModalOpen(false);
    setModalAction(null);
  };

  return (
    <>
      <S.Card>
        <S.IconAndText>
          <HiOutlineUser />
          <h3>{data.employeeName}</h3>
        </S.IconAndText>
        <S.IconAndText>
          <HiOutlineMail />
          <p>{data.email}</p>
        </S.IconAndText>
        <S.IconAndText>
          <HiOutlineCalendar />
          <span>{data.admissionDate}</span>
        </S.IconAndText>
        <S.Actions>
          {data.status === RegistrationStatus.REVIEW && (
            <>
              <ButtonSmall
                onClick={() => handleOpenModal(RegistrationStatus.REPROVED)}
                bgcolor="rgb(255, 145, 154)"
              >
                Reprovar
              </ButtonSmall>
              <ButtonSmall
                onClick={() => handleOpenModal(RegistrationStatus.APPROVED)}
                bgcolor="rgb(155, 229, 155)"
              >
                Aprovar
              </ButtonSmall>
            </>
          )}
          {data.status !== RegistrationStatus.REVIEW && (
            <ButtonSmall
              onClick={() => handleOpenModal(RegistrationStatus.REVIEW)}
              bgcolor="#ff8858"
              data-testid={`button-review-${data.id}`}
            >
              Revisar novamente
            </ButtonSmall>
          )}

          <HiOutlineTrash
            data-testid="trash-icon"
            onClick={() => handleOpenModal("delete")}
          />
        </S.Actions>
      </S.Card>

      <ModalConfirmation
        isOpen={isModalOpen}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
      />
    </>
  );
};

export default RegistrationCard;
