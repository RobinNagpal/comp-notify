import { getAssetDetails } from '@/components/notifications/getAssetDetails';
import { CompoundNotification } from '@/types/CompoundNotification';
import { EventsEnum } from '@/types/events/EventsEnum';
import { ethers } from 'ethers';
import { readFileSync } from 'fs';
import * as Handlebars from 'handlebars';
import * as sgMail from '@sendgrid/mail';

Handlebars.registerHelper('eq', (v1, v2) => {
  return v1 === v2;
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY!); // use SendGrid API Key from environment variable

async function getNotificationBody(notification: CompoundNotification<any>) {
  const defaultProvider = ethers.getDefaultProvider('homestead', { etherscan: process.env.ETHERSCAN_API_KEY });
  if (
    notification.event === EventsEnum.SupplyCollateral ||
    notification.event === EventsEnum.WithdrawCollateral ||
    notification.event === EventsEnum.TransferCollateral ||
    notification.event === EventsEnum.WithdrawReserves
  ) {
    // Load template from a file and compile it
    const source = readFileSync('./src/handlebars/CompNotification.hbs', 'utf8');
    const template = Handlebars.compile(source);
    const assetDetails = await getAssetDetails(notification.payload.asset, notification.payload.amount, defaultProvider);
    return template({ notification, assetDetails });
  }
  return '';
}

export const sendNotificationEmail = async (events: CompoundNotification<any>[]) => {
  // Generate an HTML email body

  const htmls: string[] = [];
  for (const event of events) {
    htmls.push(await getNotificationBody(event));
  }
  const html = htmls.join('\n \n');

  console.log('html', JSON.stringify(html));

  // Define email params
  const msg = {
    to: 'robinnagpal.tiet@gmail.com', // Change to your recipient
    from: 'robinnagpal.tiet@gmail.com', // Change to your verified sender
    subject: 'Compound Notifications',
    text: html,
    html,
  };

  // Send email
  await sgMail
    .send(msg)
    .then(() => console.log('Email sent'))
    .catch((error) => console.error(error));
};
