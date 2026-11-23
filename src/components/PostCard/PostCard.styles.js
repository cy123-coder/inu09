import styled from 'styled-components';

export const Card = styled.article`
  min-width:0;background:#fff;border:1px solid ${({ theme }) => theme.colors.line};border-radius:16px;overflow:hidden;transition:transform .18s,box-shadow .18s;
  &:hover{transform:translateY(-3px);box-shadow:${({ theme }) => theme.shadow}}
  &.sold{opacity:.66}
`;
export const Visual = styled.div`
  height:112px;display:grid;place-items:center;position:relative;overflow:hidden;background:${({ $kind, theme }) => $kind === 'groupbuy' ? theme.colors.blueSoft : theme.colors.yellowSoft};
  &:before,&:after{content:'';position:absolute;border-radius:50%;background:${({ $kind, theme }) => $kind === 'groupbuy' ? `${theme.colors.blue}13` : `${theme.colors.yellow}3d`};width:138px;height:138px;right:-35px;top:-76px}
  &:after{width:82px;height:82px;right:auto;top:auto;left:-28px;bottom:-54px}
  .item-emoji{font-size:43px;z-index:1;filter:drop-shadow(0 7px 4px #2234)}
`;
export const Badge = styled.span`
  position:absolute;top:10px;left:10px;padding:4px 8px;border-radius:999px;background:${({ $kind, theme }) => $kind === 'groupbuy' ? theme.colors.blue : theme.colors.yellow};color:${({ $kind }) => $kind === 'groupbuy' ? '#fff' : '#493700'};font-weight:900;font-size:10px;z-index:2;
`;
export const Favorite = styled.button`
  position:absolute;top:8px;right:8px;z-index:3;width:34px;height:34px;border:1px solid ${({ theme }) => theme.colors.line};border-radius:50%;background:#fff;color:${({ $active, theme }) => $active ? theme.colors.blue : theme.colors.mute};font-size:18px;line-height:1;
`;
export const Body = styled.div`
  padding:13px 14px 14px;.meta{font-size:10px;color:${({ theme }) => theme.colors.mute};display:flex;gap:6px;align-items:center}.meta span+span:before{content:'·';margin-right:6px;color:#b7bfcd}
  h3{font-size:14px;letter-spacing:-.35px;margin:7px 0 4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .description{font-size:11px;line-height:1.55;color:${({ theme }) => theme.colors.mute};margin:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:34px}
  .price{font-size:17px;font-weight:900;letter-spacing:-.3px;margin:12px 0 8px}.price small{font-size:11px;font-weight:600;color:${({ theme }) => theme.colors.mute}}
  .counts{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:8px;font-size:10px;color:${({ theme }) => theme.colors.mute}}.counts b{color:${({ theme }) => theme.colors.blueDeep}}
  .details{display:flex;align-items:center;justify-content:space-between;border-top:1px solid ${({ theme }) => theme.colors.line};margin-top:11px;padding-top:10px;font-size:10px;color:${({ theme }) => theme.colors.mute}}
`;
