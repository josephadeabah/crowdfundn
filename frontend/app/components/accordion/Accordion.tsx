// components/Accordion.tsx
import * as React from 'react';
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';

// Define types for the component props
interface AccordionItemWrapperProps {
  children: React.ReactNode;
  className?: string;
  value: string;
}

interface AccordionTriggerWrapperProps {
  children: React.ReactNode;
  className?: string;
}

interface AccordionContentWrapperProps {
  children: React.ReactNode;
  className?: string;
}

// AccordionItemWrapper component with type safety
const AccordionItemWrapper = React.forwardRef<
  HTMLDivElement,
  AccordionItemWrapperProps
>(({ children, className, ...props }, forwardedRef) => (
  <AccordionItem
    className={classNames(
      'mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:shadow-[0_0_0_2px] focus-within:shadow-mauve12',
      className,
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
  </AccordionItem>
));

// Ensure proper types for props and forwardRef for AccordionTriggerWrapper
const AccordionTriggerWrapper = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerWrapperProps
>(({ children, className, ...props }, forwardedRef) => (
  <AccordionTrigger
    className={classNames(
      'group flex h-[45px] flex-1 cursor-default items-center justify-between bg-mauve1 px-5 text-[15px] leading-none text-violet11 shadow-[0_1px_0] shadow-mauve6 outline-none hover:bg-mauve2',
      className,
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
    <ChevronDownIcon
      className="text-violet10 transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180"
      aria-hidden
    />
  </AccordionTrigger>
));

// AccordionContentWrapper component with type safety
const AccordionContentWrapper = React.forwardRef<
  HTMLDivElement,
  AccordionContentWrapperProps
>(({ children, className, ...props }, forwardedRef) => (
  <AccordionContent
    className={classNames(
      'overflow-hidden bg-mauve2 text-[15px] text-mauve11 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown',
      className,
    )}
    {...props}
    ref={forwardedRef}
  >
    <div className="px-5 py-[15px]">{children}</div>
  </AccordionContent>
));

export {
  AccordionItemWrapper,
  AccordionTriggerWrapper,
  AccordionContentWrapper,
};
