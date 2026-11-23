import styled from 'styled-components';

export const Screen = styled.main`
  min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;background:#fff;cursor:pointer;
  p{font-size:14px;color:${({ theme }) => theme.colors.mute};margin:0}
  .pulse{animation:pulse 1.6s ease-in-out infinite}@keyframes pulse{0%,100%{transform:scale(1) rotate(-7deg)}50%{transform:scale(1.035) rotate(-7deg)}}
`;
