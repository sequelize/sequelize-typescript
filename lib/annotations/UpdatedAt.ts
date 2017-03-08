import 'reflect-metadata';
import {addOptions} from "../services/models";

export function UpdatedAt(target: any, propertyName: string): void {

  addOptions(target, {
    updatedAt: propertyName,
    timestamps: true
  });
}
