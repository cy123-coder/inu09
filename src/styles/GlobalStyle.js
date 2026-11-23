import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html { min-width: 320px; scroll-behavior: smooth; }
  body { margin: 0; background: ${({ theme }) => theme.colors.bg}; color: ${({ theme }) => theme.colors.ink}; font-family: ${({ theme }) => theme.font}; -webkit-font-smoothing: antialiased; }
  button, input, select, textarea { font: inherit; }
  button { cursor: pointer; }
  button:disabled { cursor: not-allowed; opacity: .55; }
  a { color: inherit; text-decoration: none; }
  :focus-visible { outline: 3px solid ${({ theme }) => theme.colors.yellow}; outline-offset: 2px; }
  ::selection { background: ${({ theme }) => theme.colors.yellowSoft}; }
`;

export default GlobalStyle;
