
import { EventData, Plan } from '../../types';

export interface UIContent {
  landingPage: any;
  planSelection: any;
  guestForm: any;
  bookingSummary: any;
}

export interface AppConfig {
  TAX_RATE: number;
  STUDENT_DISCOUNT_PERCENT: number;
  SERVICE_DISCOUNT_PERCENT: number;
  KIDS_DISCOUNT_PERCENT: number;
  ADDONS: {
    FOOD_PASS: number;
    ADVENTURE_PASS: number;
    EXTRA_STAY_BASE: number;
  };
  COUPONS: any[];
  ROOM_TYPES: any[];
}

export interface EventResponse {
  event: EventData;
  schedule: any[];
  mentors: any;
  insights: any[];
}

export const fetchData = async <T>(path: string): Promise<T> => {
  const response = await fetch(`/data/${path}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }
  return response.json();
};

export const getAllData = async () => {
  const [eventData, plans, uiContent, config] = await Promise.all([
    fetchData<EventResponse>('event.json'),
    fetchData<Plan[]>('plans.json'),
    fetchData<UIContent>('ui-content.json'),
    fetchData<AppConfig>('config.json')
  ]);

  return {
    eventData,
    plans,
    uiContent,
    config
  };
};
