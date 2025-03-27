// types/navbar.types.ts
import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { SVGProps } from 'react';

// Define the exact type that Heroicons uses
export type HeroIconType = ForwardRefExoticComponent<
  Omit<SVGProps<SVGSVGElement>, 'ref'> & {
    title?: string;
    titleId?: string;
  } & RefAttributes<SVGSVGElement>
>;

export interface DropdownLink {
  label: string;
  href: string;
  icon: HeroIconType; // Use our specific HeroIconType
  description: string;
}

export type DropdownLinks = {
  [key: string]: DropdownLink[];
};

export type Notification = {
  id: number;
  text: string;
  read: boolean;
};
