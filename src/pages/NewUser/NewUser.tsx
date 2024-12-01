import { useForm, Controller } from "react-hook-form";
import { useHistory } from "react-router-dom";
import TextField from "~/components/TextField/TextField";
import Button from "~/components/Buttons";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { IconButton } from "~/components/Buttons/IconButton";
import { toast } from "react-toastify";
import * as S from "./styles";
import routes from "~/router/routes";
import useManageRegistrations from "~/hooks/registrations/useManageRegistrations/useManageRegistrations";
import {
  isValidCPF,
  isValidEmail,
  isValidEmployeeName,
} from "~/utils/validations/validations";

const NewUserPage = () => {
  const { createRegistration } = useManageRegistrations();
  const history = useHistory();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      employeeName: "",
      email: "",
      cpf: "",
      admissionDate: "",
    },
  });

  const goToHome = () => {
    history.push(routes.dashboard);
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await createRegistration({
        ...data,
        cpf: data.cpf.replace(/\D/g, ""),
      });

      if (response.error) {
        toast.error("Ocorreu um erro ao cadastrar o usuário.");
      } else {
        toast.success("Usuário cadastrado com sucesso!");
        history.push(routes.dashboard);
      }
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      toast.error("Erro ao cadastrar. Tente novamente mais tarde.");
    }
  };

  return (
    <S.Container>
      <S.Card>
        <IconButton onClick={goToHome} aria-label="back">
          <HiOutlineArrowLeft size={24} />
        </IconButton>
        <form onSubmit={handleSubmit(onSubmit)}>
          <S.ContainerInput>
            <Controller
              name="employeeName"
              control={control}
              rules={{
                required: "Nome é obrigatório",
                validate: (value) =>
                  isValidEmployeeName(value) ||
                  "Nome inválido, digite pelo menos duas palavras",
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Nome"
                  placeholder="Digite o nome"
                  error={error?.message}
                />
              )}
            />
          </S.ContainerInput>
          <S.ContainerInput>
            <Controller
              name="email"
              control={control}
              rules={{
                required: "E-mail é obrigatório",
                validate: (value) => isValidEmail(value) || "E-mail inválido",
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Email"
                  placeholder="Digite um e-mail válido"
                  type="email"
                  error={error?.message}
                />
              )}
            />
          </S.ContainerInput>
          <S.ContainerInput>
            <Controller
              name="cpf"
              control={control}
              rules={{
                required: "CPF é obrigatório",
                validate: (value) => isValidCPF(value) || "CPF inválido",
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  data-testid="cpf-input"
                  label="CPF"
                  placeholder="Digite um CPF válido"
                  mask="999.999.999-99"
                  error={error?.message}
                />
              )}
            />
          </S.ContainerInput>
          <S.ContainerInput>
            <Controller
              name="admissionDate"
              control={control}
              rules={{ required: "Data de admissão é obrigatória" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Data de admissão"
                  type="date"
                  error={error?.message}
                />
              )}
            />
          </S.ContainerInput>
          <Button type="submit">Cadastrar</Button>
        </form>
      </S.Card>
    </S.Container>
  );
};

export default NewUserPage;
