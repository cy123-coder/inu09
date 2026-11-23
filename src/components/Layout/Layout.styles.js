import styled from 'styled-components';

export const Shell = styled.div`min-height:100vh;display:flex;flex-direction:column;`;
export const Header = styled.header`
  height:68px;flex:none;position:sticky;top:0;z-index:20;background:${({ theme }) => theme.colors.white};border-bottom:1px solid ${({ theme }) => theme.colors.line};
  display:flex;align-items:center;padding:0 max(24px,calc((100vw - 1120px)/2));gap:34px;
  ${({ theme }) => theme.media.mobile}{height:60px;padding:0 14px;gap:10px}
`;
export const Brand = styled.div`display:flex;align-items:center;gap:9px;color:${({ theme }) => theme.colors.blueDeep};font-size:17px;font-weight:900;letter-spacing:-.5px;white-space:nowrap;`;
export const Links = styled.nav`display:flex;align-items:center;gap:24px;flex:1;a{font-size:13px;font-weight:700;color:${({ theme }) => theme.colors.mute};padding:24px 0}a[aria-current=page]{color:${({ theme }) => theme.colors.blue};box-shadow:inset 0 -2px ${({ theme }) => theme.colors.blue}};${({ theme }) => theme.media.mobile}{display:none}`;
export const Search = styled.form`
  display:flex;align-items:center;gap:6px;border:1px solid ${({ theme }) => theme.colors.line};border-radius:999px;height:38px;padding:0 12px;width:230px;color:${({ theme }) => theme.colors.mute};
  input{min-width:0;width:100%;border:0;outline:0;font-size:12px;background:transparent;color:${({ theme }) => theme.colors.ink}}button{border:0;background:none;font-size:16px;color:${({ theme }) => theme.colors.mute}}
  ${({ theme }) => theme.media.mobile}{display:none}
`;
export const HeaderActions = styled.div`display:flex;align-items:center;gap:10px;white-space:nowrap;${({ theme }) => theme.media.mobile}{margin-left:auto;gap:0;>a:not(:last-child){display:none}>a:last-child{min-height:38px;padding:0 12px;font-size:11px}}`;
export const Button = styled.button`
  display:inline-flex;align-items:center;justify-content:center;text-align:center;line-height:1.2;
  min-height:42px;padding:0 17px;border:1px solid transparent;border-radius:12px;background:${({ $yellow, theme }) => $yellow ? theme.colors.yellow : theme.colors.blue};color:${({ $yellow, theme }) => $yellow ? '#3A2B00' : '#fff'};
  font-size:13px;font-weight:800;transition:transform .16s,filter .16s;&:hover{transform:translateY(-1px);filter:brightness(.98)}
  ${({ $outline, theme }) => $outline && `background:${theme.colors.white};color:${theme.colors.blueDeep};border-color:${theme.colors.line};`}
`;
export const TextButton = styled.button`border:0;background:transparent;color:${({ theme }) => theme.colors.mute};font-size:12px;font-weight:700;padding:8px;`;
export const Main = styled.main`width:min(1120px,calc(100% - 48px));margin:0 auto;flex:1;padding-bottom:74px;${({ theme }) => theme.media.mobile}{width:calc(100% - 28px);padding-bottom:94px}`;
export const Footer = styled.footer`min-height:72px;border-top:1px solid ${({ theme }) => theme.colors.line};display:flex;align-items:center;justify-content:center;gap:12px;color:${({ theme }) => theme.colors.mute};font-size:11px;background:#fff;`;
export const MobileNav = styled.nav`
  display:none;${({ theme }) => theme.media.mobile}{display:flex;position:fixed;z-index:25;bottom:0;left:0;right:0;height:68px;background:#fff;border-top:1px solid ${({ theme }) => theme.colors.line};padding-bottom:env(safe-area-inset-bottom);}
  a{flex:1;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:3px;font-size:10px;color:${({ theme }) => theme.colors.mute};font-weight:600}a[aria-current=page]{color:${({ theme }) => theme.colors.blue};font-weight:800}span{font-size:19px;line-height:1}
`;
export const ConfigNotice = styled.div`margin:14px auto 0;padding:10px 14px;background:${({ theme }) => theme.colors.yellowSoft};border:1px solid #f3dfa0;border-radius:12px;font-size:12px;color:#6a5100;`;
export const FormField = styled.label`
  display:flex;flex-direction:column;gap:7px;font-size:12px;font-weight:800;color:${({ theme }) => theme.colors.mute};
  input,select,textarea{width:100%;border:1px solid ${({ theme }) => theme.colors.line};background:#fff;border-radius:12px;padding:12px 13px;color:${({ theme }) => theme.colors.ink};outline:none;font-size:14px;}
  input:focus,select:focus,textarea:focus{border-color:${({ theme }) => theme.colors.blue};box-shadow:0 0 0 3px ${({ theme }) => theme.colors.blueSoft};}textarea{resize:vertical;min-height:105px;line-height:1.6}
`;
export const PageTitle = styled.div`
  margin:36px 0 20px;h1{font-size:27px;letter-spacing:-1px;margin:4px 0 6px}p{font-size:13px;color:${({ theme }) => theme.colors.mute};margin:0}.eyebrow{font-size:10px;letter-spacing:1.2px;font-weight:800;color:${({ theme }) => theme.colors.blue}}
  ${({ theme }) => theme.media.mobile}{margin:25px 0 17px;h1{font-size:23px}}
`;
