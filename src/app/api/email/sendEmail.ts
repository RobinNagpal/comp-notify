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
  const provider = ethers.getDefaultProvider('homestead', { etherscan: process.env.ETHERSCAN_API_KEY });
  if (
    notification.event === EventsEnum.SupplyCollateral ||
    notification.event === EventsEnum.WithdrawCollateral ||
    notification.event === EventsEnum.TransferCollateral ||
    notification.event === EventsEnum.WithdrawReserves
  ) {
    const source = readFileSync('./src/handlebars/CompNotification.hbs', 'utf8');
    const template = Handlebars.compile(source);
    const assetDetails = await getAssetDetails(notification.payload.asset, notification.payload.amount, provider);
    return template({ notification, assetDetails });
  }

  if (notification.event === EventsEnum.Supply || notification.event === EventsEnum.Withdraw) {
    const source = readFileSync('./src/handlebars/CompNotification.hbs', 'utf8');
    const template = Handlebars.compile(source);
    const assetDetails = await getAssetDetails('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', notification.payload.amount, provider);
    return template({ notification, assetDetails });
  }
  if (notification.event === EventsEnum.AbsorbDebt) {
    const source = readFileSync('./src/handlebars/AbsorbDebtNotification.hbs', 'utf8');
    const template = Handlebars.compile(source);
    const assetDetails = getAssetDetails('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', notification.payload.basePaidOut.toString(), provider);
    return template({ notification, assetDetails });
  }
  if (notification.event === EventsEnum.AbsorbCollateral) {
    const source = readFileSync('./src/handlebars/AbsorbCollateralNotification.hbs', 'utf8');
    const template = Handlebars.compile(source);
    const assetDetails = getAssetDetails('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', notification.payload.collateralAbsorbed.toString(), provider);
    return template({ notification, assetDetails });
  }
  if (notification.event === EventsEnum.PauseAction) {
    const source = readFileSync('./src/handlebars/PauseActionNotification.hbs', 'utf8');
    const template = Handlebars.compile(source);
    return template({ notification });
  }
  return '';
}

export const sendNotificationEmail = async (events: CompoundNotification<any>[], emails: string[]) => {
  // Generate an HTML email body

  const htmls: string[] = [];
  for (const event of events) {
    htmls.push(await getNotificationBody(event));
  }
  const html = htmls.join('\n \n');

  console.log('html', JSON.stringify(html));

  for (const email of emails) {
    // Define email params
    const msg = {
      to: email, // Change to your recipient
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
  }
};
