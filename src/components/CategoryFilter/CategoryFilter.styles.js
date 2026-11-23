import styled from 'styled-components';

export const FilterBox = styled.aside`
  width:190px;flex:none;border:1px solid ${({ theme }) => theme.colors.line};border-radius:16px;padding:17px;background:#fff;height:max-content;
  h3{font-size:13px;margin:0 0 12px}.filter-list{display:flex;flex-direction:column;gap:3px}
  ${({ theme }) => theme.media.tablet}{width:100%;border:0;background:transparent;padding:0;overflow:hidden;h3{margin:0 0 9px}.filter-list{flex-direction:row;overflow:auto;scrollbar-width:none}.filter-list::-webkit-scrollbar{display:none}}
  ${({ theme }) => theme.media.mobile}{width:100%;border:0;background:transparent;padding:0;overflow:hidden;h3{margin:0 0 9px}.filter-list{flex-direction:row;overflow:auto;scrollbar-width:none}.filter-list::-webkit-scrollbar{display:none}}
`;
export const Chip = styled.button`
  min-height:36px;white-space:nowrap;text-align:left;padding:0 11px;border:0;border-radius:10px;background:${({ $active, theme }) => $active ? theme.colors.yellowSoft : 'transparent'};color:${({ $active, theme }) => $active ? '#745500' : theme.colors.mute};font-size:12px;font-weight:${({ $active }) => $active ? 800 : 600};
  ${({ theme }) => theme.media.tablet}{border:1px solid ${({ theme }) => theme.colors.line};border-radius:999px;background:${({ $active, theme }) => $active ? theme.colors.yellowSoft : '#fff'};min-height:44px}
  ${({ theme }) => theme.media.mobile}{border:1px solid ${({ theme }) => theme.colors.line};border-radius:999px;background:${({ $active, theme }) => $active ? theme.colors.yellowSoft : '#fff'};min-height:44px}
`;
