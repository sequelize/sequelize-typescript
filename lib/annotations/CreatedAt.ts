import 'reflect-metadata';
import {addOptions} from "../services/models";

export function CreatedAt(target: any, propertyName: string): void {

  addOptions(target, {
    createdAt: propertyName,
    timestamps: true
  });
}
