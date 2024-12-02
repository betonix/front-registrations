import { HiRefresh } from "react-icons/hi";
import { useHistory } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import Button from "~/components/Buttons";
import { IconButton } from "~/components/Buttons/IconButton";
import TextField from "~/components/TextField/TextField";
import routes from "~/router/routes";
import * as S from "./styles";
import { isValidCPF } from "~/utils/validations/validations";
import { removeMaskCPFInput } from "~/utils/formatter/formatter";

export const SearchBar = ({
  onSearch,
  onRefresh,
}: {
  onSearch: (cpf: string) => void;
  onRefresh: () => void;
}) => {
  const history = useHistory();

  const { control } = useForm<{ cpf: string }>({
    defaultValues: { cpf: "" },
  });

  const goToNewAdmissionPage = () => {
    history.push(routes.newUser);
  };

  const onSubmit = (data: { cpf: string }) => {
    const cleanCpf = data.cpf.replace(/\D/g, "");
    onSearch(cleanCpf);
  };

  return (
    <S.Container>
      <S.Form>
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
                label="CPF"
                placeholder="Digite um CPF válido"
                mask="999.999.999-99"
                error={error?.message}
                onChange={(e) => {
                  field.onChange(e);
                  const value = e.target.value;
                  if (isValidCPF(value)) {
                    onSubmit({ cpf: value });
                  }
                  if (removeMaskCPFInput(value) == "") {
                    onSearch("");
                  }
                }}
              />
            )}
          />
        </S.ContainerInput>
        <S.Actions>
          <IconButton
            aria-label="refetch"
            onClick={() => {
              onRefresh();
            }}
          >
            <HiRefresh />
          </IconButton>
          <Button onClick={goToNewAdmissionPage}>Nova Admissão</Button>
        </S.Actions>
      </S.Form>
    </S.Container>
  );
};
