import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createGroupBuy } from '../../api/groupbuys.js';
import { createUsedItem } from '../../api/usedItems.js';
import { uploadPostImages } from '../../api/storage.js';
import { FormField, PageTitle } from '../../components/Layout/Layout.styles.js';
import { useAuth } from '../../hooks/AuthContext.jsx';
import { categoryId, savePreviewPost } from '../../lib/formatters.js';
import { isSupabaseConfigured } from '../../lib/supabaseClient.js';
import { FormCard } from './NewPostPage.styles.js';

const categories = ['식품', '생활', '전공책', '전자기기', '의류', '기타'];

export default function NewPostPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [kind, setKind] = useState('groupbuy');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('식품');
  const [place, setPlace] = useState('');
  const [totalPrice, setTotalPrice] = useState('');
  const [minParticipants, setMinParticipants] = useState('2');
  const [maxParticipants, setMaxParticipants] = useState('10');
  const [deadline, setDeadline] = useState('');
  const [condition, setCondition] = useState('좋음');
  const [price, setPrice] = useState('');
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const perPerson = useMemo(() => Math.ceil((Number(totalPrice) || 0) / Math.max(1, Number(maxParticipants) || 1)), [totalPrice, maxParticipants]);

  if (isSupabaseConfigured && !user) return <PageTitle><span className="eyebrow">NEW POST</span><h1>로그인이 필요해요</h1><p>공고를 등록하려면 인천대학교 계정으로 로그인해 주세요.</p><Link to="/login?next=%2Fnew">로그인하러 가기 →</Link></PageTitle>;

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true); setError('');
    try {
      let images = [];
      if (isSupabaseConfigured && files.length) images = await uploadPostImages(files, user.id);
      if (kind === 'groupbuy') {
        if (Number(minParticipants) > Number(maxParticipants)) throw new Error('최소 인원은 정원보다 클 수 없어요.');
        if (deadline && new Date(deadline) <= new Date()) throw new Error('모집 마감 시각은 현재보다 뒤여야 해요.');
        const payload = { title: title.trim(), description: description.trim(), category_id: categoryId(category, kind), images, min_participants: Number(minParticipants), max_participants: Number(maxParticipants), total_price: Number(totalPrice), price_per_person: perPerson, pickup_place: place.trim(), deadline: deadline ? new Date(deadline).toISOString() : null, status: 'open' };
        if (isSupabaseConfigured) await createGroupBuy(payload);
        else savePreviewPost({ ...payload, id: `preview-${crypto.randomUUID()}`, type: 'groupbuy', category_name: category, current_participants: 0, created_at: new Date().toISOString(), profiles: { nickname: '미리보기 사용자' } });
        navigate('/home?kind=groupbuy', { state: { notice: '공구 공고를 등록했어요.' } });
      } else {
        const payload = { title: title.trim(), description: description.trim(), category_id: categoryId(category, kind), images, price: Number(price), condition, place: place.trim(), status: 'selling' };
        if (isSupabaseConfigured) await createUsedItem(payload);
        else savePreviewPost({ ...payload, id: `preview-${crypto.randomUUID()}`, type: 'used', category_name: category, favorite_count: 0, created_at: new Date().toISOString(), profiles: { nickname: '미리보기 사용자' } });
        navigate('/home?kind=used', { state: { notice: '중고 공고를 등록했어요.' } });
      }
    } catch (cause) { setError(cause.message || '공고를 등록하지 못했어요.'); }
    finally { setBusy(false); }
  };

  return <><PageTitle><span className="eyebrow">SHARE WITH INU</span><h1>새 공고 올리기</h1><p>필요한 이웃과 함께 나누고 거래해요.</p></PageTitle>
    <FormCard onSubmit={submit}><div className="switch"><button type="button" aria-pressed={kind === 'groupbuy'} onClick={() => setKind('groupbuy')}>공구 모집</button><button type="button" aria-pressed={kind === 'used'} onClick={() => setKind('used')}>중고 판매</button></div>
      <div className="fields"><FormField>상품명<input required maxLength={80} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="예: 두꺼운 두루마리 휴지 30롤" /></FormField>
        <div className="grid"><FormField>카테고리<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((entry) => <option key={entry}>{entry}</option>)}</select></FormField>{kind === 'used' && <FormField>상품 상태<select value={condition} onChange={(event) => setCondition(event.target.value)}>{['새 상품', '매우 좋음', '좋음', '사용감 있음'].map((entry) => <option key={entry}>{entry}</option>)}</select></FormField>}</div>
        {kind === 'groupbuy' ? <><div className="grid"><FormField>물품 총액 (원)<input type="number" min="1" required value={totalPrice} onChange={(event) => setTotalPrice(event.target.value)} placeholder="예: 120000" /></FormField><FormField>정원 (명)<input type="number" min="1" max="999" required value={maxParticipants} onChange={(event) => setMaxParticipants(event.target.value)} /></FormField></div><div className="grid"><FormField>최소 모집 인원<input type="number" min="1" max={maxParticipants} required value={minParticipants} onChange={(event) => setMinParticipants(event.target.value)} /></FormField><FormField>모집 마감<input type="datetime-local" required value={deadline} onChange={(event) => setDeadline(event.target.value)} /><span className="help">마감 전까지 참여자를 모집해요.</span></FormField></div><div className="price-preview"><span>정원 기준 예상 1인 금액 <span className="help">(원 단위 올림)</span></span><strong>{perPerson.toLocaleString('ko-KR')}원</strong></div></> : <FormField>판매 가격 (원)<input type="number" min="0" required value={price} onChange={(event) => setPrice(event.target.value)} placeholder="예: 8000" /></FormField>}
        <FormField>{kind === 'groupbuy' ? '수령 장소' : '거래 장소'}<input required maxLength={80} value={place} onChange={(event) => setPlace(event.target.value)} placeholder="예: 인천대학교 정문" /></FormField>
        <FormField>상세 설명<textarea required maxLength={1000} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="상품 정보와 나누는 방법을 적어주세요." /></FormField>
        <FormField>사진 (최대 5장)<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={(event) => { const selected = Array.from(event.target.files || []).slice(0, 5); if (selected.some((file) => file.size > 5 * 1024 * 1024)) { setError('사진 한 장은 5MB 이하여야 해요.'); setFiles([]); return; } setError(''); setFiles(selected); }} /><span className="upload">＋ 사진을 선택해 주세요</span><span className="file-list">{files.map((file) => file.name).join(' · ') || '사진은 선택 사항이에요.'}</span></FormField>
      </div>{error && <p className="error" role="alert">{error}</p>}<button className="submit" type="submit" disabled={busy}>{busy ? '등록 중…' : '공고 등록하기　→'}</button>
    </FormCard>
  </>;
}
