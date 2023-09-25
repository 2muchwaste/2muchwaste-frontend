export enum WebsiteRole {
  CUSTOMER = 'customer',
  OPERATOR = 'operator',
  ADMIN = 'admin'
}

export class InvalidRoleError extends Error {
  constructor(invalidRole: string) {
    super(`Invalid role: ${invalidRole}`);
    this.name = 'InvalidRoleError';
  }
}

export class WebSiteRoleHelper {

  static getRoleByName(roleName: string): WebsiteRole {
    const normalizedRoleName = roleName.trim().toLowerCase();

    switch (normalizedRoleName) {
      case WebsiteRole.CUSTOMER:
        return WebsiteRole.CUSTOMER
      case WebsiteRole.OPERATOR:
        return WebsiteRole.CUSTOMER
      case WebsiteRole.ADMIN:
        return WebsiteRole.ADMIN
      default:
        throw new InvalidRoleError(normalizedRoleName)

    }
  }
}
