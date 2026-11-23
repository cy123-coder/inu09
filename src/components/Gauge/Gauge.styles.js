import styled from 'styled-components';

export const Track = styled.div`
  height:8px;overflow:hidden;border-radius:999px;background:${({ theme }) => theme.colors.blueSoft};
  span{height:100%;width:${({ $progress }) => Math.max(0,Math.min(100,$progress))}%;display:block;border-radius:inherit;background:${({ $full, theme }) => $full ? theme.colors.yellow : theme.colors.blue};transition:width .25s ease}
`;
