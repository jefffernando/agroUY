export const siteConfig = {
 name: 'Agro Uruguay',
 description: 'Guías, ideas y recursos para entender y producir en el agro uruguayo.',
 newsletterUrl: import.meta.env.PUBLIC_NEWSLETTER_URL || '',
 contactEmail: import.meta.env.PUBLIC_CONTACT_EMAIL || '',
};
if (siteConfig.newsletterUrl && !siteConfig.newsletterUrl.startsWith('https://')) throw new Error('Newsletter requiere una URL HTTPS');
