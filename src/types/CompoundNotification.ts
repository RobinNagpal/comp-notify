import { EventsEnum } from '@/types/events/EventsEnum';

export interface CompoundNotification<T> {
  event: EventsEnum;
  payload: T;
  transactionHash: string;
}
