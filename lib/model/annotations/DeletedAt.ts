import 'reflect-metadata';
import {addOptions} from "../models";

export function DeletedAt(target: any, propertyName: string): void {

  addOptions(target, {
    deletedAt: propertyName,
    timestamps: true,
    paranoid: true
  });
}
