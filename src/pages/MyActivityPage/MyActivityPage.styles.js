import styled from 'styled-components';

export const Summary = styled.div`
  display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:18px 0 22px;
  div{background:${({ theme }) => theme.colors.blueSoft};border-radius:14px;padding:15px}.label{font-size:11px;color:${({ theme }) => theme.colors.mute}}strong{display:block;font-size:23px;margin-top:3px}.yellow{background:${({ theme }) => theme.colors.yellowSoft}}
`;
export const ActivityTabs = styled.div`
  display:flex;gap:4px;border-bottom:1px solid ${({ theme }) => theme.colors.line};margin-bottom:17px;overflow:auto;
  button{white-space:nowrap;border:0;border-bottom:2px solid transparent;background:none;padding:13px 15px;color:${({ theme }) => theme.colors.mute};font-size:12px;font-weight:800}button[aria-pressed=true]{border-bottom-color:${({ theme }) => theme.colors.blue};color:${({ theme }) => theme.colors.blue}}
`;
export const Empty = styled.div`padding:40px;text-align:center;color:${({ theme }) => theme.colors.mute};background:#fff;border:1px solid ${({ theme }) => theme.colors.line};border-radius:16px;font-size:12px;.emoji{font-size:30px}h3{font-size:15px;color:${({ theme }) => theme.colors.ink}}`;
export const Grid = styled.div`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;${({ theme }) => theme.media.tablet}{grid-template-columns:repeat(2,minmax(0,1fr))}${({ theme }) => theme.media.mobile}{grid-template-columns:1fr;article{display:grid;grid-template-columns:105px 1fr;min-height:170px}article>a:first-child{grid-row:1;grid-column:1}article>a:first-child>div{height:100%}article>div:last-child{grid-row:1;grid-column:2;padding:10px}}`;
