import 'reflect-metadata';
/**
 * Sets primary key option true for annotated property.
 * This annotation will not work together with Column(options) annotation,
 * but has to be used with Column (Please notice the difference with and
 * without options)
 */
export declare function PrimaryKey(target: any, propertyName: string): void;
