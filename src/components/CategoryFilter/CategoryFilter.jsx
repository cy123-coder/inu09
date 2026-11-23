import React from 'react';
import { Chip, FilterBox } from './CategoryFilter.styles.js';

export const CATEGORY_NAMES = ['전체', '식품', '생활', '전공책', '전자기기', '의류', '기타'];

export default function CategoryFilter({ value, onChange }) {
  return <FilterBox><h3>카테고리</h3><div className="filter-list">{CATEGORY_NAMES.map((category) => <Chip key={category} type="button" $active={value === category} aria-pressed={value === category} onClick={() => onChange(category)}>{category}</Chip>)}</div></FilterBox>;
}
