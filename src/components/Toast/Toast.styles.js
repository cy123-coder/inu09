import styled from 'styled-components';

export const Message = styled.div`
  position: fixed; z-index: 50; left: 50%; bottom: 28px; transform: translateX(-50%);
  max-width: calc(100vw - 32px); padding: 13px 18px; border-radius: 12px;
  color: #fff; background: ${({ theme }) => theme.colors.ink}; box-shadow: ${({ theme }) => theme.shadow};
  font-size: 13px; text-align: center; animation: enter .18s ease-out;
  @keyframes enter { from { opacity: 0; translate: 0 6px; } to { opacity: 1; translate: 0 0; } }
`;
