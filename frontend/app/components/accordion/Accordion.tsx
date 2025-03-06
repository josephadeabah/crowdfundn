import * as React from 'react';
import {
  Accordion,
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
      'mt-0 overflow-hidden first:rounded-t last:rounded-b focus-within:relative focus-within:z-10 focus-within:shadow-sm',
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
      'group flex h-[45px] flex-1 cursor-pointer items-center justify-between bg-white p-4 text-sm leading-none text-gray-700 outline-none hover:bg-gray-200',
      className,
    )}
    {...props}
    ref={forwardedRef}
  >
    {children}
    <ChevronDownIcon
      className="text-gray-600 transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180"
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
      'overflow-hidden bg-gray-50 text-sm text-gray-700 transition-all duration-300 ease-in-out',
      className,
    )}
    {...props}
    ref={forwardedRef}
  >
    <div className="px-5 py-4">{children}</div>
  </AccordionContent>
));

export {
  Accordion,
  AccordionItemWrapper,
  AccordionTriggerWrapper,
  AccordionContentWrapper,
};
