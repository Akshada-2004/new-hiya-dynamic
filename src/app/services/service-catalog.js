export const SERVICE_OPTIONS = [
  {
    id: 'web-development-services',
    name: 'Web Development Services',
    shortName: 'Web Development',
    blurb: 'Custom websites, ecommerce builds, and business portals.',
    spintaxBlurb:
      '{Custom|Modern|High-performance} websites, ecommerce builds, and business portals {planned for growth|built for speed|designed for conversions}.',
  },
  {
    id: 'seo-services',
    name: 'SEO Services',
    shortName: 'SEO',
    blurb: 'Local SEO, technical fixes, and content growth support.',
    spintaxBlurb:
      '{Local SEO|Search optimisation|SEO growth}, technical fixes, and content support {for stronger visibility|to improve rankings|for steady organic growth}.',
  },
  {
    id: 'domain-name-registration',
    name: 'Domain Name Registration',
    shortName: 'Domain Registration',
    blurb: 'Secure the right domain name for your brand.',
    spintaxBlurb:
      '{Secure|Register|Choose} the right domain name for your brand {with clear guidance|without confusion|with quick setup}.',
  },
  {
    id: 'domain-name-transfer',
    name: 'Domain Name Transfer',
    shortName: 'Domain Transfer',
    blurb: 'Move your domain safely with zero downtime planning.',
    spintaxBlurb:
      '{Move|Transfer|Shift} your domain safely with {zero-downtime planning|careful DNS handling|smooth migration support}.',
  },
  {
    id: 'domain-name-renewal',
    name: 'Domain Name Renewal',
    shortName: 'Domain Renewal',
    blurb: 'Keep important domains active and protected.',
    spintaxBlurb:
      '{Keep|Maintain|Protect} important domains so they stay {active|renewed|secure} without last-minute issues.',
  },
  {
    id: 'domain-name-management',
    name: 'Domain Name Management',
    shortName: 'Domain Management',
    blurb: 'DNS, nameserver, and ownership management assistance.',
    spintaxBlurb:
      '{DNS|Nameserver|Domain ownership} management assistance for {stable setup|clean control|reliable operations}.',
  },
  {
    id: 'domain-name-prices',
    name: 'Domain Name Prices',
    shortName: 'Domain Prices',
    blurb: 'Transparent pricing pages for popular domain extensions.',
    spintaxBlurb:
      '{Transparent|Clear|Simple} pricing pages for popular domain extensions {so you can compare quickly|with practical buying guidance|without hidden confusion}.',
  },
  {
    id: 'premium-cloud-dns',
    name: 'Premium Cloud DNS',
    shortName: 'Cloud DNS',
    blurb: 'Fast, resilient DNS built for performance and uptime.',
    spintaxBlurb:
      '{Fast|Resilient|Performance-focused} DNS built for {uptime|speed|reliability} and smooth business operations.',
  },
];

export function getServiceOptionById(serviceId) {
  return SERVICE_OPTIONS.find((service) => service.id === serviceId) ?? null;
}
