import styled from 'styled-components';

export const Mark = styled.span`
  width: ${({ $large }) => ($large ? '170px' : '34px')}; height: ${({ $large }) => ($large ? '170px' : '34px')};
  position: relative; flex: none; display: inline-flex; align-items: center; justify-content: center;
  border-radius: 50%; background: ${({ theme }) => theme.colors.blue}; transform: rotate(-7deg);
  box-shadow: ${({ $large }) => ($large ? '0 16px 40px rgba(30,111,232,.22)' : 'none')};
  b { color: ${({ theme }) => theme.colors.yellow}; font-weight: 950; line-height: 1; -webkit-text-stroke: 1.4px #17223b; paint-order: stroke fill; font-size: ${({ $large }) => ($large ? '68px' : '14px')}; }
  u { position: absolute; right: ${({ $large }) => ($large ? '24px' : '4px')}; bottom: ${({ $large }) => ($large ? '31px' : '5px')}; text-decoration: none; line-height: 1; color: ${({ theme }) => theme.colors.yellow}; font-weight: 950; -webkit-text-stroke: 1px #17223b; paint-order: stroke fill; font-size: ${({ $large }) => ($large ? '37px' : '8px')}; }
`;
