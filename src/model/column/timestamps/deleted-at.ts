import { addOptions } from '../../shared/model-service';

export function DeletedAt(target: any, propertyName: string): void {
  addOptions(target, {
    deletedAt: propertyName,
    timestamps: true,
    paranoid: true,
  });
}
