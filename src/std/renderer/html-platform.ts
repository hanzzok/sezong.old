import { Platform } from '../../api/platform';

export const HtmlPlatform = new Platform<string>('HTML', (a, b) => a + b, '');
