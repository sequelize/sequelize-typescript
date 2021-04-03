import { addOptions } from '../../shared/model-service';

export function CreatedAt(target: any, propertyName: string): void {
  addOptions(target, {
    createdAt: propertyName,
    timestamps: true,
  });
}
