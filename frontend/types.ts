export interface SurveyItem {
  id: string;
  en: string;
  ur: string;
}

export interface BoxDefinition {
  boxNumber: number;
  clusterTitleEn: string;
  clusterTitleUr: string;
  colorScheme: string;
  activities: SurveyItem[];
  personalQualities: SurveyItem[];
  schoolSubjects: SurveyItem[];
  careerExamplesEn: string[];
  careerExamplesUr: string[];
  descriptionEn: string;
  descriptionUr: string;
}

export interface StudentInfo {
  name: string;
  school: string;
  classGrade: string;
  date: string;
}

export type LanguageMode = 'bilingual' | 'en' | 'ur';

export interface BoxScore {
  boxNumber: number;
  titleEn: string;
  titleUr: string;
  count: number;
  selectedIds: string[];
  percentage: number;
}
