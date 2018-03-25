import 'reflect-metadata';
import {addOptions} from "../models";

export function CreatedAt(target: any, propertyName: string): void {

  addOptions(target, {
    createdAt: propertyName,
    timestamps: true
  });
}
