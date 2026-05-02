export const SERVICE_OPTIONS = [
  {
    id: 'web-development-services',
    name: 'Web Development Services',
    shortName: 'Web Development',
    blurb: 'Custom websites, ecommerce builds, and business portals.',
  },
  {
    id: 'seo-services',
    name: 'SEO Services',
    shortName: 'SEO',
    blurb: 'Local SEO, technical fixes, and content growth support.',
  },
  {
    id: 'domain-name-registration',
    name: 'Domain Name Registration',
    shortName: 'Domain Registration',
    blurb: 'Secure the right domain name for your brand.',
  },
  {
    id: 'domain-name-transfer',
    name: 'Domain Name Transfer',
    shortName: 'Domain Transfer',
    blurb: 'Move your domain safely with zero downtime planning.',
  },
  {
    id: 'domain-name-renewal',
    name: 'Domain Name Renewal',
    shortName: 'Domain Renewal',
    blurb: 'Keep important domains active and protected.',
  },
  {
    id: 'domain-name-management',
    name: 'Domain Name Management',
    shortName: 'Domain Management',
    blurb: 'DNS, nameserver, and ownership management assistance.',
  },
  {
    id: 'domain-name-prices',
    name: 'Domain Name Prices',
    shortName: 'Domain Prices',
    blurb: 'Transparent pricing pages for popular domain extensions.',
  },
  {
    id: 'premium-cloud-dns',
    name: 'Premium Cloud DNS',
    shortName: 'Cloud DNS',
    blurb: 'Fast, resilient DNS built for performance and uptime.',
  },
];

export function getServiceOptionById(serviceId) {
  return SERVICE_OPTIONS.find((service) => service.id === serviceId) ?? null;
}
