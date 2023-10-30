/// <reference types='React' />

declare type RFC<T = {}> = React.FC<T & { children?: React.ReactNode }>;

declare type AnyObj<T = any> = { [key: string]: T };
