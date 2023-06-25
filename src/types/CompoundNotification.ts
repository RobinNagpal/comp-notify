import { EventsEnum } from '@/types/events/EventsEnum';

export interface CompoundNotification {
  event: EventsEnum;
  payload: any;
  transactionHash: string;
}
