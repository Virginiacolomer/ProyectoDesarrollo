// Este archivo une varios decoradores para hacer nuestro sistema mas escalable
import { applyDecorators, UseGuards } from "@nestjs/common";
import { Role } from "../../common/enums/role.enum";
import { AuthGuard } from "../guard/auth.guard";
import { RolesGuard } from "../guard/roles.guard";
import { Roles } from "./roles.decorator";

export function Auth(role: Role) {
  return applyDecorators(Roles(role), UseGuards(AuthGuard, RolesGuard));
}