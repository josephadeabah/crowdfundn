import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/card/Card';

type CardBannerProps = {
  children: React.ReactNode;
  title?: string;
  description?: string;
  footer?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
};

const CardBanner = ({ children, ...props }: CardBannerProps) => {
  return (
    <Card
      onClick={props.onClick}
      className="w-full sm:w-1/2 rounded-none shadow-none bg-white dark:bg-gray-950 border-0"
    >
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
        <CardDescription>{props.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div>{children}</div>
      </CardContent>
      <CardFooter>
        <div>{props.footer}</div>
      </CardFooter>
    </Card>
  );
};

export default CardBanner;
