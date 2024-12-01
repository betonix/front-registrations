import styled from "styled-components";

export const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const Modal = styled.div`
  background: #fff;
  border-radius: 8px;
  width: 400px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export const Title = styled.h2`
  margin-bottom: 10px;
  font-size: 20px;
  color: #333;
`;

export const Message = styled.p`
  margin-bottom: 20px;
  font-size: 16px;
  color: #666;
`;

export const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

export const Button = styled.button<{ variant: "confirm" | "cancel" }>`
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  color: #fff;

  background-color: ${(props) =>
    props.variant === "confirm" ? "#4CAF50" : "#F44336"};
  &:hover {
    opacity: 0.9;
  }
`;
