import styled from 'styled-components';

export const Heading = styled.div`
  display:flex;align-items:flex-end;justify-content:space-between;margin:31px 0 16px;
  .eyebrow{font-size:10px;letter-spacing:1.2px;font-weight:900;color:${({ theme }) => theme.colors.blue}}h2{font-size:23px;letter-spacing:-.8px;margin:5px 0 3px}p{font-size:12px;color:${({ theme }) => theme.colors.mute};margin:0}
  ${({ theme }) => theme.media.mobile}{margin:25px 0 13px;h2{font-size:21px}p{font-size:11px}}
`;
export const Tabs = styled.div`
  display:flex;gap:6px;border-bottom:1px solid ${({ theme }) => theme.colors.line};margin-bottom:16px;
  button{min-height:43px;padding:0 15px;border:0;border-bottom:2px solid transparent;background:transparent;color:${({ theme }) => theme.colors.mute};font-size:12px;font-weight:800;white-space:nowrap}
  button[aria-pressed=true]{border-bottom-color:${({ theme }) => theme.colors.blue};color:${({ theme }) => theme.colors.blue}}
`;
export const ListingLayout = styled.div`
  display:flex;align-items:flex-start;gap:22px;
  .content{min-width:0;flex:1}.content-head{display:flex;justify-content:space-between;align-items:center;margin:0 0 12px;font-size:11px;color:${({ theme }) => theme.colors.mute}}.content-head b{color:${({ theme }) => theme.colors.ink}}
  .filters{display:flex;flex-direction:column;gap:17px}
  ${({ theme }) => theme.media.tablet}{display:block;.filters{margin-bottom:16px}}
  ${({ theme }) => theme.media.mobile}{display:block;.filters{margin-bottom:14px}}
`;
export const Grid = styled.div`
  display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px;
  ${({ theme }) => theme.media.tablet}{grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}
  ${({ theme }) => theme.media.mobile}{grid-template-columns:1fr;gap:10px}
  ${({ theme }) => theme.media.mobile}{article{display:grid;grid-template-columns:105px 1fr;min-height:174px}article>a:first-child{grid-row:1;grid-column:1;min-height:100%}article>a:first-child>div{height:100%;min-height:174px}article>div:last-child{grid-row:1;grid-column:2;padding:11px 11px 10px}article>button{top:5px;right:5px;width:44px;height:44px}article>div:last-child .description{font-size:10px;min-height:31px}article>div:last-child .price{font-size:15px;margin:8px 0 5px}article>div:last-child .details{margin-top:8px;padding-top:7px}}
`;
export const LoadMore = styled.button`
  display:block;margin:22px auto 48px;min-height:42px;padding:0 22px;border:1px solid ${({ theme }) => theme.colors.line};background:#fff;border-radius:999px;color:${({ theme }) => theme.colors.ink};font-size:12px;font-weight:800;
`;
export const Notice = styled.div`padding:25px;text-align:center;background:#fff;border:1px solid ${({ theme }) => theme.colors.line};border-radius:16px;color:${({ theme }) => theme.colors.mute};font-size:13px;margin:12px 0 24px;`;
export const Floating = styled.button`
  display:none;${({ theme }) => theme.media.mobile}{display:block;position:fixed;right:16px;bottom:82px;z-index:18;border:0;border-radius:999px;background:${({ theme }) => theme.colors.yellow};color:#3a2b00;min-height:48px;padding:0 18px;font-size:13px;font-weight:900;box-shadow:0 6px 20px #17223b30}
`;
