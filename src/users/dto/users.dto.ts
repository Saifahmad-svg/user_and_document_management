import { IsEnum } from 'class-validator';
import { UserRole } from '../users.entity';

export class UpdateRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}
