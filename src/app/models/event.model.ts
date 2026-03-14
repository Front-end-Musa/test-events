export interface EventISO {
  id: number;
  title: string;
  description: string;
  date: string;
  category: 'Conference' | 'Webinar' | 'Meeting' | string;
  status: 'Planned' | 'Completed' | 'Canceled' | string;
  favorite: boolean;
  registered?: boolean;
}