import * as S from "./ModalConfirmation.styles";

type Props = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const ModalConfirmation = ({ isOpen, onConfirm, onCancel }: Props) => {
  if (!isOpen) return null;

  return (
    <S.Backdrop>
      <S.Modal>
        <S.Title>Confirmação</S.Title>
        <S.Message>Tem certeza que deseja realizar essa ação?</S.Message>
        <S.Actions>
          <S.Button
            onClick={onCancel}
            variant="cancel"
            data-testid="modal-cancel-button"
          >
            Cancelar
          </S.Button>
          <S.Button
            onClick={onConfirm}
            variant="confirm"
            data-testid="modal-confirm-button"
          >
            Confirmar
          </S.Button>
        </S.Actions>
      </S.Modal>
    </S.Backdrop>
  );
};

export default ModalConfirmation;
