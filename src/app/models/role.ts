export enum WebsiteRole {
  CUSTOMER = '65b21ceb02edf1845a13d15d',
  OPERATOR = '65b21ceb02edf1845a13d15e', 
  ADMIN = '65b21ceb02edf1845a13d15f'
}

export class InvalidRoleError extends Error {
  constructor(invalidRole: string) {
    super(`Invalid role: ${invalidRole}`);
    this.name = 'InvalidRoleError';
  }
}

export class WebSiteRoleHelper {

  static getNameRole(role: WebsiteRole): string {
    switch (role) {
      case WebsiteRole.CUSTOMER:
        return 'customer'
      case WebsiteRole.OPERATOR:
        return 'operator'
      case WebsiteRole.ADMIN:
        return 'admin'
      default:
        throw new InvalidRoleError(role)

    }
  }

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
