import { InputHTMLAttributes } from "react";
import styled from "styled-components";
import InputMask from "react-input-mask";

export const Input = styled.input`
  padding: 0 8px;
  vertical-align: middle;
  border-radius: 8px;
  width: 100%;
  min-height: 36px;
  background-color: #ffffff;
  border: 1px solid rgba(36, 28, 21, 0.3);
  transition: all 0.2s ease-in-out;
  font-size: 16px;
  line-height: 18px;
  font-weight: normal;

  :focus {
    outline: none;
    border: 1px solid #007c89;
    box-shadow: inset 0 0 0 1px #007c89;
  }
`;

type Props = {
  label?: string;
  error?: string;
  mask?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
} & InputHTMLAttributes<HTMLInputElement>;

const TextField = ({ label, error, mask, id, ...rest }: Props) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <div>
      {label && <label htmlFor={inputId}>{label}</label>}
      {mask ? (
        <InputMask mask={mask} {...rest}>
          {(inputProps: React.InputHTMLAttributes<HTMLInputElement>) => (
            <Input {...inputProps} id={inputId} />
          )}
        </InputMask>
      ) : (
        <Input {...rest} id={inputId} />
      )}
      {error && <span style={{ fontSize: 12, color: "red" }}>{error}</span>}
    </div>
  );
};

export default TextField;
