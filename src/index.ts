import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

const CTLAB_UID = process.env.CTLAB_UID;
const TELEGRAM_USER = process.env.TELEGRAM_USER;
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

class ConfigError extends Error {}

if (!CTLAB_UID || CTLAB_UID.length !== 32) throw new ConfigError('CTLAB_UID');
if (!TELEGRAM_USER || TELEGRAM_USER.length < 6) throw new ConfigError('TELEGRAM_USER');
if (!TELEGRAM_TOKEN || TELEGRAM_TOKEN.length < 30) throw new ConfigError('TELEGRAM_TOKEN');

const CONFIG = { CTLAB_UID, TELEGRAM_USER, TELEGRAM_TOKEN };
const SUCCESS_MESSAGE = 'La jornada ha sido validada correctamente. Gracias por su colaboración.';

function getDate() {
  const now = new Date();
  return `${now.getDate().toString().padStart(2, '0')}${(now.getMonth() + 1)
    .toString()
    .padStart(2, '0')}${now.getFullYear().toString()}`;
}

function sendMessage(message: string) {
  return fetch(
    `https://api.telegram.org/bot${CONFIG.TELEGRAM_TOKEN}/sendMessage?chat_id=${CONFIG.TELEGRAM_USER}&text=${message}`,
  );
}

async function main() {
  const url = `https://app.controllaboral.es/RegUser.aspx?c=1506&u=${CONFIG.CTLAB_UID}&d=${getDate()}&v=1`;
  const { window } = await fetch(url)
    .then((r) => r.text())
    .then((t) => new JSDOM(t));

  const element = window.document.querySelector('#ContentPlaceHolder1_lblMensajeConfirmacion')
  const isOk = element && element.innerHTML === SUCCESS_MESSAGE;
  await sendMessage(isOk ? '🤤🤤🤤🤤🤤🤤 LABURIÓÓÓÓ' : '🚨🚨🚨🚨🚨🚨 AAAAH NO LABURIÓ');
}

main().catch((e) => {
  console.error(`Error:\n  CONFIG: ${JSON.stringify(CONFIG)}\n\n${e}`);
});
