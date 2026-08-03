export type ProfileLinkId = 'github' | 'linkedin' | 'email' | 'youtube' | 'x';

export interface ProfileLink {
  id: ProfileLinkId;
  label: string;
  ariaLabel: string;
  href: string;
  external: boolean;
}

export const profileLinks: ProfileLink[] = [
  {
    id: 'github',
    label: 'GitHub',
    ariaLabel: 'Nika Koghuashvili on GitHub',
    href: 'https://github.com/nikakogho',
    external: true,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    ariaLabel: 'Nika Koghuashvili on LinkedIn',
    href: 'https://www.linkedin.com/in/nika-koghuashvili-4889991b4/',
    external: true,
  },
  {
    id: 'email',
    label: 'Email',
    ariaLabel: 'Email Nika Koghuashvili',
    href: 'mailto:nikakoghuashvili@gmail.com',
    external: false,
  },
  {
    id: 'youtube',
    label: 'YouTube',
    ariaLabel: 'Playground of Tomorrow on YouTube',
    href: 'https://www.youtube.com/@Playground_Of_Tomorrow/',
    external: true,
  },
  {
    id: 'x',
    label: 'X',
    ariaLabel: 'Nika Koghuashvili on X',
    href: 'https://x.com/nikakogho',
    external: true,
  },
];

export const cvUrl = 'https://drive.google.com/file/d/1SREtPTHUsvXUba58omBguLjQwEwq-m41/view?usp=sharing';
