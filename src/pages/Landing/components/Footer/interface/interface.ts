export enum ESOCIAL {
  TELEGRAM = 'telegram',
  VK = 'vk',
  MAIL = 'mail',
}

export interface IFooterSocialLinkProps {
  type: ESOCIAL;
  link: string;
}
